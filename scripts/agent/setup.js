#!/usr/bin/env node
// 로컬·워크트리·클라우드에서 같은 개발 의존성과 브라우저를 준비한다.
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const args = new Set(process.argv.slice(2));
if (args.has('--help')) {
  console.log('npm run agent:setup -- [--skip-install] [--skip-browser] [--with-deps]');
  process.exit(0);
}
for (const arg of args) {
  if (!['--skip-install', '--skip-browser', '--with-deps'].includes(arg)) throw new Error(`알 수 없는 옵션: ${arg}`);
}
if (Number(process.versions.node.split('.')[0]) < 20)
  throw new Error('Node.js 20 이상이 필요합니다. CI 권장 버전은 22입니다.');

function run(command, argv) {
  const result = spawnSync(command, argv, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

if (!args.has('--skip-install')) run('npm', ['ci']);
if (!args.has('--skip-browser')) {
  const cli = path.join(path.dirname(require.resolve('playwright/package.json', { paths: [ROOT] })), 'cli.js');
  run(process.execPath, [cli, 'install', ...(args.has('--with-deps') ? ['--with-deps'] : []), 'chromium']);
}
run('npm', ['run', 'build']);
run(process.execPath, [path.join(__dirname, 'doctor.js'), ...(args.has('--skip-browser') ? ['--skip-browser'] : [])]);
