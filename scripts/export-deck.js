#!/usr/bin/env node
/**
 * 덱 내보내기: 슬라이드별 PNG 스크린샷 + 언어별 PDF
 *
 * decks/decks.json 레지스트리를 읽어 status 가 archived 가 아닌 덱을 dist/ 에서 렌더한다.
 * 덱 런타임의 `?lang=` 파라미터와 `#/<n>` 딥링크, 인쇄 CSS(@page 1280x720)를 그대로 사용한다.
 *
 * Usage:
 *   node scripts/export-deck.js                 레지스트리의 모든 배포 덱, 모든 언어, PNG + PDF
 *   node scripts/export-deck.js jumpstart       특정 덱만 (여러 개 나열 가능)
 *   --lang ko,en     언어 제한        --pdf-only / --png-only    한 종류만
 *   --out <dir>      출력 디렉터리 (기본 exports/decks)
 *
 * 출력: exports/decks/<slug>/<slug>-<lang>.pdf, exports/decks/<slug>/<lang>/<nn>-<slide-id>.png, manifest.json
 * 사전: npm run build (dist 가 없으면 자동 빌드), Playwright Chromium (npx playwright install chromium)
 */

/* global window, document, HashChangeEvent */
// 위 전역은 page.evaluate / waitForFunction 콜백(브라우저에서 실행) 안에서만 쓰인다.

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const server = require('./lib/preview-server');

const ROOT = server.ROOT;
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};
const slugsArg = argv.filter((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--lang' && argv[argv.indexOf(a) - 1] !== '--out');
const langFilter = opt('--lang', '').split(',').filter(Boolean);
const OUT = path.resolve(ROOT, opt('--out', 'exports/decks'));
const doPdf = !flag('--png-only');
const doPng = !flag('--pdf-only');

function loadDecks() {
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'decks', 'decks.json'), 'utf8'));
  let decks = (registry.decks || []).filter((d) => d && d.status !== 'archived');
  if (slugsArg.length) {
    const unknown = slugsArg.filter((s) => !decks.some((d) => d.slug === s));
    if (unknown.length) throw new Error(`레지스트리에 없거나 archived 인 덱: ${unknown.join(', ')}`);
    decks = decks.filter((d) => slugsArg.includes(d.slug));
  }
  return decks;
}

async function exportDeck(page, baseUrl, deck, lang) {
  const deckOut = path.join(OUT, deck.slug);
  const url = `${baseUrl}/${deck.slug}/?lang=${lang}`;
  const result = { slug: deck.slug, lang, slides: [], pdf: null };

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('.slide.is-active', { timeout: 15000 });
  const slideIds = await page.$$eval('.slide[data-slide]', (nodes) => nodes.map((n) => n.getAttribute('data-slide')));

  if (doPng) {
    const pngDir = path.join(deckOut, lang);
    fs.mkdirSync(pngDir, { recursive: true });
    for (let i = 0; i < slideIds.length; i += 1) {
      // 런타임은 #/<n> (1부터) 해시를 읽는다. 해시를 바꾸고 hashchange 를 발생시켜 이동한다.
      await page.evaluate((n) => {
        window.location.hash = `#/${n}`;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }, i + 1);
      await page.waitForFunction((id) => {
        const active = document.querySelector('.slide.is-active');
        return active && active.getAttribute('data-slide') === id;
      }, slideIds[i], { timeout: 5000 });
      await page.waitForTimeout(250); // 전환 애니메이션
      const file = path.join(pngDir, `${String(i + 1).padStart(2, '0')}-${slideIds[i]}.png`);
      await page.locator('.deck-stage').screenshot({ path: file });
      result.slides.push(path.relative(OUT, file));
    }
  }

  if (doPdf) {
    fs.mkdirSync(deckOut, { recursive: true });
    const file = path.join(deckOut, `${deck.slug}-${lang}.pdf`);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(300);
    await page.pdf({ path: file, width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    await page.emulateMedia({ media: 'screen' });
    result.pdf = path.relative(OUT, file);
  }
  return { ...result, slideCount: slideIds.length };
}

async function main() {
  const decks = loadDecks();
  if (decks.length === 0) throw new Error('내보낼 덱이 없습니다.');
  const srv = await server.start();
  const browser = await chromium.launch();
  const manifest = { generatedAt: new Date().toISOString(), decks: [] };
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    for (const deck of decks) {
      const langs = (deck.languages || ['ko']).filter((l) => !langFilter.length || langFilter.includes(l));
      for (const lang of langs) {
        const started = Date.now();
        const result = await exportDeck(page, srv.baseUrl, deck, lang);
        manifest.decks.push(result);
        console.log(`  ${deck.slug} [${lang}] 슬라이드 ${result.slideCount}개${result.pdf ? ', PDF' : ''} (${Date.now() - started}ms)`);
      }
    }
  } finally {
    await browser.close();
    srv.stop();
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`export:deck 완료 → ${path.relative(ROOT, OUT)}/ (덱 ${decks.length}개, 항목 ${manifest.decks.length}개)`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
