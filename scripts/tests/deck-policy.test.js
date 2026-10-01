const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');

test('실제 빌드에서 상태별 배포·초안 개발·검색 제외를 검증한다', async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nnn-deck-policy-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), value);
  };
  const exists = (file) => fs.existsSync(path.join(root, file));
  const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
  for (const file of ['scripts/build.js', 'scripts/lib/deck-policy.js', 'scripts/lib/build-output.js', 'tailwind.config.js', 'postcss.config.js']) {
    write(file, fs.readFileSync(path.join(ROOT, file)));
  }
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(root, 'node_modules'), 'dir');
  write('site/index.html', '<html><head></head><body>Homepage</body></html>');
  write('site/styles/tailwind.css', '@tailwind utilities;');
  write('site/CNAME', 'www.triplengames.com');
  write('site/robots.txt', 'User-agent: *\nAllow: /\n');
  write('docs/decks/company/notes.txt', '배포하지 않는 발표 원고');
  const decks = [
    { slug: 'company', status: 'active' },
    { slug: 'draft', status: 'draft' },
    { slug: 'archived', status: 'archived' }
  ];
  const saveRegistry = () => write('decks/decks.json', JSON.stringify({ decks }));
  saveRegistry();
  for (const deck of decks) {
    write(`decks/${deck.slug}/index.html`, '<html><head><meta content="index, follow" name="robots"></head><body>Deck</body></html>');
    write(`decks/${deck.slug}/asset.txt`, 'deck asset');
  }
  const build = (...args) => spawnSync(process.execPath, [path.join(root, 'scripts/build.js'), ...args], { cwd: root, encoding: 'utf8' });

  await t.test('운영 빌드는 active만 포함하고 발표자료는 검색에서 제외한다', () => {
    const result = build();
    assert.equal(result.status, 0, result.stderr);
    assert.ok(exists('dist/company/index.html'));
    assert.equal(read('dist/CNAME'), 'www.triplengames.com');
    assert.equal(read('dist/robots.txt'), 'User-agent: *\nAllow: /\n');
    assert.equal(exists('dist/docs'), false);
    for (const slug of ['draft', 'archived']) assert.equal(exists(`dist/${slug}`), false);
    assert.match(read('dist/company/index.html'), /content="noindex, nofollow"/);
    assert.equal((read('dist/company/index.html').match(/name="robots"/g) || []).length, 1);
    assert.doesNotMatch(read('dist/sitemap.xml'), /\/(company|draft|archived)\//);
  });

  await t.test('에이전트 초안 빌드는 운영 산출물을 바꾸지 않는다', () => {
    const result = build('--out', 'tmp/agent-preview', '--include-drafts');
    assert.equal(result.status, 0, result.stderr);
    assert.ok(exists('tmp/agent-preview/draft/index.html'));
    assert.equal(exists('tmp/agent-preview/archived'), false);
    assert.equal(exists('dist/draft'), false);
    assert.match(read('tmp/agent-preview/draft/index.html'), /content="noindex, nofollow"/);
    assert.doesNotMatch(read('tmp/agent-preview/sitemap.xml'), /\/(company|draft|archived)\//);
    assert.notEqual(build('--include-drafts').status, 0);
    assert.notEqual(build('--out', 'site').status, 0);
    assert.match(read('site/index.html'), /Homepage/);
  });

  await t.test('개발 모드는 초안을 포함하고 보관 전환 시 이전 파일을 제거한다', async () => {
    const child = spawn(process.execPath, [path.join(root, 'scripts/build.js'), '--watch'], { cwd: root });
    let output = '';
    let errors = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { errors += chunk; });
    const closed = new Promise((resolve) => child.on('close', resolve));
    const waitUntil = async (predicate) => {
      const deadline = Date.now() + 15000;
      while (!predicate()) {
        assert.ok(Date.now() < deadline, `감시 빌드 시간 초과: ${output}\n${errors}`);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    };
    try {
      await waitUntil(() => output.includes('감시 중'));
      assert.ok(exists('dist/draft/index.html'));
      assert.equal(exists('dist/archived'), false);
      assert.match(read('dist/draft/index.html'), /content="noindex, nofollow"/);
      write('tailwind.config.js', read('tailwind.config.js') + "\nmodule.exports.safelist.push('bg-red-500');\n");
      await waitUntil(() => exists('dist/css/style.css') && read('dist/css/style.css').includes('.bg-red-500'));
      decks[0].status = 'archived';
      saveRegistry();
      await waitUntil(() => output.includes('덱 1개(draft)'));
      assert.equal(exists('dist/company'), false);
      assert.doesNotMatch(read('dist/sitemap.xml'), /\/company\//);
      assert.ok(exists('dist/draft/index.html'));
    } finally {
      child.kill();
      await closed;
    }
    const production = build();
    assert.equal(production.status, 0, production.stderr);
    assert.equal(exists('dist/draft'), false);
  });
});
