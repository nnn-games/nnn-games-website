#!/usr/bin/env node
/**
 * data/*.json 스키마·집계 규칙 검사
 * - projects.json: 필수 필드, 상태 값, id 유일성, 상세 페이지/설정 파일 존재, summary.hero 재계산 일치
 * - community-groups.json: 필수 필드
 * - communities.json: 그룹 id 일치, totals.heroSubscriberCount 재계산 일치
 *
 * 규칙 원천: docs/metric.md, scripts/update-metrics.js
 * Usage: node scripts/check-data.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = 'shared/data';
const SITE = 'site';
const LANGS = ['ko', 'en', 'ja'];
const STATUSES = ['active', 'development', 'completed', 'paused'];
const LINK_TYPES = ['play', 'trailer', 'article', 'group', 'showcase'];

// 상세 셸은 모두 js/project-detail.js 하나를 로드하고, 렌더러가 status/detailRenderer 로 모드를 고른다.
const DETAIL_SCRIPT = 'js/project-detail.js';
const LEGACY_DETAIL_SCRIPT = 'js/project-detail-development.js';
const RENDERERS = { standard: DETAIL_SCRIPT, development: DETAIL_SCRIPT };
const LAUNCH_DATE = /^\d{4}(-(0[1-9]|1[0-2])|-Q[1-4])?$/;

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

// 상세 셸이 로드해야 하는 렌더러: detailRenderer 가 있으면 그 값, 없으면 status 로 유추.
// development 만 개발용 렌더러이고, active/paused/completed 는 운영용 셸을 그대로 쓴다.
function expectedRenderer(project) {
  if (project.detailRenderer) return project.detailRenderer;
  return project.status === 'development' ? 'development' : 'standard';
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
  } catch (error) {
    fail(`${relPath} 읽기 실패: ${error.message}`);
    return null;
  }
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkLocalized(label, value, required = true) {
  if (value == null) {
    if (required) fail(`${label}: 값이 없습니다.`);
    return;
  }
  if (typeof value !== 'object') {
    fail(`${label}: {ko,en,ja} 객체여야 합니다.`);
    return;
  }
  for (const lang of LANGS) if (!hasText(value[lang])) fail(`${label}.${lang}: 비어 있습니다.`);
}

function isActive(project) {
  return project.status === 'active';
}

function flag(project, key) {
  const reporting = project.reporting && typeof project.reporting === 'object' ? project.reporting : {};
  return typeof reporting[key] === 'boolean' ? reporting[key] : true;
}

// projects.json
console.log(`[${DATA}/projects.json]`);
const projects = readJson(`${DATA}/projects.json`);
if (projects) {
  const all = Array.isArray(projects.all) ? projects.all : [];
  if (all.length === 0) fail('all 배열이 비어 있습니다.');
  const ids = new Set();
  const orders = new Map();
  for (const project of all) {
    const label = `project '${project.id || '(id 없음)'}'`;
    if (!hasText(project.id) || !/^[a-z0-9-]+$/.test(project.id)) fail(`${label}: id 는 kebab-case 문자열이어야 합니다.`);
    if (ids.has(project.id)) fail(`${label}: id 중복`);
    ids.add(project.id);

    checkLocalized(`${label}.title`, project.title);
    checkLocalized(`${label}.description`, project.description);
    if (!hasText(project.image)) fail(`${label}: image 누락`);
    if (!hasText(project.detailPage) || !project.detailPage.endsWith('.html')) fail(`${label}: detailPage 누락 또는 .html 아님`);
    if (!hasText(project.category)) fail(`${label}: category 누락`);
    if (!STATUSES.includes(project.status)) fail(`${label}: status '${project.status}' 는 ${STATUSES.join('/')} 중 하나여야 합니다.`);
    if (typeof project.featured !== 'boolean') fail(`${label}: featured 는 boolean 이어야 합니다.`);
    if (typeof project.order !== 'number' || !Number.isInteger(project.order) || project.order <= 0) {
      fail(`${label}: order 는 양의 정수여야 합니다 (홈/목록 표시 순서, 10 단위 권장).`);
    } else if (orders.has(project.order)) {
      fail(`${label}: order ${project.order} 가 '${orders.get(project.order)}' 와 중복됩니다.`);
    } else {
      orders.set(project.order, project.id);
    }
    if (project.detailRenderer != null && !(project.detailRenderer in RENDERERS)) fail(`${label}: detailRenderer 는 standard/development 중 하나여야 합니다.`);
    if (project.launchDate != null && !LAUNCH_DATE.test(String(project.launchDate))) fail(`${label}: launchDate 는 YYYY, YYYY-MM, YYYY-Qn 형식이어야 합니다.`);
    // 상태별 규칙
    if (isActive(project) && (!project.metrics || typeof project.metrics.visits !== 'number')) {
      warn(`${label}: active 인데 metrics.visits 가 없습니다. npm run update:metrics 를 실행하세요.`);
    }
    if ((project.status === 'paused' || project.status === 'completed') && project.featured) {
      fail(`${label}: ${project.status} 상태는 featured 일 수 없습니다 (홈 노출 제외).`);
    }
    if (!isActive(project) && project.reporting && (project.reporting.includeInHeroProjectCount === true || project.reporting.includeInHeroVisitTotal === true)) {
      warn(`${label}: ${project.status} 상태에서 히어로 집계 플래그가 true 입니다. 집계에는 영향 없지만 false 로 정리하세요.`);
    }
    if (!Array.isArray(project.technologies)) fail(`${label}: technologies 는 배열이어야 합니다.`);

    if (project.links && typeof project.links === 'object') {
      for (const [type, url] of Object.entries(project.links)) {
        if (!LINK_TYPES.includes(type)) fail(`${label}.links: 알 수 없는 링크 타입 '${type}'`);
        if (typeof url !== 'string') fail(`${label}.links.${type}: 문자열이어야 합니다.`);
        else if (url && !/^https?:\/\//.test(url)) fail(`${label}.links.${type}: http(s) URL 이어야 합니다.`);
      }
    } else {
      fail(`${label}: links 객체 누락`);
    }

    if (project.reporting != null) {
      for (const key of ['collectMetrics', 'includeInHeroProjectCount', 'includeInHeroVisitTotal']) {
        if (key in project.reporting && typeof project.reporting[key] !== 'boolean') fail(`${label}.reporting.${key}: boolean 이어야 합니다.`);
      }
    }
    const collects = project.reporting && typeof project.reporting.collectMetrics === 'boolean'
      ? project.reporting.collectMetrics
      : isActive(project);
    if (collects && !hasText(project.universeId)) fail(`${label}: 지표 수집 대상인데 universeId 가 없습니다.`);

    if (project.metrics != null) {
      for (const key of ['visits', 'playing', 'favorites', 'likeRatio']) {
        const value = project.metrics[key];
        if (value != null && typeof value !== 'number') fail(`${label}.metrics.${key}: 숫자 또는 null 이어야 합니다.`);
      }
      if (project.metrics.updatedAt != null && Number.isNaN(Date.parse(project.metrics.updatedAt))) fail(`${label}.metrics.updatedAt: ISO 날짜가 아닙니다.`);
    }

    // 상세 페이지 셸과 설정 파일 (소스는 site/ 아래, 경로 값은 배포 기준이므로 site/ 를 붙여 찾는다)
    if (hasText(project.detailPage)) {
      const shell = path.join(ROOT, SITE, project.detailPage);
      if (!fs.existsSync(shell)) {
        fail(`${label}: detailPage '${project.detailPage}' 파일이 ${SITE}/ 에 없습니다.`);
      } else {
        const html = fs.readFileSync(shell, 'utf8');
        const bodyId = (html.match(/<body[^>]*data-project-id="([^"]+)"/) || [])[1];
        if (bodyId && bodyId !== project.id) fail(`${project.detailPage}: body[data-project-id]='${bodyId}' 가 id '${project.id}' 와 다릅니다.`);
        const config = `js/project-details/${project.id}.js`;
        if (html.includes('project-detail') && !html.includes(config)) fail(`${project.detailPage}: '${config}' 스크립트를 로드하지 않습니다.`);
        const renderer = expectedRenderer(project);
        const loaded = (html.match(/src="(js\/project-detail(?:-development)?\.js)"/) || [])[1];
        if (loaded === LEGACY_DETAIL_SCRIPT) fail(`${project.detailPage}: 옛 렌더러 '${LEGACY_DETAIL_SCRIPT}' 를 로드합니다. '${DETAIL_SCRIPT}' 로 바꾸세요 (모드는 status/detailRenderer 로 결정).`);
        else if (loaded && renderer in RENDERERS && loaded !== RENDERERS[renderer]) fail(`${project.detailPage}: '${RENDERERS[renderer]}' 를 로드해야 하는데 '${loaded}' 를 로드합니다.`);
        if (fs.existsSync(path.join(ROOT, SITE, config))) {
          const source = fs.readFileSync(path.join(ROOT, SITE, config), 'utf8');
          if (!source.includes(`ProjectDetailConfigs['${project.id}']`) && !source.includes(`ProjectDetailConfigs["${project.id}"]`)) {
            fail(`${config}: ProjectDetailConfigs['${project.id}'] 를 정의하지 않습니다.`);
          }
        }
      }
    }
  }

  // summary.hero 재계산
  const heroProjects = all.filter((p) => isActive(p) && flag(p, 'includeInHeroProjectCount'));
  const visitProjects = all.filter((p) => isActive(p) && flag(p, 'includeInHeroVisitTotal'));
  const totalVisits = visitProjects.reduce((sum, p) => sum + (p.metrics && typeof p.metrics.visits === 'number' ? p.metrics.visits : 0), 0);
  const hero = projects.summary && projects.summary.hero;
  if (!hero) {
    fail('summary.hero 가 없습니다. npm run update:metrics 를 실행하세요.');
  } else {
    if (hero.projectCount !== heroProjects.length) fail(`summary.hero.projectCount=${hero.projectCount} 이지만 규칙상 ${heroProjects.length} 입니다.`);
    if (hero.totalVisits !== totalVisits) fail(`summary.hero.totalVisits=${hero.totalVisits} 이지만 규칙상 ${totalVisits} 입니다.`);
    const expectIds = heroProjects.map((p) => p.id).join(',');
    if ((hero.projectIds || []).join(',') !== expectIds) fail(`summary.hero.projectIds 가 규칙과 다릅니다. 기대: [${expectIds}]`);
  }
  console.log(`  프로젝트 ${all.length}개, 히어로 ${heroProjects.length}개, 방문 합계 ${totalVisits.toLocaleString()}`);
}

// community-groups.json
console.log(`[${DATA}/community-groups.json]`);
const groupConfig = readJson(`${DATA}/community-groups.json`);
const configIds = new Set();
if (groupConfig) {
  const groups = Array.isArray(groupConfig.groups) ? groupConfig.groups : [];
  for (const group of groups) {
    const label = `group '${group.id || '(id 없음)'}'`;
    if (!hasText(group.id)) fail(`${label}: id 누락`);
    if (configIds.has(group.id)) fail(`${label}: id 중복`);
    configIds.add(group.id);
    if (!hasText(group.url) || !/^https?:\/\//.test(group.url)) fail(`${label}: url 은 http(s) URL 이어야 합니다.`);
    checkLocalized(`${label}.names`, group.names);
    if (!STATUSES.includes(group.status)) fail(`${label}: status '${group.status}' 는 ${STATUSES.join('/')} 중 하나여야 합니다.`);
    for (const key of ['showOnHomepage', 'includeInHeroSubscriberTotal']) {
      if (typeof group[key] !== 'boolean') fail(`${label}.${key}: boolean 이어야 합니다.`);
    }
  }
  console.log(`  그룹 ${groups.length}개`);
}

// communities.json
console.log(`[${DATA}/communities.json]`);
const communities = readJson(`${DATA}/communities.json`);
if (communities && groupConfig) {
  const groups = Array.isArray(communities.groups) ? communities.groups : [];
  const configGroups = Array.isArray(groupConfig.groups) ? groupConfig.groups : [];
  const byId = new Map(groups.map((g) => [g.id, g]));
  let heroTotal = 0;
  const homepageIds = [];
  for (const config of configGroups) {
    const generated = byId.get(config.id);
    const active = config.status === 'active';
    if (active && !generated) {
      fail(`communities.json: 활성 그룹 '${config.id}' 가 없습니다. npm run update:metrics 를 실행하세요.`);
      continue;
    }
    if (!generated) continue;
    if (typeof generated.memberCount !== 'number') fail(`communities.json '${config.id}': memberCount 가 숫자가 아닙니다.`);
    if (active && config.includeInHeroSubscriberTotal && typeof generated.memberCount === 'number') heroTotal += generated.memberCount;
    if (active && config.showOnHomepage) homepageIds.push(config.id);
  }
  for (const generated of groups) {
    if (!configIds.has(generated.id)) fail(`communities.json: '${generated.id}' 가 community-groups.json 에 없습니다.`);
  }
  const totals = communities.totals || {};
  if (totals.heroSubscriberCount !== heroTotal) fail(`totals.heroSubscriberCount=${totals.heroSubscriberCount} 이지만 규칙상 ${heroTotal} 입니다.`);
  const generatedHomepage = (totals.homepageGroupIds || []).slice().sort().join(',');
  if (generatedHomepage !== homepageIds.slice().sort().join(',')) fail(`totals.homepageGroupIds 가 규칙과 다릅니다. 기대: [${homepageIds.join(',')}]`);
  if (communities.updatedAt != null && Number.isNaN(Date.parse(communities.updatedAt))) fail('communities.updatedAt: ISO 날짜가 아닙니다.');
  console.log(`  그룹 ${groups.length}개, 히어로 구독자 합계 ${heroTotal.toLocaleString()}`);
}

// decks/decks.json (덱 레지스트리)
console.log('[decks/decks.json]');
const DECK_STATUSES = ['active', 'draft', 'archived'];
const DECK_AUDIENCES = ['partner', 'publisher', 'investor', 'internal', 'public'];
const DECK_RUNTIMES = { shared: '../slides/shared/deck.js', local: 'deck.js' };
const registry = readJson('decks/decks.json');
if (registry) {
  const decks = Array.isArray(registry.decks) ? registry.decks : [];
  const slugs = new Set();
  const projectIds = new Set(((projects && projects.all) || []).map((p) => p.id));
  for (const deck of decks) {
    const label = `deck '${deck.slug || '(slug 없음)'}'`;
    if (!hasText(deck.slug) || !/^[a-z0-9-]+$/.test(deck.slug)) fail(`${label}: slug 는 kebab-case 여야 합니다.`);
    if (slugs.has(deck.slug)) fail(`${label}: slug 중복`);
    slugs.add(deck.slug);
    checkLocalized(`${label}.title`, deck.title);
    if (!DECK_STATUSES.includes(deck.status)) fail(`${label}: status 는 ${DECK_STATUSES.join('/')} 중 하나여야 합니다.`);
    if (!DECK_AUDIENCES.includes(deck.audience)) fail(`${label}: audience 는 ${DECK_AUDIENCES.join('/')} 중 하나여야 합니다.`);
    if (!Array.isArray(deck.languages) || deck.languages.length === 0 || !deck.languages.includes('ko') || deck.languages.some((l) => !LANGS.includes(l))) {
      fail(`${label}: languages 는 ko 를 포함한 ${LANGS.join('/')} 의 배열이어야 합니다.`);
    }
    if (!(deck.runtime in DECK_RUNTIMES)) fail(`${label}: runtime 은 shared/local 중 하나여야 합니다.`);
    if (deck.project != null && !projectIds.has(deck.project)) fail(`${label}: project '${deck.project}' 가 projects.json 에 없습니다.`);

    const dir = path.join(ROOT, 'decks', String(deck.slug));
    const index = path.join(dir, 'index.html');
    if (!fs.existsSync(index) || !fs.existsSync(path.join(dir, 'slides.js'))) {
      fail(`${label}: decks/${deck.slug}/index.html 과 slides.js 가 있어야 합니다.`);
    } else if (deck.runtime in DECK_RUNTIMES) {
      const html = fs.readFileSync(index, 'utf8');
      const expected = DECK_RUNTIMES[deck.runtime];
      if (!html.includes(`src="${expected}`)) fail(`decks/${deck.slug}/index.html: runtime '${deck.runtime}' 이면 '${expected}' 를 로드해야 합니다.`);
      if (deck.runtime === 'shared' && fs.existsSync(path.join(dir, 'deck.js'))) warn(`${label}: runtime 이 shared 인데 deck.js 사본이 남아 있습니다.`);
    }
  }
  // 레지스트리에 없는 덱 디렉터리
  for (const entry of fs.readdirSync(path.join(ROOT, 'decks'), { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'shared') continue;
    if (!slugs.has(entry.name)) fail(`decks/${entry.name}/ 가 decks.json 에 등록되어 있지 않습니다 (배포되지 않음). /new-deck 절차로 등록하세요.`);
  }
  const byStatus = DECK_STATUSES.map((s) => `${s} ${decks.filter((d) => d.status === s).length}`).join(', ');
  console.log(`  덱 ${decks.length}개 (${byStatus})`);
}

console.log('');
if (errors > 0) {
  console.error(`check:data 실패 — 오류 ${errors}건, 경고 ${warnings}건`);
  process.exit(1);
}
console.log(`check:data 통과 — 경고 ${warnings}건`);
