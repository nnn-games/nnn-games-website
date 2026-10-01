const fs = require('fs');
const path = require('path');

// 빌드가 디렉터리를 비우므로 운영 dist 또는 tmp의 하위 폴더만 허용한다.
function resolveBuildOutput(root, output = 'dist') {
  const directory = path.resolve(root, output);
  const relative = path.relative(root, directory);
  if (relative !== 'dist' && !relative.startsWith(`tmp${path.sep}`)) {
    throw new Error('빌드 출력은 dist 또는 tmp/<하위 폴더>여야 합니다.');
  }
  let ancestor = directory;
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const realRelative = path.relative(fs.realpathSync(root), fs.realpathSync(ancestor));
  if (realRelative === '..' || realRelative.startsWith(`..${path.sep}`) || path.isAbsolute(realRelative)) {
    throw new Error('빌드 출력이 심볼릭 링크를 통해 저장소 밖을 가리킵니다.');
  }
  return directory;
}

module.exports = { resolveBuildOutput };
