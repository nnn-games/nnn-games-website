#!/usr/bin/env node
/**
 * 배포 산출물 조립: site/ + decks/ + shared/ -> dist/
 *
 * 소스는 역할별 디렉터리로 나뉘어 있지만, 서비스 URL 은 예전 단일 루트 구조를 그대로 유지한다.
 * HTML/JS/CSS 안의 상대 경로(`css/style.css`, `../images/...`, `../slides/shared/deck.js`)는
 * dist/ 안에서 풀리므로 소스 파일의 참조를 바꿀 필요가 없다.
 *
 *   site/*.html, site/js, site/privacy   ->  /            (홈페이지)
 *   shared/images, assets, data          ->  /images, /assets, /data
 *   decks/<slug>  (decks/decks.json 에서 active 인 덱)  ->  /<slug>
 *   decks/shared                         ->  /slides/shared   (덱 공용 런타임, 기존 URL 유지)
 *   site/CNAME, site/robots.txt          ->  / (site 매핑에 포함)
 *   site/styles/tailwind.css  --(tailwind)-->  /css/style.css
 *   생성: sitemap.xml, .nojekyll
 *
 * Usage:
 *   node scripts/build.js            전체 빌드 (dist 초기화)
 *   node scripts/build.js --watch    변경 감시하며 재빌드 (삭제·공개 철회 반영)
 *   node scripts/build.js --serve    dist/ 를 http://localhost:8080 으로 서비스 (보통 --watch 와 함께)
 *   node scripts/build.js --out tmp/preview --include-drafts  초안 포함 격리 빌드
 */

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { loadDecks } = require('./lib/deck-policy');
const { resolveBuildOutput } = require('./lib/build-output');
const { loadProjectContents, compileDeckScript, compileProjectHtml } = require('./lib/project-content');

const ROOT = path.join(__dirname, '..');
const args = new Set(process.argv.slice(2));
const isWatch = args.has('--watch');
const isServe = args.has('--serve');
const outIndex = process.argv.indexOf('--out');
if (outIndex !== -1 && (!process.argv[outIndex + 1] || process.argv[outIndex + 1].startsWith('--'))) {
  throw new Error('--out 뒤에 tmp/<하위 폴더>를 지정하세요.');
}
const DIST = resolveBuildOutput(ROOT, outIndex === -1 ? 'dist' : process.argv[outIndex + 1]);
const OUTPUT = path.relative(ROOT, DIST);
if (args.has('--include-drafts') && OUTPUT === 'dist' && !isWatch) {
  throw new Error('초안 일회성 빌드는 --out tmp/<하위 폴더>와 함께 실행하세요.');
}
const SITE_URL = 'https://www.triplengames.com';
const PORT = process.env.PORT || 8080;

// [소스(루트 기준), dist 안의 대상] 매핑. 새 최상위 디렉터리를 서비스하려면 여기에 추가한다.
// 덱(decks/<slug>)은 여기 적지 않는다. decks/decks.json 레지스트리의 공개 정책으로 선택한다.
const STATIC_MAP = [
  ['site', '.'],
  ['shared/images', 'images'],
  ['shared/assets', 'assets'],
  ['shared/data', 'data'],
  ['decks/shared', 'slides/shared']
];
function buildMap(decks) {
  return [...STATIC_MAP, ...decks.map((deck) => [`decks/${deck.slug}`, deck.slug])];
}
// 매핑된 디렉터리 안에서도 제외할 것: 문서/원고 디렉터리, 문서·디자인 원본, 숨김 파일, Tailwind 소스
// 주의: .txt 는 전역 제외하지 않는다. shared/assets/www-tower-flood-race/videos.txt 처럼 런타임에 fetch 되는 파일이 있다.
// _partials 는 빌드 시 인라인되므로 배포하지 않고, pdf 디렉터리는 export-decks 워크플로가 대체한다.
const EXCLUDED_SEGMENTS = new Set(['docs', 'node_modules', 'styles', '_partials', 'pdf']);
const EXCLUDED_EXT = new Set(['.md', '.psd', '.ai', '.sketch', '.fig']);
const WATCH_DIRS = ['site', 'shared', 'decks'];
const WATCH_FILES = ['tailwind.config.js', 'postcss.config.js'];

