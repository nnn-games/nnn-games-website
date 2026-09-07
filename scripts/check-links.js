#!/usr/bin/env node
/**
 * 내부 링크·에셋 경로 검사 (네트워크 사용 없음)
 * - HTML: href / src / poster / content(og:image 등) 의 상대 경로가 실제 파일을 가리키는지
 * - CSS: url(...) 참조
 * - data/projects.json: image, detailPage
 * - js/project-details/*.js: 'assets/...' 또는 'images/...' 문자열 리터럴
 *
 * Usage: node scripts/check-links.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
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
  const abs = target.startsWith('/') ? path.join(ROOT, target) : path.resolve(baseDir, target);
  if (!fs.existsSync(abs)) return false;
  // 디렉터리 링크(/company/)는 index.html 이 있어야 한다.
  if (fs.statSync(abs).isDirectory()) return fs.existsSync(path.join(abs, 'index.html'));
  return true;
}

// baseDir 를 주면 그 디렉터리 기준으로, 없으면 relFile 이 있는 디렉터리 기준으로 상대 경로를 푼다.
function checkRefs(relFile, refs, baseDir = path.dirname(path.join(ROOT, relFile))) {
  for (const ref of refs) {
    if (isExternal(ref)) continue;
    checked += 1;
    if (!exists(baseDir, ref)) fail(`${relFile}: '${ref}' 파일이 없습니다.`);
  }
}

function listFiles(dir, predicate, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '_archive') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, predicate, acc);
    else if (predicate(entry.name)) acc.push(path.relative(ROOT, full));
  }
  return acc;
}

// HTML
const htmlFiles = listFiles(ROOT, (name) => name.endsWith('.html'));
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const refs = [];
  for (const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) refs.push(match[1]);
  for (const match of html.matchAll(/<meta[^>]+(?:property|name)="(?:og:image|twitter:image)"[^>]+content="([^"]+)"/g)) refs.push(match[1]);
  checkRefs(file, refs);
}
console.log(`  HTML ${htmlFiles.length}개`);

// CSS
const cssFiles = listFiles(ROOT, (name) => name.endsWith('.css')).filter((f) => !f.startsWith('css' + path.sep) && !f.startsWith('src' + path.sep));
for (const file of cssFiles) {
  const css = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const refs = [...css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]).filter((v) => !v.startsWith('data:'));
  checkRefs(file, refs);
}
console.log(`  CSS ${cssFiles.length}개`);

// data/projects.json
const projectsPath = 'data/projects.json';
if (fs.existsSync(path.join(ROOT, projectsPath))) {
  const projects = JSON.parse(fs.readFileSync(path.join(ROOT, projectsPath), 'utf8'));
  const refs = [];
  for (const project of projects.all || []) {
    if (project.image) refs.push(project.image);
    if (project.detailPage) refs.push(project.detailPage);
  }
  // projects.json 의 경로는 루트 HTML 에서 쓰이므로 루트 기준이다.
  checkRefs(projectsPath, refs, ROOT);
  console.log(`  ${projectsPath}: 프로젝트 ${(projects.all || []).length}개`);
}

// js/project-details/*.js 의 에셋 리터럴
const detailDir = path.join(ROOT, 'js', 'project-details');
if (fs.existsSync(detailDir)) {
  const detailFiles = fs.readdirSync(detailDir).filter((n) => n.endsWith('.js'));
  for (const name of detailFiles) {
    const rel = path.join('js', 'project-details', name);
    const source = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const refs = [...source.matchAll(/['"]((?:assets|images)\/[^'"]+)['"]/g)].map((m) => m[1]);
    // 이 파일들은 루트 HTML 에서 로드되므로 루트 기준 경로로 확인한다.
    for (const ref of refs) {
      if (!exists(ROOT, ref)) fail(`${rel}: '${ref}' 파일이 없습니다.`);
    }
  }
  console.log(`  상세 설정 ${detailFiles.length}개`);
}

console.log('');
if (errors > 0) {
  console.error(`check:links 실패 — 오류 ${errors}건 (검사 ${checked}건)`);
  process.exit(1);
}
console.log(`check:links 통과 — 검사 ${checked}건`);
