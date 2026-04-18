/**
 * Batch frame optimizer — конвертирует PNG/JPG кадры в WebP без потери качества.
 *
 * Использование:
 *   1. npm install sharp
 *   2. node optimize-frames.js ./твои-кадры ./output
 *
 * Стратегия:
 *   PNG → WebP lossless  (0% потери качества, ~50-70% меньше)
 *   JPG → WebP quality82 (визуально идентично, ~30-40% меньше)
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const inputDir  = process.argv[2] || './frames';
const outputDir = process.argv[3] || './frames-optimized';

if (!fs.existsSync(inputDir)) {
  console.error('Папка не найдена:', inputDir);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const SUPPORTED = /\.(png|jpg|jpeg)$/i;

async function optimizeFile(file) {
  const ext    = path.extname(file).toLowerCase();
  const base   = path.basename(file, ext);
  const input  = path.join(inputDir, file);
  const output = path.join(outputDir, base + '.webp');

  const srcSize = fs.statSync(input).size;
  const img = sharp(input);

  if (ext === '.png') {
    // PNG: lossless — абсолютно идентичное качество
    await img.webp({ lossless: true }).toFile(output);
  } else {
    // JPG: quality 82 + компенсирующий unsharp mask
    await img
      .sharpen({ sigma: 0.4, m1: 0.4, m2: 0.4 })
      .webp({ quality: 82, effort: 5 })
      .toFile(output);
  }

  const dstSize = fs.statSync(output).size;
  const saved   = Math.round((1 - dstSize / srcSize) * 100);

  return { file, srcSize, dstSize, saved };
}

async function run() {
  const files = fs.readdirSync(inputDir).filter(f => SUPPORTED.test(f)).sort();

  if (files.length === 0) {
    console.log('PNG/JPG файлы не найдены в', inputDir);
    return;
  }

  console.log(`\nОбрабатываю ${files.length} файлов...\n`);

  let totalSrc = 0, totalDst = 0;

  for (const file of files) {
    const result = await optimizeFile(file);
    totalSrc += result.srcSize;
    totalDst += result.dstSize;
    process.stdout.write(
      `  ${result.file.padEnd(30)} ${kb(result.srcSize).padStart(8)} → ${kb(result.dstSize).padStart(8)}  -${result.saved}%\n`
    );
  }

  console.log('\n' + '─'.repeat(60));
  console.log(
    `  ИТОГО: ${kb(totalSrc)} → ${kb(totalDst)}` +
    `  сэкономлено ${kb(totalSrc - totalDst)}  (-${Math.round((1 - totalDst / totalSrc) * 100)}%)`
  );
  console.log(`\n  Готово! Файлы в папке: ${outputDir}\n`);
}

function kb(bytes) { return Math.round(bytes / 1024) + ' KB'; }

run().catch(console.error);