function shouldCopy(absPath) {
  const rel = path.relative(ROOT, absPath);
  if (rel === '') return true;
  const segments = rel.split(path.sep);
  if (segments.some((seg) => EXCLUDED_SEGMENTS.has(seg) || seg.startsWith('.'))) return false;
  if (fs.statSync(absPath).isFile() && EXCLUDED_EXT.has(path.extname(rel).toLowerCase())) return false;
  return true;
}

function copyMapped(srcRel, destRel) {
  const src = path.join(ROOT, srcRel);
  if (!fs.existsSync(src)) {
    console.warn(`  [skip] ${srcRel} 없음`);
    return;
  }
  const dest = path.join(DIST, destRel);
  if (fs.statSync(src).isFile()) {
    // 명시적으로 나열한 루트 파일(robots.txt 등)은 확장자 제외 규칙을 적용하지 않는다.
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    return;
  }
  fs.cpSync(src, dest, { recursive: true, filter: shouldCopy });
}

// 설치된 패키지의 CLI 를 node 로 직접 실행한다 (shell 불필요, npx 탐색 비용 없음).
function runBin(pkgBin, args, options = {}) {
  const bin = require.resolve(pkgBin, { paths: [ROOT] });
  return spawn(process.execPath, [bin, ...args], { cwd: ROOT, stdio: 'inherit', ...options });
}

