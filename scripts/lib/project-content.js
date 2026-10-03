// 이미지 옆의 프로젝트 JSON을 기존 배포 데이터와 발표 문구로 연결한다.
const fs = require('fs');
const path = require('path');
const FIELDS = ['title', 'description', 'image', 'detailPage', 'category', 'launchDate', 'detailRenderer', 'platform', 'client', 'technologies', 'links'];
const LANGS = ['ko', 'en', 'ja'];

function validateLocalized(value, label) {
  if (!value || typeof value !== 'object') return;
  if (LANGS.some((lang) => Object.hasOwn(value, lang))) {
    for (const lang of LANGS) {
      if (typeof value[lang] !== 'string' || !value[lang].trim()) throw new Error(`${label}.${lang}: 번역이 필요합니다.`);
    }
  }
  for (const [key, child] of Object.entries(value)) validateLocalized(child, `${label}.${key}`);
}

function loadProjectContents(root) {
  const file = path.join(root, 'shared/data/projects.json');
  const registry = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { all: [] };
  const contents = new Map();
  const all = (registry.all || []).map((project) => {
    if (!project.contentFile) return project;
    if (!/^assets\/[a-z0-9-]+\/content\.json$/.test(project.contentFile)) throw new Error(`${project.id}: contentFile 경로가 잘못되었습니다.`);
    const content = JSON.parse(fs.readFileSync(path.join(root, 'shared', project.contentFile), 'utf8'));
    if (content.id !== project.id || !content.project || !content.detail) throw new Error(`${project.contentFile}: id, project, detail을 확인하세요.`);
    for (const key of Object.keys(content.project)) {
      if (!FIELDS.includes(key)) throw new Error(`${project.contentFile}.project.${key}: 운영 설정과 지표는 projects.json에서 관리하세요.`);
      if (Object.hasOwn(project, key)) throw new Error(`${project.id}.${key}: projects.json과 content.json에 중복 정의되어 있습니다.`);
    }
    validateLocalized(content.project, `${project.contentFile}.project`);
    validateLocalized(content.detail, `${project.contentFile}.detail`);
    for (const [slug, locales] of Object.entries(content.presentations || {})) {
      const keys = Object.keys(locales.ko || {}).sort().join(',');
      for (const [lang, dict] of Object.entries(locales)) {
        if (!LANGS.includes(lang) || Object.keys(dict).sort().join(',') !== keys || Object.values(dict).some((value) => typeof value !== 'string' || !value.trim())) {
          throw new Error(`${project.contentFile}.presentations.${slug}.${lang}: 문구 키와 번역을 확인하세요.`);
        }
      }
    }
    contents.set(project.id, content);
    return { ...project, ...content.project };
  });
  return { projects: { ...registry, all }, contents };
}

function deckTranslations(contents, slug) {
  const result = {};
  for (const content of contents.values()) {
    for (const [lang, dict] of Object.entries((content.presentations || {})[slug] || {})) {
      result[lang] = { ...(result[lang] || {}), ...dict };
    }
  }
  return result;
}

function compileDeckScript(source, contents, slug) {
  const locales = deckTranslations(contents, slug);
  if (!Object.keys(locales).length) return source;
  const assignments = Object.entries(locales).map(([lang, dict]) =>
    `Object.assign(window.DECK_I18N[${JSON.stringify(lang)}], ${JSON.stringify(dict)});`
  );
  return `${source}\n// 프로젝트 JSON에서 가져온 발표 문구\n${assignments.join('\n')}\n`;
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function compileProjectHtml(source, contents, slug) {
  let html = source.replace(/<!-- @project-seo ([a-z0-9-]+) -->/g, (_match, id) => {
    const content = contents.get(id);
    if (!content) throw new Error(`${id}: SEO 콘텐츠가 없습니다.`);
    const seo = content.detail.seo;
    const title = escapeHtml(seo.title.ko);
    const description = escapeHtml(seo.description.ko);
    const image = escapeHtml(seo.ogImage);
    return [`<title>${title}</title>`,
      `<meta name="description" content="${description}">`,
      `<meta name="keywords" content="${escapeHtml(seo.keywords.ko)}">`,
      `<meta property="og:title" content="${title}">`,
      `<meta property="og:description" content="${description}">`,
      '<meta property="og:type" content="article">',
      `<meta property="og:image" content="${image}">`,
      '<meta property="og:site_name" content="NNN GAMES">',
      '<meta name="twitter:card" content="summary_large_image">',
      `<meta name="twitter:title" content="${title}">`,
      `<meta name="twitter:description" content="${description}">`,
      `<meta name="twitter:image" content="${image}">`].join('\n    ');
  });
  html = html.replace(/\{\{project:([a-z0-9-]+):image\}\}/g, (_match, id) => {
    const content = contents.get(id);
    if (!content) throw new Error(`${id}: 이미지 콘텐츠가 없습니다.`);
    return escapeHtml(`${slug ? '../' : ''}${content.project.image}`);
  });
  const ko = deckTranslations(contents, slug).ko || {};
  // 초기 HTML과 이미지 alt도 JSON 문구에 맞춘다.
  html = html.replace(/(<[^>]+data-deck-key="([^"]+)"[^>]*>)([^<]*)(<\/[^>]+>)/g,
    (match, open, key, _text, close) => Object.hasOwn(ko, key) ? `${open}${escapeHtml(ko[key])}${close}` : match);
  html = html.replace(/<img\b[^>]*data-deck-key-alt="([^"]+)"[^>]*>/g,
    (match, key) => Object.hasOwn(ko, key) ? match.replace(/\balt="[^"]*"/, `alt="${escapeHtml(ko[key])}"`) : match);
  return html;
}

module.exports = { loadProjectContents, compileDeckScript, compileProjectHtml };
