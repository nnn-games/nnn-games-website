#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');

async function main() {
  const checks = [];
  const check = (name, ok, detail) => {
    checks.push({ name, ok, detail });
    console.log(`${ok ? 'OK' : 'FAIL'} ${name}: ${detail}`);
  };
  check('Node.js', Number(process.versions.node.split('.')[0]) >= 20, process.version);
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  for (const name of Object.keys(pkg.devDependencies)) {
    try {
      require.resolve(name, { paths: [ROOT] });
      check(name, true, '설치됨');
    } catch {
      check(name, false, 'npm ci가 필요합니다');
    }
  }
  for (const file of ['AGENTS.md', '.codex/config.toml', 'docs/agent-development.md']) {
    check(file, fs.existsSync(path.join(ROOT, file)), '프로젝트 설정');
  }
  const skillsRoot = path.join(ROOT, '.agents/skills');
  const entries = fs.existsSync(skillsRoot) ? fs.readdirSync(skillsRoot) : [];
  check('저장소 스킬', entries.length > 0, `${entries.length}개`);
  for (const entry of entries) {
    const file = path.join(skillsRoot, entry, 'SKILL.md');
    const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content)?.[1] || '';
    const name = /^name:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim();
    check(`skill:${entry}`, name === entry && /^description:\s*\S.+$/m.test(frontmatter), '이름·설명·진입 파일');
  }
  if (!process.argv.includes('--skip-browser')) {
    try {
      const { chromium } = require('playwright');
      const browser = await chromium.launch();
      await browser.close();
      check('Chromium', true, '실제 실행 확인');
    } catch (error) {
      check('Chromium', false, `${error.message.split('\n')[0]} — npm run agent:setup`);
    }
  }
  const codex = spawnSync('codex', ['--version'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 10000,
    shell: process.platform === 'win32'
  });
  console.log(
    codex.status === 0
      ? `INFO Codex CLI: ${codex.stdout.trim()}`
      : 'INFO Codex CLI 없음: 앱/IDE에서도 하네스를 사용할 수 있습니다.'
  );
  if (checks.some((item) => !item.ok)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
