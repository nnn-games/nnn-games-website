#!/usr/bin/env node
// 임시 빌드 + 실제 브라우저 동작 + 화면 증거. 운영 dist/와 개발 서버를 공유하지 않는다.
/* global window, document, location, getComputedStyle */
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const server = require('../lib/preview-server');

function options(argv) {
  const result = { pages: [], langs: ['ko', 'en', 'ja'], widths: [1280, 390, 320], offline: false };
  const keys = { '--pages': 'pages', '--lang': 'langs', '--widths': 'widths' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--offline') {
      result.offline = true;
      continue;
    }
    if (argv[i] === '--help') {
      result.help = true;
      continue;
    }
    const key = keys[argv[i]];
    if (!key || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`잘못된 옵션: ${argv[i]}`);
    result[key] = argv[++i].split(',').filter(Boolean);
  }
  result.widths = result.widths.map(Number);
  if (!result.widths.length || result.widths.some((n) => !Number.isInteger(n) || n < 320 || n > 2560))
    throw new Error('폭은 320~2560 사이 정수여야 합니다.');
  if (!result.langs.length || result.langs.some((lang) => !['ko', 'en', 'ja'].includes(lang)))
    throw new Error('언어는 ko,en,ja 중에서 지정하세요.');
  if (result.pages.some((route) => !/^\/(?:[a-z0-9-]+(?:\.html)?\/?)?$/i.test(route)))
    throw new Error('페이지는 /, /contact.html, /company/ 같은 로컬 경로여야 합니다.');
  return result;
}

function defaultRoutes(decks) {
  const projects = JSON.parse(fs.readFileSync(path.join(server.ROOT, 'shared/data/projects.json'), 'utf8')).all;
  const examples = ['active', 'development'].map((status) => projects.find((p) => p.status === status)).filter(Boolean);
  return [
    '/',
    '/projects-roblox.html',
    '/contact.html',
    ...examples.map((p) => `/${p.detailPage}`),
    ...decks.map((d) => `/${d.slug}/`)
  ];
}

async function settle(page) {
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.loading = 'eager';
    });
  });
  await page.waitForFunction(
    () => {
      const images = Array.from(document.images);
      images.forEach((img) => {
        img.loading = 'eager';
      });
      return images
        .filter((img) => new URL(img.currentSrc || img.src, location.href).origin === location.origin)
        .every((img) => img.complete);
    },
    null,
    { timeout: 8000 }
  );
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 2500))]));
  await page.waitForTimeout(180);
}

async function checkLayout(page, failures, label) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    broken: Array.from(document.images)
      .filter((img) => img.getAttribute('src') && img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
    empty: !document.body.innerText.trim()
  }));
  if (layout.scroll > layout.width + 2) failures.push(`${label}: 가로 넘침 ${layout.scroll}px / ${layout.width}px`);
  if (layout.empty) failures.push(`${label}: 본문이 비어 있습니다.`);
  for (const src of layout.broken) {
    if (new URL(src, page.url()).origin === new URL(page.url()).origin)
      failures.push(`${label}: 이미지 로딩 실패 ${new URL(src, page.url()).pathname}`);
  }
}

async function languages(page, selector, langs, initial) {
  for (const lang of [...langs.filter((l) => l !== initial), initial]) {
    const button = page.locator(`${selector}[data-lang="${lang}"]`).first();
    assert.equal(await button.count(), 1, `언어 버튼 없음: ${lang}`);
    if (!(await button.isVisible()) && (await page.locator('.menu-toggle:visible').count())) {
      await page.locator('.menu-toggle').click();
    }
    await button.click();
    await page.waitForFunction((value) => document.documentElement.lang === value, lang);
  }
}

async function siteInteractions(page, lang, width) {
  await page.waitForFunction(() => !document.querySelector('.project-detail-loading'));
  if (await page.locator('#featured-projects, #all-projects').count()) await page.waitForSelector('.project-card');
  const mobileMenu = width <= 390 && (await page.locator('.menu-toggle:visible').count());
  if (mobileMenu) {
    const toggle = page.locator('.menu-toggle');
    await toggle.click();
    await page.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true');
    assert.equal(await page.locator('#site-navigation a').first().isVisible(), true, '모바일 메뉴가 열리지 않습니다.');
  }
  await languages(page, '.lang-btn', ['ko', 'en', 'ja'], lang);
  if (mobileMenu && (await page.locator('.menu-toggle').getAttribute('aria-expanded')) === 'true') {
    await page.locator('.menu-toggle').click();
  }
  if (await page.locator('#statusFilter').count()) {
    await page.waitForSelector('.project-card');
    await page.locator('#statusFilter').selectOption('development');
    const statuses = await page
      .locator('.project-card:visible')
      .evaluateAll((cards) => cards.map((card) => card.dataset.status));
    assert.ok(
      statuses.every((status) => status === 'development'),
      '개발 중 필터가 다른 상태를 표시합니다.'
    );
    await page.locator('#resetFilters').click();
  }
}

