#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parse(argv) {
  const result = { slug: argv[0], langs: ['ko', 'en'], audience: 'internal' };
  const keys = { '--title': 'title', '--langs': 'langs', '--audience': 'audience' };
  if (argv.includes('--help')) return { help: true };
  for (let i = 1; i < argv.length; i += 1) {
    const key = keys[argv[i]];
    if (!key || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`잘못된 옵션: ${argv[i]}`);
    result[key] = argv[++i];
  }
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(result.slug || '')) throw new Error('slug는 영문 kebab-case여야 합니다.');
  if (typeof result.langs === 'string') result.langs = result.langs.split(',');
  result.langs = [...new Set(result.langs)];
  if (!result.langs.includes('ko') || result.langs.some((lang) => !['ko', 'en', 'ja'].includes(lang)))
    throw new Error('언어는 ko를 포함한 ko,en,ja여야 합니다.');
  if (!['partner', 'publisher', 'investor', 'internal', 'public'].includes(result.audience))
    throw new Error('지원하지 않는 audience입니다.');
  result.title = result.title?.trim() || result.slug;
  return result;
}

function dictionary(lang, title) {
  const labels = {
    ko: [
      '이전',
      '다음',
      '언어 선택',
      '전체화면',
      '전체화면 종료',
      '{{n}}번 슬라이드로 이동',
      '부록 {{n}}번 슬라이드로 이동',
      '{{current}} / {{total}} 슬라이드',
      '부록',
      '부록 {{current}} / {{total}}',
      '검토용 초안입니다. 청중과 전달할 핵심 메시지를 작성하세요.',
      '핵심 메시지',
      '이 슬라이드의 주장과 근거를 작성하세요',
      '확인된 자료로 내용을 채우고 수치에는 출처와 기준일을 기록하세요.',
      '다음 단계',
      '청중이 취할 다음 행동을 작성하세요',
      '일정, 담당자, 제안 사항 등 확인된 정보로 내용을 완성하세요.'
    ],
    en: [
      'Previous',
      'Next',
      'Select language',
      'Fullscreen',
      'Exit fullscreen',
      'Go to slide {{n}}',
      'Go to appendix {{n}}',
      'Slide {{current}} of {{total}}',
      'Appendix',
      'Appendix {{current}} of {{total}}',
      'Review draft. Add the audience and the main message.',
      'KEY MESSAGE',
      'Add this slide’s claim and evidence',
      'Use verified material and record the source and date for each statistic.',
      'NEXT STEPS',
      'Add the audience’s next action',
      'Complete this slide with verified dates, owners, and proposals.'
    ],
    ja: [
      '前へ',
      '次へ',
      '言語を選択',
      '全画面表示',
      '全画面表示を終了',
      'スライド{{n}}へ移動',
      '付録{{n}}へ移動',
      '{{total}}枚中{{current}}枚目',
      '付録',
      '付録 {{current}} / {{total}}',
      '確認用の下書きです。対象者と伝える要点を記入してください。',
      '要点',
      'このスライドの主張と根拠を記入してください',
      '確認済みの資料を使い、数値には出典と基準日を記載してください。',
      '次のステップ',
      '対象者に求める次の行動を記入してください',
      '確認済みの日程、担当者、提案内容で完成させてください。'
    ]
  };
  const keys = [
    'ui_prev',
    'ui_next',
    'ui_lang_group',
    'ui_fullscreen',
    'ui_fullscreen_exit',
    'ui_dot',
    'ui_dot_appendix',
    'ui_slide_position',
    'ui_appendix',
    'ui_appendix_position',
    'cover_lead',
    'story_kicker',
    'story_title',
    'story_lead',
    'next_kicker',
    'next_title',
    'next_lead'
  ];
  return {
    ui_page_title: title,
    ui_deck_label: title,
    cover_title: title,
    ...Object.fromEntries(keys.map((key, i) => [key, labels[lang][i]]))
  };
}

