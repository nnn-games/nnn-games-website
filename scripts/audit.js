#!/usr/bin/env node
/**
 * 정기 점검 (audit-site)
 *
 * 사람이 놓치기 쉬운 운영 상태를 한 번에 점검해 Markdown/JSON 보고서를 만든다. 코드를 고치지는 않는다.
 *   1. 검증 스크립트 결과      check:i18n / check:links / check:data (dist 필요, 없으면 빌드)
 *   2. 지표 신선도            projects.json / communities.json 의 updatedAt 이 --max-age-days 보다 오래됐는지
 *   3. 외부 링크 생존         projects.json links, community-groups url, 사이트·덱 HTML 의 http(s) 링크 (GET, 10초)
 *   4. 번역 누락 의심         ko 문구가 en/ja 에 그대로 들어간 키 (사이트 i18n + 덱 DECK_I18N)
 *   5. 덱 수치 인용           덱 문구 속 1,000 이상 숫자를 현재 데이터(방문·즐겨찾기·구독자·히어로 합계)와 대조
 *   6. 에셋 위생              2MB 초과 파일, 어디서도 참조되지 않는 파일
 *
 * Usage: node scripts/audit.js [--max-age-days 3] [--out exports/audit] [--skip-links] [--strict]
 *   --strict : error 급 발견이 있으면 exit 1 (기본은 보고만 하고 0)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};
const MAX_AGE_DAYS = Number(opt('--max-age-days', 3));
const OUT = path.resolve(ROOT, opt('--out', 'exports/audit'));
const SKIP_LINKS = flag('--skip-links');
const STRICT = flag('--strict');
const TODAY = new Date().toISOString().slice(0, 10);

const findings = []; // { section, level: 'error'|'warn'|'info', message }
const add = (section, level, message) => findings.push({ section, level, message });

const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const hasHangul = (s) => /[ㄱ-힝]/.test(s);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function evalBrowserScript(rel, pick) {
  const noop = () => {};
  const sandbox = {
    window: {},
    document: { addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], documentElement: { lang: 'ko' }, body: null },
    localStorage: { getItem: () => null, setItem: noop },
    navigator: {},
    console
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(`${read(rel)}\n;globalThis.__picked = (${pick});`, sandbox, { filename: rel });
  return sandbox.__picked;
}

// ---------- 1. 검증 스크립트 ----------
function runChecks() {
  if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) {
    const build = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'build.js')], { cwd: ROOT, encoding: 'utf8' });
    if (build.status !== 0) add('검증', 'error', `빌드 실패: ${(build.stderr || '').trim().split('\n').pop()}`);
  }
  for (const name of ['check-i18n', 'check-links', 'check-data']) {
    const result = spawnSync(process.execPath, [path.join(ROOT, 'scripts', `${name}.js`)], { cwd: ROOT, encoding: 'utf8' });
    const output = `${result.stdout || ''}${result.stderr || ''}`;
    const problems = output.split('\n').filter((line) => /\[(ERROR|WARN)\]/.test(line)).map((line) => line.trim());
    if (result.status !== 0) add('검증', 'error', `${name} 실패 (${problems.length}건): ${problems.slice(0, 5).join(' / ')}`);
    else if (problems.length) add('검증', 'warn', `${name} 통과, 경고 ${problems.length}건: ${problems.slice(0, 5).join(' / ')}`);
    else add('검증', 'info', `${name} 통과`);
  }
}

// ---------- 2. 지표 신선도 ----------
function ageDays(iso) {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : (Date.now() - t) / 86400000;
}

function checkFreshness(projects, communities) {
  for (const project of projects.all || []) {
    const collects = project.reporting && typeof project.reporting.collectMetrics === 'boolean' ? project.reporting.collectMetrics : project.status === 'active';
    if (!collects) continue;
    const updatedAt = project.metrics && project.metrics.updatedAt;
    const age = updatedAt ? ageDays(updatedAt) : null;
    if (age === null) add('지표 신선도', 'error', `${project.id}: 지표가 없습니다 (npm run update:metrics)`);
    else if (age > MAX_AGE_DAYS) add('지표 신선도', 'error', `${project.id}: 지표가 ${age.toFixed(1)}일 전 값입니다 (기준 ${MAX_AGE_DAYS}일). metrics.yml 실행 여부를 확인하세요`);
  }
  const hero = projects.summary && projects.summary.hero;
  if (hero && hero.updatedAt) {
    const age = ageDays(hero.updatedAt);
    add('지표 신선도', age > MAX_AGE_DAYS ? 'error' : 'info', `summary.hero: ${hero.projectCount}개 프로젝트, 방문 ${Number(hero.totalVisits).toLocaleString()}, 갱신 ${hero.updatedAt.slice(0, 10)} (${age.toFixed(1)}일 전)`);
  }
  const cAge = communities.updatedAt ? ageDays(communities.updatedAt) : null;
  if (cAge === null) add('지표 신선도', 'error', 'communities.json 에 updatedAt 이 없습니다');
  else add('지표 신선도', cAge > MAX_AGE_DAYS ? 'error' : 'info', `커뮤니티: 구독자 합계 ${Number(communities.totals && communities.totals.heroSubscriberCount).toLocaleString()}, 갱신 ${communities.updatedAt.slice(0, 10)} (${cAge.toFixed(1)}일 전)`);
  // 지표 급감 감지는 이력이 없어 불가. 대신 0 값 경고
  for (const project of projects.all || []) {
    if (project.status === 'active' && project.metrics && project.metrics.visits === 0) add('지표 신선도', 'warn', `${project.id}: visits 가 0 입니다. universeId 또는 게임 공개 상태를 확인하세요`);
  }
}

// ---------- 3. 외부 링크 ----------
function collectExternalLinks(projects, groups) {
  const links = new Map(); // url -> Set(source)
  const put = (url, source) => {
    const clean = url.replace(/[)\]'"<>,.]+$/, '');
    if (!/^https?:\/\//.test(clean)) return;
    if (/fonts\.(googleapis|gstatic)\.com|w3\.org|schema\.org|rbxcdn\.com/.test(clean)) return;
    if (!links.has(clean)) links.set(clean, new Set());
    links.get(clean).add(source);
  };
  for (const project of projects.all || []) for (const [type, url] of Object.entries(project.links || {})) if (url) put(url, `projects.json ${project.id}.links.${type}`);
  for (const group of groups.groups || []) if (group.url) put(group.url, `community-groups.json ${group.id}`);
  const htmlFiles = [
    ...fs.readdirSync(path.join(ROOT, 'site')).filter((n) => n.endsWith('.html')).map((n) => `site/${n}`),
    ...walk(path.join(ROOT, 'decks')).filter((f) => /\.(html|js)$/.test(f) && !/deck\.js$/.test(f)).map((f) => path.relative(ROOT, f))
  ];
  for (const file of htmlFiles) {
    const text = read(file);
    for (const match of text.matchAll(/https?:\/\/[^\s"'<>)]+/g)) put(match[0], file);
  }
  return links;
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'Mozilla/5.0 (nnn-games audit)' } });
    return { status: res.status, ok: res.ok, finalUrl: res.url };
  } catch (error) {
    return { status: 0, ok: false, error: error.name === 'AbortError' ? 'timeout' : error.message };
  } finally {
    clearTimeout(timer);
  }
}

async function checkLinks(links) {
  const entries = [...links.entries()];
  const results = [];
  let cursor = 0;
  const worker = async () => {
    while (cursor < entries.length) {
      const [url, sources] = entries[cursor++];
      const result = await probe(url);
      results.push({ url, sources: [...sources], ...result });
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));
  results.sort((a, b) => a.url.localeCompare(b.url));
  for (const r of results) {
    const where = r.sources.slice(0, 2).join(', ') + (r.sources.length > 2 ? ` 외 ${r.sources.length - 2}` : '');
    if (r.ok) add('외부 링크', 'info', `${r.status} ${r.url}`);
    else if (r.status === 403 || r.status === 405 || r.status === 429) add('외부 링크', 'warn', `${r.status} ${r.url} (봇 차단 가능성, 수동 확인) ← ${where}`);
    else add('외부 링크', 'error', `${r.status || r.error} ${r.url} ← ${where}`);
  }
  return results;
}

// ---------- 4. 번역 누락 의심 ----------
function checkUntranslated(label, dict) {
  if (!dict || !dict.ko) return;
  let count = 0;
  for (const [key, ko] of Object.entries(dict.ko)) {
    if (typeof ko !== 'string' || !hasHangul(ko) || ko.length < 4) continue;
    for (const lang of ['en', 'ja']) {
      if (dict[lang] && dict[lang][key] === ko) {
        count += 1;
        if (count <= 20) add('번역 누락 의심', 'warn', `${label} ${lang}.${key}: ko 문구 그대로 ("${ko.slice(0, 30)}${ko.length > 30 ? '…' : ''}")`);
      }
    }
  }
  if (count > 20) add('번역 누락 의심', 'warn', `${label}: 외 ${count - 20}건 더 있음`);
  if (count === 0) add('번역 누락 의심', 'info', `${label}: 의심 항목 없음`);
}

// ---------- 5. 덱 수치 인용 ----------
function parseNumber(text) {
  const m = /^(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(만|억|K|M|k|m)?$/.exec(text.trim());
  if (!m) return null;
  let n = Number(m[1].replace(/,/g, ''));
  const unit = m[2];
  if (unit === '만') n *= 1e4;
  else if (unit === '억') n *= 1e8;
  else if (unit === 'K' || unit === 'k') n *= 1e3;
  else if (unit === 'M' || unit === 'm') n *= 1e6;
  return n;
}

function referenceValues(projects, communities) {
  const refs = [];
  for (const p of projects.all || []) {
    const m = p.metrics || {};
    for (const key of ['visits', 'favorites', 'playing']) if (typeof m[key] === 'number' && m[key] >= 1000) refs.push({ value: m[key], label: `${p.id}.${key}` });
  }
  const hero = projects.summary && projects.summary.hero;
  if (hero && hero.totalVisits) refs.push({ value: hero.totalVisits, label: 'hero.totalVisits' });
  for (const g of communities.groups || []) if (typeof g.memberCount === 'number' && g.memberCount >= 1000) refs.push({ value: g.memberCount, label: `community ${g.name || g.id}.memberCount` });
  if (communities.totals && communities.totals.heroSubscriberCount) refs.push({ value: communities.totals.heroSubscriberCount, label: 'communities.heroSubscriberCount' });
  if (typeof communities.totalMembers === 'number') refs.push({ value: communities.totalMembers, label: 'communities.totalMembers' });
  return refs;
}

function checkDeckNumbers(decks, refs) {
  const numberPattern = /(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s?(만|억|K|M)\+?|\d{1,3}(?:,\d{3})+/g;
  for (const deck of decks) {
    if (deck.status === 'archived') continue;
    let dict;
    try {
      dict = evalBrowserScript(`decks/${deck.slug}/slides.js`, 'window.DECK_I18N');
    } catch (error) {
      add('덱 수치 인용', 'error', `${deck.slug}: slides.js 평가 실패 ${error.message}`);
      continue;
    }
    const seen = new Map(); // "value" -> keys
    for (const [key, text] of Object.entries((dict && dict.ko) || {})) {
      if (typeof text !== 'string') continue;
      for (const match of text.matchAll(numberPattern)) {
        const value = parseNumber(match[0].replace('+', ''));
        if (value === null || value < 1000 || (value >= 1900 && value <= 2100 && Number.isInteger(value))) continue;
        const k = `${match[0]}`;
        if (!seen.has(k)) seen.set(k, { value, keys: [] });
        seen.get(k).keys.push(key);
      }
    }
    if (seen.size === 0) {
      add('덱 수치 인용', 'info', `${deck.slug}: 인용 수치 없음`);
      continue;
    }
    for (const [text, { value, keys }] of seen) {
      const nearest = refs.map((r) => ({ ...r, diff: Math.abs(r.value - value) / r.value })).sort((a, b) => a.diff - b.diff)[0];
      const where = `${deck.slug} [${keys.slice(0, 2).join(', ')}${keys.length > 2 ? ` 외 ${keys.length - 2}` : ''}]`;
      if (nearest && nearest.diff <= 0.15) add('덱 수치 인용', 'info', `${where} "${text}" ≈ ${nearest.label} ${nearest.value.toLocaleString()} (차이 ${(nearest.diff * 100).toFixed(0)}%)`);
      else if (nearest && nearest.diff <= 0.5) add('덱 수치 인용', 'warn', `${where} "${text}" 가 ${nearest.label} ${nearest.value.toLocaleString()} 와 ${(nearest.diff * 100).toFixed(0)}% 차이 — 갱신 검토 (/update-deck)`);
      else add('덱 수치 인용', 'info', `${where} "${text}" — 대응하는 데이터 없음 (외부 통계이면 무시)`);
    }
  }
}

// ---------- 6. 에셋 위생 ----------
function checkAssets() {
  const assetDirs = ['shared/assets', 'shared/images', ...fs.readdirSync(path.join(ROOT, 'decks')).flatMap((d) => [`decks/${d}/assets`, `decks/${d}/img`])];
  const assets = assetDirs.flatMap((d) => walk(path.join(ROOT, d)));
  const sourceFiles = [
    ...walk(path.join(ROOT, 'site')).filter((f) => /\.(html|js|css)$/.test(f)),
    ...walk(path.join(ROOT, 'decks')).filter((f) => /\.(html|js|css)$/.test(f)),
    ...walk(path.join(ROOT, 'shared', 'data')).filter((f) => f.endsWith('.json')),
    ...walk(path.join(ROOT, 'shared', 'assets')).filter((f) => /\.(json|txt)$/.test(f))
  ];
  const corpus = sourceFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  let big = 0;
  let unreferenced = 0;
  let total = 0;
  for (const file of assets) {
    if (/\.(pdf)$/i.test(file) || path.basename(file).startsWith('.')) continue;
    total += 1;
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    const size = fs.statSync(file).size;
    if (size > 2 * 1048576) {
      big += 1;
      add('에셋 위생', 'warn', `${rel}: ${(size / 1048576).toFixed(1)}MB (2MB 초과, 압축 권장)`);
    }
    // 파일명이 그대로 또는 URL 인코딩된 형태('LOOT-BUILD%20CHOICE.png')로 참조될 수 있다.
    const base = path.basename(file);
    if (!corpus.includes(base) && !corpus.includes(encodeURIComponent(base)) && !corpus.includes(encodeURI(base))) {
      unreferenced += 1;
      if (unreferenced <= 30) add('에셋 위생', 'info', `${rel}: 참조 없음 (정리 후보)`);
    }
  }
  if (unreferenced > 30) add('에셋 위생', 'info', `참조 없는 파일 외 ${unreferenced - 30}건 더 있음`);
  add('에셋 위생', 'info', `이미지·미디어 ${total}개 중 2MB 초과 ${big}개, 참조 없음 ${unreferenced}개`);
}

// ---------- 보고서 ----------
function render(linkResults) {
  const bySection = new Map();
  for (const f of findings) {
    if (!bySection.has(f.section)) bySection.set(f.section, []);
    bySection.get(f.section).push(f);
  }
  const errors = findings.filter((f) => f.level === 'error').length;
  const warns = findings.filter((f) => f.level === 'warn').length;
  const lines = [];
  lines.push(`# 정기 점검 보고 ${TODAY}`);
  lines.push('');
  lines.push(`오류 ${errors}건, 경고 ${warns}건. 오류는 바로 조치, 경고는 검토 대상이다. 조치 방법은 \`.claude/skills/audit-site/SKILL.md\` 참고.`);
  lines.push('');
  lines.push('| 구분 | 오류 | 경고 | 정보 |');
  lines.push('| --- | --- | --- | --- |');
  for (const [section, items] of bySection) {
    lines.push(`| ${section} | ${items.filter((i) => i.level === 'error').length} | ${items.filter((i) => i.level === 'warn').length} | ${items.filter((i) => i.level === 'info').length} |`);
  }
  for (const [section, items] of bySection) {
    lines.push('');
    lines.push(`## ${section}`);
    const ordered = [...items.filter((i) => i.level === 'error'), ...items.filter((i) => i.level === 'warn'), ...items.filter((i) => i.level === 'info')];
    const infoCount = items.filter((i) => i.level === 'info').length;
    const showInfoInline = section !== '외부 링크' || infoCount <= 5;
    for (const item of ordered) {
      if (item.level === 'info' && !showInfoInline) continue;
      const mark = item.level === 'error' ? '🔴' : item.level === 'warn' ? '🟡' : '⚪';
      lines.push(`- ${mark} ${item.message}`);
    }
    if (!showInfoInline) {
      lines.push('');
      lines.push('<details><summary>정상 응답 링크</summary>');
      lines.push('');
      for (const item of items.filter((i) => i.level === 'info')) lines.push(`- ${item.message}`);
      lines.push('');
      lines.push('</details>');
    }
  }
  lines.push('');
  lines.push(`<sub>생성: ${new Date().toISOString()} · 기준 지표 나이 ${MAX_AGE_DAYS}일 · 외부 링크 ${linkResults ? linkResults.length : 0}개 확인</sub>`);
  return { markdown: lines.join('\n') + '\n', errors, warns };
}

async function main() {
  const projects = readJson('shared/data/projects.json');
  const communities = readJson('shared/data/communities.json');
  const groups = readJson('shared/data/community-groups.json');
  const decks = (readJson('decks/decks.json').decks || []).filter((d) => d && d.slug);

  console.log('[1/6] 검증 스크립트');
  runChecks();
  console.log('[2/6] 지표 신선도');
  checkFreshness(projects, communities);
  let linkResults = null;
  if (SKIP_LINKS) add('외부 링크', 'info', '--skip-links 로 건너뜀');
  else {
    const links = collectExternalLinks(projects, groups);
    console.log(`[3/6] 외부 링크 ${links.size}개 확인 중`);
    linkResults = await checkLinks(links);
  }
  console.log('[4/6] 번역 누락 의심');
  try {
    checkUntranslated('site i18n', evalBrowserScript('site/js/i18n.js', 'typeof translations !== "undefined" ? translations : window.translations'));
  } catch (error) {
    add('번역 누락 의심', 'error', `site/js/i18n.js 평가 실패: ${error.message}`);
  }
  for (const deck of decks) {
    if (deck.status === 'archived') continue;
    try {
      checkUntranslated(`deck ${deck.slug}`, evalBrowserScript(`decks/${deck.slug}/slides.js`, 'window.DECK_I18N'));
    } catch (error) {
      add('번역 누락 의심', 'error', `decks/${deck.slug}/slides.js 평가 실패: ${error.message}`);
    }
  }
  console.log('[5/6] 덱 수치 인용');
  checkDeckNumbers(decks, referenceValues(projects, communities));
  console.log('[6/6] 에셋 위생');
  checkAssets();

  const { markdown, errors, warns } = render(linkResults);
  fs.mkdirSync(OUT, { recursive: true });
  const mdPath = path.join(OUT, `audit-${TODAY}.md`);
  fs.writeFileSync(mdPath, markdown);
  fs.writeFileSync(path.join(OUT, `audit-${TODAY}.json`), JSON.stringify({ date: TODAY, maxAgeDays: MAX_AGE_DAYS, findings, links: linkResults }, null, 2) + '\n');
  fs.writeFileSync(path.join(OUT, 'latest.md'), markdown);
  console.log('');
  console.log(`audit 완료 — 오류 ${errors}건, 경고 ${warns}건 → ${path.relative(ROOT, mdPath)}`);
  for (const f of findings.filter((i) => i.level === 'error')) console.log(`  [ERROR] ${f.section}: ${f.message}`);
  if (STRICT && errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
