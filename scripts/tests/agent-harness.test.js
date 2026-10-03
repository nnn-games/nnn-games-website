const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { parse, createDeck } = require('../agent/new-deck');
const { options } = require('../agent/smoke');
const { resolveBuildOutput } = require('../lib/build-output');

const ROOT = path.resolve(__dirname, '../..');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nnn-agent-harness-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), value);
  };
  write('decks/decks.json', JSON.stringify({ decks: [] }));
  return { root, write };
}

test('출력 경로를 검사해 소스·루트·외부 디렉터리를 지우지 않는다', (t) => {
  const { root } = fixture(t);
  assert.equal(resolveBuildOutput(root), path.join(root, 'dist'));
  assert.equal(resolveBuildOutput(root, 'tmp/build'), path.join(root, 'tmp/build'));
  for (const output of ['.', 'site', 'decks', 'tmp', '../outside', '/tmp/outside']) {
    assert.throws(() => resolveBuildOutput(root, output));
  }
  fs.mkdirSync(path.join(root, 'tmp'));
  fs.symlinkSync(os.tmpdir(), path.join(root, 'tmp/external'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => resolveBuildOutput(root, 'tmp/external/build'), /저장소 밖/);
});

test('덱 생성은 draft로 등록하고 마크업·데이터·언어를 일치시킨다', (t) => {
  const { root } = fixture(t);
  const opt = parse(['fresh-deck', '--title', '제품 <소개> & 제안', '--langs', 'ko,en,ja', '--audience', 'partner']);
  createDeck(root, opt);
  const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
  const html = read('decks/fresh-deck/index.html');
  assert.match(html, /제품 &lt;소개&gt; &amp; 제안/);
  assert.match(html, /src="\.\.\/slides\/shared\/deck.js"/);
  assert.ok(fs.existsSync(path.join(root, 'docs/decks/fresh-deck/README.md')));
  const entry = JSON.parse(read('decks/decks.json')).decks[0];
  assert.equal(entry.status, 'draft');
  assert.deepEqual(entry.languages, ['ko', 'en', 'ja']);
  const before = read('decks/decks.json');
  assert.throws(() => createDeck(root, opt), /겹칩니다/);
  assert.equal(read('decks/decks.json'), before);
  assert.equal(read('decks/fresh-deck/index.html'), html);
});

test('생성 옵션과 기존 페이지 URL 충돌을 거부한다', (t) => {
  const { root, write } = fixture(t);
  for (const argv of [
    ['../escape'],
    ['fresh', '--langs', 'en'],
    ['fresh', '--audience', 'unknown'],
    ['fresh', '--missing', 'value']
  ]) {
    assert.throws(() => parse(argv));
  }
  write('site/contact.html', '기존 문의 페이지');
  assert.throws(() => createDeck(root, parse(['contact'])), /겹칩니다/);
  assert.throws(() => createDeck(root, parse(['shared'])), /겹칩니다/);
  assert.equal(fs.readFileSync(path.join(root, 'site/contact.html'), 'utf8'), '기존 문의 페이지');
  assert.throws(() => options(['--pages', 'https://example.com']));
  assert.throws(() => options(['--pages', '/../site/']));
  assert.throws(() => options(['--widths', '0']));
});

test('생성한 초안을 실제 렌더하고 JS 예외·없는 이미지·넘침을 탐지한다', { timeout: 90000 }, (t) => {
  const { root, write } = fixture(t);
  for (const file of [
    'scripts/build.js',
    'scripts/lib/deck-policy.js',
    'scripts/lib/build-output.js',
    'scripts/lib/project-content.js',
    'scripts/lib/preview-server.js',
    'scripts/agent/smoke.js',
    'scripts/export-deck.js',
    'decks/shared/deck.js',
    'decks/shared/deck.css',
    'tailwind.config.js',
    'postcss.config.js'
  ]) {
    write(file, fs.readFileSync(path.join(ROOT, file)));
  }
  write('shared/images/nnn-logo.png', fs.readFileSync(path.join(ROOT, 'shared/images/nnn-logo.png')));
  write('shared/data/projects.json', JSON.stringify({ all: [] }));
  write('site/index.html', '<html><head></head><body>Homepage</body></html>');
  write('site/styles/tailwind.css', '@tailwind utilities;');
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(root, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  createDeck(root, parse(['fresh-deck', '--langs', 'ko,en,ja']));
  const run = (script, args) =>
    spawnSync(process.execPath, [path.join(root, script), ...args], { cwd: root, encoding: 'utf8', timeout: 85000 });
  const report = () => {
    const entries = fs.readdirSync(path.join(root, 'exports/agent')).sort();
    return JSON.parse(fs.readFileSync(path.join(root, 'exports/agent', entries.at(-1), 'report.json'), 'utf8'));
  };
  const healthy = run('scripts/agent/smoke.js', [
    '--pages',
    '/fresh-deck/',
    '--lang',
    'ko,en,ja',
    '--widths',
    '1280,390,320',
    '--offline'
  ]);
  assert.equal(healthy.status, 0, `${healthy.stdout}\n${healthy.stderr}`);
  assert.equal(report().cases.length, 9);
  assert.ok(report().cases.every((item) => item.slideCount === 3 && item.screenshots.length === 3));
  assert.equal(fs.existsSync(path.join(root, 'dist')), false, '브라우저 검증은 운영 산출물을 생성하지 않아야 합니다.');
  const exported = run('scripts/export-deck.js', ['fresh-deck', '--lang', 'ko', '--png-only']);
  assert.equal(exported.status, 0, exported.stderr);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'exports/decks/manifest.json'), 'utf8'));
  assert.equal(manifest.decks[0].slideCount, 3);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'decks/decks.json'), 'utf8')).decks[0].status, 'draft');
  assert.equal(fs.existsSync(path.join(root, 'dist')), false);
  fs.appendFileSync(path.join(root, 'decks/fresh-deck/slides.js'), '\nthrow new Error("fixture-runtime-error");\n');
  fs.appendFileSync(
    path.join(root, 'decks/fresh-deck/deck.css'),
    '\n.starter-slide h1 { transform: translateX(1500px); }\n'
  );
  const htmlFile = path.join(root, 'decks/fresh-deck/index.html');
  fs.writeFileSync(
    htmlFile,
    fs.readFileSync(htmlFile, 'utf8').replace('<h1 ', '<img src="missing.png" alt="fixture"><h1 ')
  );
  const broken = run('scripts/agent/smoke.js', [
    '--pages',
    '/fresh-deck/',
    '--lang',
    'ko',
    '--widths',
    '1280',
    '--offline'
  ]);
  assert.equal(broken.status, 1, broken.stderr);
  const failures = report().cases[0].failures.join('\n');
  assert.match(failures, /fixture-runtime-error/);
  assert.match(failures, /HTTP 404.*missing.png/);
  assert.match(failures, /슬라이드 밖 문구/);
  assert.equal(fs.readdirSync(path.join(root, 'tmp')).length, 0, '임시 빌드를 정리해야 합니다.');
});