function createDeck(root, opt) {
  const registryFile = path.join(root, 'decks/decks.json');
  const registry = JSON.parse(fs.readFileSync(registryFile, 'utf8'));
  const directory = path.join(root, 'decks', opt.slug);
  const docs = path.join(root, 'docs/decks', opt.slug);
  if (
    ['shared', 'slides', 'assets', 'images', 'data', 'privacy', 'css', 'js'].includes(opt.slug) ||
    registry.decks.some((deck) => deck.slug === opt.slug) ||
    fs.existsSync(directory) ||
    fs.existsSync(docs) ||
    fs.existsSync(path.join(root, 'site', opt.slug)) ||
    fs.existsSync(path.join(root, 'site', `${opt.slug}.html`))
  ) {
    throw new Error(`기존 파일 또는 URL과 겹칩니다: ${opt.slug}`);
  }
  const assets = path.join(__dirname, '../../.agents/skills/new-deck/assets');
  const escape = (value) =>
    value.replace(
      /[&<>"']/g,
      (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
    );
  const buttons = opt.langs
    .map((lang) => `<button type="button" class="deck-lang" data-lang="${lang}">${lang.toUpperCase()}</button>`)
    .join('\n                    ');
  const html = fs
    .readFileSync(path.join(assets, 'index.html'), 'utf8')
    .replaceAll('{{TITLE}}', () => escape(opt.title))
    .replace('{{LANG_BUTTONS}}', buttons);
  const css = fs.readFileSync(path.join(assets, 'deck.css'), 'utf8');
  const slides = [
    { id: 'cover', theme: 'paper' },
    { id: 'story', theme: 'paper' },
    { id: 'next-steps', theme: 'dark' }
  ];
  const i18n = Object.fromEntries(opt.langs.map((lang) => [lang, dictionary(lang, opt.title)]));
  fs.mkdirSync(path.join(directory, 'assets'), { recursive: true });
  fs.mkdirSync(docs, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html);
  fs.writeFileSync(path.join(directory, 'deck.css'), css);
  fs.writeFileSync(
    path.join(directory, 'slides.js'),
    `// 덱 데이터와 다국어 문구. 공통 런타임이 읽는다.\nwindow.DECK_SLIDES = ${JSON.stringify(slides, null, 4)};\n\nwindow.DECK_I18N = ${JSON.stringify(i18n, null, 4)};\n`
  );
  fs.writeFileSync(
    path.join(docs, 'README.md'),
    `# ${opt.title}\n\n대상: ${opt.audience}\n상태: 검토용 초안\n\n## 전달할 메시지\n\n청중, 핵심 주장, 기대하는 다음 행동을 작성합니다.\n\n## 원고와 근거\n\ncover → story → next-steps 순서로 시작합니다. 수치는 확인된 출처와 기준일을 기록합니다.\n\n## 검증\n\n\`npm run agent:smoke -- --pages /${opt.slug}/\`\n\`npm run export:deck -- ${opt.slug} --lang ko\`\n`
  );
  registry.decks.push({
    slug: opt.slug,
    title: { ko: opt.title, en: opt.title, ja: opt.title },
    audience: opt.audience,
    status: 'draft',
    languages: opt.langs,
    runtime: 'shared',
    project: null,
    note: '에이전트 생성 골격. 본문·제목 번역·근거를 작성하고 검토한 뒤 공개합니다.'
  });
  fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2) + '\n');
  return directory;
}

if (require.main === module) {
  try {
    const opt = parse(process.argv.slice(2));
    if (opt.help) console.log('npm run deck:new -- <slug> [--title "제목"] [--langs ko,en,ja] [--audience internal]');
    else {
      createDeck(path.resolve(__dirname, '../..'), opt);
      console.log(`draft 덱 생성: decks/${opt.slug}/ — 본문과 제목 번역을 작성하세요.`);
      console.log(`검증: npm run agent:smoke -- --pages /${opt.slug}/`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { parse, createDeck };
