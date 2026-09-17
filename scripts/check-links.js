#!/usr/bin/env node
/**
 * 내부 링크·에셋 경로 검사 (네트워크 사용 없음)
 *
 * 소스가 site/ decks/ shared/ 로 나뉘어 있고 상대 경로는 배포 구조 기준으로 쓰이므로,
 * 실제로 서비스되는 형태인 dist/ 를 검사한다. 먼저 `npm run build` 가 실행되어 있어야 한다
 * (`npm run check` 가 순서를 보장한다).
 *
 * - HTML: href / src / poster / og:image / twitter:image
 * - CSS: url(...)
 * - data/projects.json: image, detailPage
 * - js/project-details/*.js: 'assets/...' 또는 'images/...' 문자열 리터럴
 *
 * Usage: node scripts/check-links.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
let errors = 0;
let checked = 0;

function fail(message) {
  errors += 1;
  console.error(`  [ERROR] ${message}`);
}

function isExternal(value) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\s*$)/i.test(value);
}

function stripQuery(value) {
  return value.split(/[?#]/)[0];
}

function exists(baseDir, ref) {
  let target = stripQuery(ref);
  try {
    target = decodeURIComponent(target); // 'LOOT-BUILD%20CHOICE.png' 같은 인코딩 경로
  } catch (_error) {
    // 잘못된 인코딩이면 원문 그대로 검사한다.
  }
  if (target === '') return true;
  const abs = target.startsWith('/') ? path.join(DIST, target) : path.resolve(baseDir, target);
  if (!fs.existsSync(abs)) return false;
  // 디렉터리 링크(/company/)는 index.html 이 있어야 한다.
  if (fs.statSync(abs).isDirectory()) return fs.existsSync(path.join(abs, 'index.html'));
  return true;
}

// baseDir 를 주면 그 디렉터리 기준으로, 없으면 relFile 이 있는 디렉터리 기준으로 상대 경로를 푼다.
function checkRefs(relFile, refs, baseDir = path.dirname(path.join(DIST, relFile))) {
  for (const ref of refs) {
    if (isExternal(ref)) continue;
    checked += 1;
    if (!exists(baseDir, ref)) fail(`dist/${relFile}: '${ref}' 파일이 없습니다.`);
  }
}

function listFiles(dir, predicate, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, predicate, acc);
    else if (predicate(entry.name)) acc.push(path.relative(DIST, full));
  }
  return acc;
}

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/ 가 없습니다. 먼저 `npm run build` 를 실행하세요.');
  process.exit(1);
}

// HTML
const htmlFiles = listFiles(DIST, (name) => name.endsWith('.html'));
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(DIST, file), 'utf8');
  const refs = [];
  for (const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) refs.push(match[1]);
  for (const match of html.matchAll(/<meta[^>]+(?:property|name)="(?:og:image|twitter:image)"[^>]+content="([^"]+)"/g)) refs.push(match[1]);
  checkRefs(file, refs);
}
console.log(`  HTML ${htmlFiles.length}개`);

// CSS
const cssFiles = listFiles(DIST, (name) => name.endsWith('.css'));
for (const file of cssFiles) {
  const css = fs.readFileSync(path.join(DIST, file), 'utf8');
  const refs = [...css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]).filter((v) => !v.startsWith('data:'));
  checkRefs(file, refs);
}
console.log(`  CSS ${cssFiles.length}개`);

// data/projects.json (루트 HTML 에서 쓰이므로 루트 기준)
const projectsRel = path.join('data', 'projects.json');
if (fs.existsSync(path.join(DIST, projectsRel))) {
  const projects = JSON.parse(fs.readFileSync(path.join(DIST, projectsRel), 'utf8'));
  const refs = [];
  for (const project of projects.all || []) {
    if (project.image) refs.push(project.image);
    if (project.detailPage) refs.push(project.detailPage);
  }
  checkRefs(projectsRel, refs, DIST);
  console.log(`  data/projects.json: 프로젝트 ${(projects.all || []).length}개`);
}

// js/project-details/*.js 의 에셋 리터럴 (루트 HTML 에서 로드되므로 루트 기준)
const detailDir = path.join(DIST, 'js', 'project-details');
if (fs.existsSync(detailDir)) {
  const detailFiles = fs.readdirSync(detailDir).filter((n) => n.endsWith('.js'));
  for (const name of detailFiles) {
    const rel = path.join('js', 'project-details', name);
    const source = fs.readFileSync(path.join(DIST, rel), 'utf8');
    const refs = [...source.matchAll(/['"]((?:assets|images)\/[^'"]+)['"]/g)].map((m) => m[1]);
    checkRefs(rel, refs, DIST);
  }
  console.log(`  상세 설정 ${detailFiles.length}개`);
}

console.log('');
if (errors > 0) {
  console.error(`check:links 실패 — 오류 ${errors}건 (검사 ${checked}건)`);
  process.exit(1);
}
console.log(`check:links 통과 — 검사 ${checked}건`);