async function deckInteractions(page, deck, lang, failures, shots, out, prefix) {
  await page.waitForSelector('.slide.is-active');
  const ids = await page
    .locator('.slide[data-slide]')
    .evaluateAll((slides) => slides.map((slide) => slide.dataset.slide));
  const expected = await page.evaluate(() =>
    window.DECK_SLIDES.filter((slide) => slide.enabled !== false).map((slide) => slide.id)
  );
  assert.deepEqual(ids, expected, '슬라이드 데이터와 실제 순서가 다릅니다.');
  assert.ok(ids.length, '슬라이드가 없습니다.');
  await languages(page, '.deck-lang', deck.languages, lang);
  if (ids.length > 1) {
    await page.locator('#deckNext').click();
    await page.waitForFunction((id) => document.querySelector('.slide.is-active')?.dataset.slide === id, ids[1]);
    await page.keyboard.press('ArrowLeft');
    await page.waitForFunction((id) => document.querySelector('.slide.is-active')?.dataset.slide === id, ids[0]);
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction((id) => document.querySelector('.slide.is-active')?.dataset.slide === id, ids[1]);
  }
  for (let i = 0; i < ids.length; i += 1) {
    await page.evaluate((n) => {
      location.hash = `#/${n}`;
    }, i + 1);
    await page.waitForFunction((id) => document.querySelector('.slide.is-active')?.dataset.slide === id, ids[i]);
    assert.equal(await page.locator('.slide.is-active').count(), 1, '활성 슬라이드가 둘 이상입니다.');
    await settle(page);
    await checkLayout(page, failures, ids[i]);
    const clipped = await page.locator('.slide.is-active').evaluate((slide) => {
      const bounds = slide.getBoundingClientRect();
      const style = getComputedStyle(slide);
      const scrollX = ['auto', 'scroll'].includes(style.overflowX);
      const scrollY = ['auto', 'scroll'].includes(style.overflowY);
      const walker = document.createTreeWalker(slide, 4);
      const fragments = [];
      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent.trim() || ['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) continue;
        if (getComputedStyle(node.parentElement).visibility === 'hidden') continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (
            rect.width &&
            rect.height &&
            ((!scrollX && (rect.left < bounds.left - 2 || rect.right > bounds.right + 2)) ||
              (!scrollY && (rect.top < bounds.top - 2 || rect.bottom > bounds.bottom + 2)))
          ) {
            fragments.push(node.textContent.trim().slice(0, 60));
            break;
          }
        }
      }
      return [...new Set(fragments)].slice(0, 5);
    });
    if (clipped.length) failures.push(`${ids[i]}: 슬라이드 밖 문구 ${clipped.join(' / ')}`);
    const file = `${prefix}-${String(i + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: path.join(out, file) });
    shots.push(file);
    const activeSlide = page.locator('.slide.is-active');
    const canScroll = await activeSlide.evaluate(
      (slide) =>
        slide.scrollHeight > slide.clientHeight + 2 && ['auto', 'scroll'].includes(getComputedStyle(slide).overflowY)
    );
    if (canScroll) {
      await activeSlide.evaluate((slide) => {
        slide.scrollTop = slide.scrollHeight;
      });
      await page.waitForTimeout(100);
      const bottom = file.replace('.png', '-bottom.png');
      await page.screenshot({ path: path.join(out, bottom) });
      shots.push(bottom);
      await activeSlide.evaluate((slide) => {
        slide.scrollTop = 0;
      });
    }
  }
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction((id) => document.querySelector('.slide.is-active')?.dataset.slide === id, ids.at(-1));
  const full = page.locator('#deckFull');
  if ((await full.isVisible()) && (await full.isEnabled())) {
    await full.click();
    await page.waitForFunction(() => document.querySelector('#deckFull').getAttribute('aria-pressed') === 'true');
    await full.click();
    await page.waitForFunction(() => document.querySelector('#deckFull').getAttribute('aria-pressed') === 'false');
  }
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('.slide:visible').count(), ids.length, '인쇄에서 일부 슬라이드가 빠집니다.');
  await page.emulateMedia({ media: 'screen' });
  return ids.length;
}

async function main(argv) {
  const opt = options(argv);
  if (opt.help) {
    console.log('npm run agent:smoke -- [--pages /,/company/] [--lang ko,en,ja] [--widths 1280,390,320] [--offline]');
    return;
  }
  const decks = JSON.parse(fs.readFileSync(path.join(server.ROOT, 'decks/decks.json'), 'utf8')).decks.filter(
    (deck) => deck.status !== 'archived'
  );
  const routes = opt.pages.length ? opt.pages : defaultRoutes(decks);
  const stamp = `${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`;
  const out = path.join(server.ROOT, 'exports/agent', stamp);
  const report = { generatedAt: new Date().toISOString(), options: opt, routes, cases: [], ok: false };
  fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync(path.join(server.ROOT, 'tmp'), { recursive: true });
  const directory = fs.mkdtempSync(path.join(server.ROOT, 'tmp/agent-build-'));
  let srv;
  let browser;
  try {
    srv = await server.start({ directory, rebuild: true, includeDraft: true });
    browser = await chromium.launch();
    for (const route of routes) {
      const deck = decks.find((item) => route === `/${item.slug}/`);
      const langs = opt.langs.filter((lang) => !deck || deck.languages.includes(lang));
      if (!langs.length) throw new Error(`${route}: 지정한 언어를 지원하지 않습니다.`);
      for (const lang of langs)
        for (const width of opt.widths) {
          const item = { route, lang, width, failures: [], warnings: [], screenshots: [] };
          report.cases.push(item);
          const context = await browser.newContext({
            viewport: { width, height: width >= 768 ? 800 : 844 },
            reducedMotion: 'reduce',
            locale: lang
          });
          await context.addInitScript((value) => {
            try {
              window.localStorage.setItem('language', value);
            } catch {
              /* 외부 폼 iframe의 opaque origin */
            }
          }, lang);
          const page = await context.newPage();
          page.setDefaultTimeout(8000);
          page.on('pageerror', (error) => item.failures.push(`JavaScript: ${error.message}`));
          page.on('response', (response) => {
            if (response.url().startsWith(srv.baseUrl) && response.status() >= 400)
              item.failures.push(`HTTP ${response.status()}: ${new URL(response.url()).pathname}`);
          });
          page.on('requestfailed', (request) => {
            const message = `요청 실패: ${request.url()} (${request.failure()?.errorText})`;
            (request.url().startsWith(srv.baseUrl) ? item.failures : item.warnings).push(message);
          });
          if (opt.offline)
            await page.route('**/*', (request) => {
              if (request.request().url().startsWith(srv.baseUrl)) return request.continue();
              return request.abort();
            });
          const prefix = `${route === '/' ? 'home' : route.replace(/[^a-z0-9-]/gi, '-')}-${lang}-${width}`;
          try {
            const url = new URL(route, srv.baseUrl);
            if (deck) url.searchParams.set('lang', lang);
            const response = await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
            assert.equal(response.status(), 200, '페이지 HTTP 상태');
            await page.waitForFunction((value) => document.documentElement.lang === value, lang);
            if (deck)
              item.slideCount = await deckInteractions(page, deck, lang, item.failures, item.screenshots, out, prefix);
            else {
              await siteInteractions(page, lang, width);
              await settle(page);
              await checkLayout(page, item.failures, route);
              const file = `${prefix}.png`;
              await page.screenshot({ path: path.join(out, file), fullPage: true });
              item.screenshots.push(file);
            }
          } catch (error) {
            item.failures.push(error.message);
            const file = `${prefix}-failure.png`;
            try {
              await page.screenshot({ path: path.join(out, file) });
              item.screenshots.push(file);
            } catch {
              /* 브라우저가 종료된 경우 */
            }
          } finally {
            await context.close();
          }
          item.failures = [...new Set(item.failures)];
          item.warnings = [...new Set(item.warnings)];
          console.log(
            `${item.failures.length ? 'FAIL' : 'OK'} ${route} ${lang} ${width}px${deck ? ` (${item.slideCount || 0} slides)` : ''}`
          );
          for (const failure of item.failures) console.error(`  ${failure}`);
        }
    }
    report.ok = report.cases.length > 0 && report.cases.every((item) => !item.failures.length);
  } catch (error) {
    report.error = error.message;
    throw error;
  } finally {
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`보고서·스크린샷: ${path.relative(server.ROOT, out)}/`);
    if (browser) await browser.close();
    if (srv) srv.stop();
    fs.rmSync(directory, { recursive: true, force: true });
  }
  if (!report.ok) process.exitCode = 1;
}

if (require.main === module)
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
module.exports = { options, main };
