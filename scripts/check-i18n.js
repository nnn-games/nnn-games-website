#!/usr/bin/env node
/**
 * i18n 검사
 * 1. js/i18n.js 의 translations: ko/en/ja 키 집합이 서로 일치하는지
 * 2. 루트 HTML 의 data-key* 속성이 translations.ko 에 존재하는지
 * 3. js/**.js 에서 t(lang, 'key') 형태로 쓰는 키가 존재하는지 (경고)
 * 4. 각 덱의 DECK_I18N: ko/en/ja 키 일치 + index.html 의 data-deck-key* 존재 여부
 *
 * Usage: node scripts/check-i18n.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const LANGS = ['ko', 'en', 'ja'];
const DECKS = ['company', 'nnn', 'jumpstart'];

let errors = 0;
let warnings = 0;

function fail(message) {
  errors += 1;
  console.error(`  [ERROR] ${message}`);
}

function warn(message) {
  warnings += 1;
  console.warn(`  [WARN]  ${message}`);
}

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

// 브라우저 전용 스크립트를 최소한의 window 스텁으로 평가해 전역 객체를 꺼낸다.
function evalBrowserScript(relPath, pick) {
  const noop = () => {};
  const window = {};
  const sandbox = {
    window,
    document: {
      addEventListener: noop,
      querySelector: () => null,
      querySelectorAll: () => [],
      documentElement: { lang: 'ko' },
      body: null
    },
    localStorage: { getItem: () => null, setItem: noop },
    navigator: {},
    console
  };
  sandbox.globalThis = sandbox;
  try {
    vm.runInNewContext(`${read(relPath)}\n;globalThis.__picked = (${pick});`, sandbox, { filename: relPath });
  } catch (error) {
    fail(`${relPath} 평가 실패: ${error.message}`);
    return null;
  }
  return sandbox.__picked;
}

// requiredLangs: 반드시 있어야 하는 언어. 그 외 언어 블록이 있으면 함께 비교한다.
function compareLangKeys(label, dict, requiredLangs) {
  if (!dict || typeof dict !== 'object') {
    fail(`${label}: 사전 객체를 찾지 못했습니다.`);
    return { keys: new Set(), langs: [] };
  }
  for (const lang of requiredLangs) {
    if (!dict[lang] || typeof dict[lang] !== 'object') fail(`${label}: '${lang}' 언어 블록이 없습니다.`);
  }
  const langs = Object.keys(dict).filter((lang) => dict[lang] && typeof dict[lang] === 'object');
  const base = new Set(Object.keys(dict.ko || {}));
  for (const lang of langs) {
    if (lang === 'ko') continue;
    const keys = new Set(Object.keys(dict[lang]));
    for (const key of base) if (!keys.has(key)) fail(`${label}: '${lang}' 에 '${key}' 누락`);
    for (const key of keys) if (!base.has(key)) fail(`${label}: '${lang}' 에만 있는 키 '${key}' (ko 에 없음)`);
  }
  for (const lang of langs) {
    for (const [key, value] of Object.entries(dict[lang])) {
      if (typeof value !== 'string' || value.trim() === '') fail(`${label}: '${lang}.${key}' 값이 비어 있습니다.`);
    }
  }
  console.log(`  ${label}: ${langs.map((lang) => `${lang} ${Object.keys(dict[lang]).length}키`).join(', ')}`);
  return { keys: base, langs };
}

function checkHtmlKeys(relPath, attrPrefix, known, label) {
  const html = read(relPath);
  const pattern = new RegExp(`${attrPrefix}(?:-[a-z-]+)?="([^"]+)"`, 'g');
  let count = 0;
  for (const match of html.matchAll(pattern)) {
    count += 1;
    if (!known.has(match[1])) fail(`${relPath}: ${attrPrefix} '${match[1]}' 가 ${label} 에 없습니다.`);
  }
  return count;
}

// 1~2. 사이트 i18n
console.log('[site] js/i18n.js');
const translations = evalBrowserScript('js/i18n.js', 'typeof translations !== "undefined" ? translations : window.translations');
const siteKeys = compareLangKeys('js/i18n.js', translations, LANGS).keys;

const rootHtml = fs
  .readdirSync(ROOT)
  .filter((name) => name.endsWith('.html'))
  .sort();
let htmlKeyCount = 0;
for (const file of rootHtml) htmlKeyCount += checkHtmlKeys(file, 'data-key', siteKeys, 'js/i18n.js');
console.log(`  HTML ${rootHtml.length}개, data-key ${htmlKeyCount}개 확인`);

// 3. JS 에서 NNNUtils.t(lang, 'key') 형태로 참조하는 키 (동적 키는 잡지 못하므로 경고만)
//    파일 안에서 자체 정의한 t() 는 대상이 아니므로 `.t(` 멤버 호출만 본다.
const jsDir = path.join(ROOT, 'js');
const jsFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.js')) jsFiles.push(full);
  }
})(jsDir);
const keyRef = /\.t\(\s*[^,()]+,\s*'([a-z0-9_]+)'/g;
for (const file of jsFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(keyRef)) {
    if (!siteKeys.has(match[1])) warn(`${path.relative(ROOT, file)}: t() 키 '${match[1]}' 가 js/i18n.js 에 없습니다.`);
  }
}

// 4. 덱 i18n
for (const deck of DECKS) {
  const slides = `${deck}/slides.js`;
  const index = `${deck}/index.html`;
  if (!fs.existsSync(path.join(ROOT, slides))) {
    warn(`${slides} 없음, 건너뜀`);
    continue;
  }
  console.log(`[deck] ${slides}`);
  // 덱은 ko 가 기준이며, 나머지 언어는 index.html 의 언어 버튼(data-lang)과 일치해야 한다.
  const deckI18n = evalBrowserScript(slides, 'window.DECK_I18N');
  const { keys: deckKeys, langs: deckLangs } = compareLangKeys(slides, deckI18n, ['ko']);
  const deckSlides = evalBrowserScript(slides, 'window.DECK_SLIDES');
  if (!Array.isArray(deckSlides) || deckSlides.length === 0) fail(`${slides}: DECK_SLIDES 가 비어 있습니다.`);
  if (fs.existsSync(path.join(ROOT, index))) {
    const count = checkHtmlKeys(index, 'data-deck-key', deckKeys, slides);
    const html = read(index);
    const buttonLangs = [...new Set([...html.matchAll(/data-lang="([a-z]+)"/g)].map((m) => m[1]))].sort();
    if (buttonLangs.length && buttonLangs.join(',') !== deckLangs.slice().sort().join(',')) {
      fail(`${index}: 언어 버튼 [${buttonLangs.join(',')}] 과 DECK_I18N 언어 [${deckLangs.join(',')}] 이 다릅니다.`);
    }
    const slideIds = new Set([...html.matchAll(/data-slide="([^"]+)"/g)].map((m) => m[1]));
    for (const slide of deckSlides || []) {
      if (!slideIds.has(slide.id)) fail(`${index}: DECK_SLIDES 의 '${slide.id}' 슬라이드 마크업이 없습니다.`);
    }
    console.log(`  data-deck-key ${count}개, 슬라이드 ${slideIds.size}개 확인`);
  }
}

console.log('');
if (errors > 0) {
  console.error(`check:i18n 실패 — 오류 ${errors}건, 경고 ${warnings}건`);
  process.exit(1);
}
console.log(`check:i18n 통과 — 경고 ${warnings}건`);
