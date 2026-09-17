#!/usr/bin/env node
/**
 * 사이트 스냅샷: 주요 페이지를 데스크톱/모바일 폭으로 스크린샷 (PR 미리보기·작업 검증용)
 *
 * 대상: 홈, 프로젝트 목록, 문의, 운영 중 프로젝트 상세 1개 + 개발 중 상세 1개, 배포 덱의 표지.
 * 언어는 ko 기본, --lang 으로 바꿀 수 있다. 결과는 exports/site/<name>-<lang>-<width>.png
 *
 * Usage:
 *   node scripts/snapshot.js                    기본 세트
 *   node scripts/snapshot.js --lang en          영어로
 *   node scripts/snapshot.js --pages /,/afk-or.html   특정 경로만 (쉼표 구분)
 *   --out <dir>   출력 디렉터리 (기본 exports/site)
 */

/* global window */
// window 는 context.addInitScript 콜백(브라우저에서 실행) 안에서만 쓰인다.

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const server = require('./lib/preview-server');

const ROOT = server.ROOT;
const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};
const lang = opt('--lang', 'ko');
const OUT = path.resolve(ROOT, opt('--out', 'exports/site'));
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 }
];

function defaultPages() {
  const pages = ['/', '/projects-roblox.html', '/contact.html'];
  const projects = JSON.parse(fs.readFileSync(path.join(ROOT, 'shared', 'data', 'projects.json'), 'utf8')).all || [];
  const active = projects.find((p) => p.status === 'active');
  const development = projects.find((p) => p.status === 'development');
  if (active) pages.push(`/${active.detailPage}`);
  if (development) pages.push(`/${development.detailPage}`);
  const decks = JSON.parse(fs.readFileSync(path.join(ROOT, 'decks', 'decks.json'), 'utf8')).decks || [];
  for (const deck of decks) if (deck.status !== 'archived') pages.push(`/${deck.slug}/`);
  return pages;
}

function nameFor(route) {
  if (route === '/') return 'home';
  return route.replace(/^\//, '').replace(/\/$/, '').replace(/\.html$/, '').replace(/[^a-z0-9-]+/gi, '-') || 'home';
}

async function main() {
  const pages = opt('--pages', '').split(',').filter(Boolean);
  const routes = pages.length ? pages : defaultPages();
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await server.start();
  const browser = await chromium.launch();
  const files = [];
  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
      // 사이트는 localStorage.language, 덱은 ?lang= 로 언어를 정한다.
      await context.addInitScript((value) => {
        try {
          window.localStorage.setItem('language', value);
        } catch (_error) {
          /* storage unavailable */
        }
      }, lang);
      const page = await context.newPage();
      for (const route of routes) {
        const isDeck = route.endsWith('/') && route !== '/';
        const url = `${srv.baseUrl}${route}${isDeck ? `?lang=${lang}` : ''}`;
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(400); // 지연 로딩·애니메이션
        const file = path.join(OUT, `${nameFor(route)}-${lang}-${viewport.name}.png`);
        await page.screenshot({ path: file, fullPage: !isDeck });
        files.push(path.relative(ROOT, file));
      }
      await context.close();
    }
  } finally {
    await browser.close();
    srv.stop();
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), lang, routes, files }, null, 2) + '\n');
  console.log(`snapshot 완료 → ${path.relative(ROOT, OUT)}/ (페이지 ${routes.length}개 × 뷰포트 ${VIEWPORTS.length}개 = ${files.length}장)`);
  for (const file of files) console.log(`  ${file}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
