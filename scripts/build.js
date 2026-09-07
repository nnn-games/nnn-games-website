#!/usr/bin/env node
/**
 * 배포 산출물 조립: 저장소 루트 -> dist/
 * - 서비스에 필요한 파일만 복사한다 (소스, 설정, 문서, 보관 파일 제외)
 * - css/style.css 는 `npm run build:css` 로 먼저 생성되어 있어야 한다 (`npm run build` 가 순서를 보장)
 * - sitemap.xml 과 .nojekyll 을 생성한다
 * - URL 구조는 저장소 루트를 그대로 서비스하던 때와 동일하게 유지한다
 *
 * Usage: node scripts/build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://www.triplengames.com';

// 복사할 디렉터리 (루트 기준). 이 목록에 없는 디렉터리는 배포되지 않는다.
const INCLUDE_DIRS = ['css', 'js', 'data', 'images', 'assets', 'slides', 'company', 'nnn', 'jumpstart', 'privacy'];
// 복사할 루트 파일. 루트 *.html 은 자동으로 포함된다.
const INCLUDE_FILES = ['CNAME', 'robots.txt'];
// 포함 디렉터리 안에서도 제외할 것: 문서/원고 디렉터리, 문서·메모 파일, 숨김 파일
const EXCLUDED_SEGMENTS = new Set(['docs', 'node_modules']);
const EXCLUDED_EXT = new Set(['.md', '.txt', '.psd', '.ai', '.sketch', '.fig']);

function shouldCopy(absPath) {
  const rel = path.relative(ROOT, absPath);
  if (rel === '') return true;
  const segments = rel.split(path.sep);
  if (segments.some((seg) => EXCLUDED_SEGMENTS.has(seg) || seg.startsWith('.'))) return false;
  if (fs.statSync(absPath).isFile() && EXCLUDED_EXT.has(path.extname(rel).toLowerCase())) return false;
  return true;
}

function copyInto(relPath) {
  const src = path.join(ROOT, relPath);
  if (!fs.existsSync(src)) {
    console.warn(`  [skip] ${relPath} 없음`);
    return;
  }
  const dest = path.join(DIST, relPath);
  if (fs.statSync(src).isFile()) {
    // 명시적으로 나열한 루트 파일(robots.txt 등)은 확장자 제외 규칙을 적용하지 않는다.
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    return;
  }
  fs.cpSync(src, dest, { recursive: true, filter: shouldCopy });
}

function walkFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function buildSitemap(rootHtml) {
  const urls = [];
  for (const file of rootHtml) {
    urls.push(file === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${file}`);
  }
  for (const dir of ['company', 'nnn', 'jumpstart', 'privacy']) {
    if (fs.existsSync(path.join(DIST, dir, 'index.html'))) urls.push(`${SITE_URL}/${dir}/`);
  }
  const body = urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function main() {
  const stylePath = path.join(ROOT, 'css', 'style.css');
  if (!fs.existsSync(stylePath) || fs.statSync(stylePath).size === 0) {
    console.error('css/style.css 가 없습니다. 먼저 `npm run build:css` 를 실행하세요 (`npm run build` 는 자동으로 실행합니다).');
    process.exit(1);
  }

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const rootHtml = fs
    .readdirSync(ROOT)
    .filter((name) => name.endsWith('.html'))
    .sort();
  for (const file of [...rootHtml, ...INCLUDE_FILES]) copyInto(file);
  for (const dir of INCLUDE_DIRS) copyInto(dir);

  fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap(rootHtml));

  const files = walkFiles(DIST);
  const bytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  console.log(`dist/ 생성 완료: 파일 ${files.length}개, ${(bytes / 1048576).toFixed(1)} MB`);
  console.log(`  페이지 ${rootHtml.length}개 + 덱/개인정보 디렉터리, sitemap.xml ${rootHtml.length + 4}개 URL`);
}

main();
