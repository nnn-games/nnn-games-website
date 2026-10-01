// dist/ 를 임시 포트로 서비스하는 헬퍼 (Playwright 스크립트 공용)
// - dist 가 없으면 빌드를 먼저 실행한다
// - start() 는 { baseUrl, stop } 을 돌려준다
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn, spawnSync } = require('child_process');
const { resolveBuildOutput } = require('./build-output');

const ROOT = path.join(__dirname, '..', '..');
const DIST = path.join(ROOT, 'dist');

function ensureDist(directory, { rebuild, includeDraft }) {
  if (!rebuild && fs.existsSync(path.join(directory, 'index.html'))) return;
  const args = [path.join(ROOT, 'scripts', 'build.js'), '--out', path.relative(ROOT, directory)];
  if (includeDraft) args.push('--include-drafts');
  const result = spawnSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) throw new Error('빌드 실패');
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function waitForServer(url, timeoutMs = 15000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      fetch(url)
        .then((res) => (res.ok ? resolve() : retry()))
        .catch(retry);
    };
    const retry = () => {
      if (Date.now() - started > timeoutMs) reject(new Error(`서버 응답 없음: ${url}`));
      else setTimeout(tick, 200);
    };
    tick();
  });
}

async function start({ directory = DIST, rebuild = false, includeDraft = false } = {}) {
  directory = resolveBuildOutput(ROOT, directory);
  ensureDist(directory, { rebuild, includeDraft });
  const port = await freePort();
  const bin = require.resolve('http-server/bin/http-server', { paths: [ROOT] });
  const child = spawn(process.execPath, [bin, directory, '-p', String(port), '-a', '127.0.0.1', '-c-1', '-s'], {
    cwd: ROOT,
    stdio: 'ignore'
  });
  const baseUrl = `http://127.0.0.1:${port}`;
  let spawnError;
  child.on('error', (error) => { spawnError = error; });
  try {
    await waitForServer(`${baseUrl}/index.html`);
    if (spawnError) throw spawnError;
  } catch (error) {
    child.kill();
    throw spawnError || error;
  }
  return {
    baseUrl,
    stop: () => {
      if (!child.killed) child.kill();
    }
  };
}

module.exports = { start, ROOT, DIST };
