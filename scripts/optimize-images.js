#!/usr/bin/env node
/**
 * 이미지 최적화 (sharp)
 * - 지정한 이미지를 WebP(기본) 또는 같은 포맷으로 재인코딩하고, 필요하면 가로 폭을 제한한다.
 * - --update-refs <dir...> 를 주면 그 디렉터리의 html/css/js/json 안에서 원본 파일명(공백은 %20 인코딩 포함)을
 *   새 파일명으로 바꾸고 원본을 삭제한다. 주지 않으면 새 파일만 옆에 만든다.
 *
 * Usage:
 *   node scripts/optimize-images.js decks/jumpstart/img/hero-sc.png [...more]
 *   node scripts/optimize-images.js decks/jumpstart/img/*.png --update-refs decks/jumpstart
 *   옵션: --quality 82   --max-width 1920   --keep-format (PNG/JPEG 그대로 재압축)   --dry-run
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const argv = process.argv.slice(2);
const files = [];
const refDirs = [];
let quality = 82;
let maxWidth = 0;
let keepFormat = false;
let dryRun = false;

for (let i = 0; i < argv.length; i += 1) {
  const a = argv[i];
  if (a === '--quality') quality = Number(argv[++i]);
  else if (a === '--max-width') maxWidth = Number(argv[++i]);
  else if (a === '--keep-format') keepFormat = true;
  else if (a === '--dry-run') dryRun = true;
  else if (a === '--update-refs') {
    while (argv[i + 1] && !argv[i + 1].startsWith('--')) refDirs.push(argv[++i]);
  } else files.push(a);
}
if (!files.length) {
  console.error('대상 이미지를 지정하세요. 예: node scripts/optimize-images.js decks/jumpstart/img/hero-sc.png --update-refs decks/jumpstart');
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(html|css|js|json)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function updateRefs(oldName, newName) {
  let changed = 0;
  const variants = [
    [oldName, newName],
    [encodeURIComponent(oldName), encodeURIComponent(newName)],
    [encodeURI(oldName), encodeURI(newName)]
  ];
  for (const dir of refDirs) {
    for (const file of walk(path.resolve(ROOT, dir))) {
      const before = fs.readFileSync(file, 'utf8');
      let after = before;
      for (const [from, to] of variants) after = after.split(from).join(to);
      if (after !== before) {
        if (!dryRun) fs.writeFileSync(file, after);
        changed += 1;
        console.log(`    참조 갱신: ${path.relative(ROOT, file)}`);
      }
    }
  }
  return changed;
}

async function optimize(rel) {
  const src = path.resolve(ROOT, rel);
  if (!fs.existsSync(src)) throw new Error(`없음: ${rel}`);
  const before = fs.statSync(src).size;
  const ext = path.extname(src).toLowerCase();
  const targetExt = keepFormat ? ext : '.webp';
  const dest = path.join(path.dirname(src), `${path.basename(src, ext)}${targetExt}`);

  let pipeline = sharp(src);
  const meta = await pipeline.metadata();
  if (maxWidth && meta.width > maxWidth) pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  if (targetExt === '.webp') pipeline = pipeline.webp({ quality });
  else if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality });
  else if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality, mozjpeg: true });

  const buffer = await pipeline.toBuffer();
  const after = buffer.length;
  const info = await sharp(buffer).metadata();
  console.log(`  ${path.relative(ROOT, src)} ${meta.width}x${meta.height} ${(before / 1024).toFixed(0)}KB → ${path.basename(dest)} ${info.width}x${info.height} ${(after / 1024).toFixed(0)}KB (${((1 - after / before) * 100).toFixed(0)}% 감소)`);
  if (dryRun) return;
  fs.writeFileSync(dest, buffer);
  if (dest !== src && refDirs.length) {
    updateRefs(path.basename(src), path.basename(dest));
    fs.unlinkSync(src);
  }
}

(async () => {
  for (const file of files) await optimize(file);
  if (dryRun) console.log('(dry-run: 파일을 쓰지 않았습니다)');
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
