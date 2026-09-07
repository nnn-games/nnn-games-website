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
 *   decks/company, nnn, jumpstart        ->  /company, /nnn, /jumpstart
 *   decks/shared                         ->  /slides/shared   (덱 공용 런타임, 기존 URL 유지)
 *   CNAME, robots.txt                    ->  /
 *   site/styles/tailwind.css  --(tailwind)-->  /css/style.css
 *   생성: sitemap.xml, .nojekyll
 *
 * Usage:
 *   node scripts/build.js            전체 빌드 (dist 초기화)
 *   node scripts/build.js --watch    변경 감시하며 증분 재빌드
 *   node scripts/build.js --serve    dist/ 를 http://localhost:8080 으로 서비스 (보통 --watch 와 함께)
 */

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://www.triplengames.com';
const PORT = process.env.PORT || 8080;

// [소스(루트 기준), dist 안의 대상] 매핑. 새 최상위 디렉터리를 서비스하려면 여기에 추가한다.
const MAP = [
  ['site', '.'],
  ['shared/images', 'images'],
  ['shared/assets', 'assets'],
  ['shared/data', 'data'],
  ['decks/company', 'company'],
  ['decks/nnn', 'nnn'],
  ['decks/jumpstart', 'jumpstart'],
  ['decks/shared', 'slides/shared'],
  ['CNAME', 'CNAME'],
  ['robots.txt', 'robots.txt']
];
// 매핑된 디렉터리 안에서도 제외할 것: 문서/원고 디렉터리, 문서·디자인 원본, 숨김 파일, Tailwind 소스
// 주의: .txt 는 전역 제외하지 않는다. shared/assets/towerfloodrace/videos.txt 처럼 런타임에 fetch 되는 파일이 있다.
const EXCLUDED_SEGMENTS = new Set(['docs', 'node_modules', 'styles']);
const EXCLUDED_EXT = new Set(['.md', '.psd', '.ai', '.sketch', '.fig']);
// 개별 제외 파일 (루트 기준, 슬래시 구분). 서비스에 필요 없는 원고·메모.
const EXCLUDED_PATHS = new Set(['decks/jumpstart/page04image.txt', 'decks/jumpstart/page06image.txt']);
const WATCH_DIRS = ['site', 'shared', 'decks'];

const args = new Set(process.argv.slice(2));
const isWatch = args.has('--watch');
const isServe = args.has('--serve');

function shouldCopy(absPath) {
  const rel = path.relative(ROOT, absPath);
  if (rel === '') return true;
  const segments = rel.split(path.sep);
  if (segments.some((seg) => EXCLUDED_SEGMENTS.has(seg) || seg.startsWith('.'))) return false;
  if (EXCLUDED_PATHS.has(segments.join('/'))) return false;
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

function buildCss() {
  const bin = require.resolve('tailwindcss/lib/cli.js', { paths: [ROOT] });
  const result = spawnSync(
    process.execPath,
    [bin, '-i', 'site/styles/tailwind.css', '-o', 'dist/css/style.css', '--minify'],
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

function writeSitemap() {
  const urls = [];
  const rootHtml = fs
    .readdirSync(DIST)
    .filter((name) => name.endsWith('.html'))
    .sort();
  for (const file of rootHtml) urls.push(file === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${file}`);
  for (const dir of ['company', 'nnn', 'jumpstart', 'privacy']) {
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
  if (clean) fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  for (const [srcRel, destRel] of MAP) copyMapped(srcRel, destRel);
  buildCss();
  fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
  const { pages, urls } = writeSitemap();
  const files = walkFiles(DIST);
  const bytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  console.log(
    `dist/ 생성 완료: 파일 ${files.length}개, ${(bytes / 1048576).toFixed(1)} MB, 페이지 ${pages}개, sitemap ${urls}개 URL (${Date.now() - started}ms)`
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
        build({ clean: false });
      } catch (error) {
        console.error(`[watch] 재빌드 실패: ${error.message}`);
      }
    }, 200);
  };
  for (const dir of WATCH_DIRS) {
    const abs = path.join(ROOT, dir);
    if (fs.existsSync(abs)) fs.watch(abs, { recursive: true }, trigger);
  }
  console.log(`[watch] ${WATCH_DIRS.join(', ')} 감시 중 (Ctrl+C 로 종료)`);
}

function serve() {
  const child = runBin('http-server/bin/http-server', ['dist', '-p', String(PORT), '-c-1', '-s']);
  child.on('exit', (code) => process.exit(code || 0));
  console.log(`[serve] http://localhost:${PORT}  (dist/ 서비스)`);
}

try {
  build({ clean: true });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
if (isWatch) watch();
if (isServe) serve();