// ---- HTML 파셜 인라인 ----
// site/*.html 의 `<!-- @include name key="value" -->` 를 site/_partials/<name>.html 로 치환한다.
// 파셜 안의 `{{if key=value}}...{{/if}}` 는 마커의 속성과 일치할 때만 남는다 (예: 활성 메뉴).
const PARTIALS_DIR = path.join(ROOT, 'site', '_partials');
const INCLUDE_RE = /<!--\s*@include\s+([a-z0-9-]+)((?:\s+[a-z]+="[^"]*")*)\s*-->/g;

function renderPartial(name, attrs) {
  const file = path.join(PARTIALS_DIR, `${name}.html`);
  if (!fs.existsSync(file)) throw new Error(`파셜이 없습니다: site/_partials/${name}.html`);
  const vars = {};
  for (const m of attrs.matchAll(/([a-z]+)="([^"]*)"/g)) vars[m[1]] = m[2];
  return fs
    .readFileSync(file, 'utf8')
    .replace(/\r\n/g, '\n')
    .replace(/\{\{if ([a-z]+)=([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_m, key, value, body) => (vars[key] === value ? body : ''));
}

function inlinePartials() {
  if (!fs.existsSync(PARTIALS_DIR)) return 0;
  let count = 0;
  for (const name of fs.readdirSync(DIST).filter((n) => n.endsWith('.html'))) {
    const file = path.join(DIST, name);
    const html = fs.readFileSync(file, 'utf8');
    const out = html.replace(INCLUDE_RE, (_m, partial, attrs) => {
      count += 1;
      return renderPartial(partial, attrs).replace(/^\s+/, '');
    });
    if (out !== html) fs.writeFileSync(file, out);
  }
  return count;
}

function buildCss() {
  const bin = require.resolve('tailwindcss/lib/cli.js', { paths: [ROOT] });
  const result = spawnSync(
    process.execPath,
    [bin, '-i', 'site/styles/tailwind.css', '-o', `${OUTPUT}/css/style.css`, '--minify'],
    { cwd: ROOT, stdio: 'inherit' }
  );
  if (result.status !== 0) throw new Error('Tailwind 빌드 실패');
}

function walkFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

// 발표자료는 검색에서 제외한다. robots 메타와 sitemap을 함께 맞춘다.
function applyDeckRobots(decks) {
  for (const deck of decks) {
    const file = path.join(DIST, deck.slug, 'index.html');
    const html = fs.readFileSync(file, 'utf8');
    const robots = 'noindex, nofollow';
    const meta = `<meta name="robots" content="${robots}">`;
    const withoutRobots = html.replace(/<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*>/gi, '');
    if (!/<\/head\s*>/i.test(withoutRobots)) throw new Error(`deck '${deck.slug}': head 종료 태그가 없습니다.`);
    fs.writeFileSync(file, withoutRobots.replace(/<\/head\s*>/i, `    ${meta}\n</head>`));
  }
}

// sitemap: 회사 홈페이지만 포함한다. 발표자료는 모두 검색에서 제외한다.
function writeSitemap() {
  const urls = [];
  const rootHtml = fs
    .readdirSync(DIST)
    .filter((name) => name.endsWith('.html'))
    .sort();
  for (const file of rootHtml) urls.push(file === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${file}`);
  const listedDirs = ['privacy'];
  for (const dir of listedDirs) {
    if (fs.existsSync(path.join(DIST, dir, 'index.html'))) urls.push(`${SITE_URL}/${dir}/`);
  }
  const body = urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n');
  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
  return { pages: rootHtml.length, urls: urls.length };
}

function build({ clean }) {
  const started = Date.now();
  const decks = loadDecks(ROOT, { includeDraft: isWatch || args.has('--include-drafts') });
  const { projects, contents } = loadProjectContents(ROOT);
  if (clean) fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  for (const [srcRel, destRel] of buildMap(decks)) copyMapped(srcRel, destRel);
  if (fs.existsSync(path.join(DIST, 'data/projects.json'))) {
    fs.writeFileSync(path.join(DIST, 'data/projects.json'), JSON.stringify(projects, null, 2) + '\n');
  }
  for (const file of fs.readdirSync(DIST).filter((name) => name.endsWith('.html'))) {
    const target = path.join(DIST, file);
    fs.writeFileSync(target, compileProjectHtml(fs.readFileSync(target, 'utf8'), contents));
  }
  for (const deck of decks) {
    const html = path.join(DIST, deck.slug, 'index.html');
    fs.writeFileSync(html, compileProjectHtml(fs.readFileSync(html, 'utf8'), contents, deck.slug));
    const script = path.join(DIST, deck.slug, 'slides.js');
    if (fs.existsSync(script)) fs.writeFileSync(script, compileDeckScript(fs.readFileSync(script, 'utf8'), contents, deck.slug));
  }
  const includes = inlinePartials();
  applyDeckRobots(decks);
  buildCss();
  fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
  const { pages, urls } = writeSitemap();
  const files = walkFiles(DIST);
  const bytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  console.log(
    `${OUTPUT}/ 생성 완료: 파일 ${files.length}개, ${(bytes / 1048576).toFixed(1)} MB, 페이지 ${pages}개(파셜 ${includes}건 인라인), 덱 ${decks.length}개(${decks.map((d) => d.slug).join(', ')}), sitemap ${urls}개 URL (${Date.now() - started}ms)`
  );
}

function watch() {
  let timer = null;
  const trigger = (event, file) => {
    if (file && /(^|[\\/])\./.test(file)) return; // 숨김/임시 파일 무시
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(`\n[watch] ${file || event} 변경 -> 재빌드`);
      try {
        build({ clean: true });
      } catch (error) {
        console.error(`[watch] 재빌드 실패: ${error.message}`);
      }
    }, 200);
  };
  for (const dir of WATCH_DIRS) {
    const abs = path.join(ROOT, dir);
    if (fs.existsSync(abs)) fs.watch(abs, { recursive: true }, trigger);
  }
  for (const file of WATCH_FILES) {
    const abs = path.join(ROOT, file);
    if (fs.existsSync(abs)) fs.watch(abs, (event) => trigger(event, file));
  }
  console.log(`[watch] ${[...WATCH_DIRS, ...WATCH_FILES].join(', ')} 감시 중 (Ctrl+C 로 종료)`);
}

function serve() {
  const child = runBin('http-server/bin/http-server', [OUTPUT, '-p', String(PORT), '-c-1', '-s']);
  child.on('exit', (code) => process.exit(code || 0));
  console.log(`[serve] http://localhost:${PORT}  (${OUTPUT}/ 서비스)`);
}

try {
  build({ clean: true });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
if (isWatch) watch();
if (isServe) serve();
