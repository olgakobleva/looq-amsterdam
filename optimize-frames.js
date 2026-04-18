/**
 * Batch frame optimizer для кадров анимации бутылки (прозрачный фон PNG).
 *
 * Использование:
 *   1. npm install sharp
 *   2. node optimize-frames.js ./твои-кадры ./output
 *      node optimize-frames.js ./frames ./out 1400    ← + изменить размер до 1400px
 *
 * Стратегия:
 *   PNG с alpha → пробует lossless И quality=85+alphaQuality=100,
 *                 сохраняет тот, что меньше.
 *   PNG без alpha / JPG → WebP quality=85.
 *
 * Для фотореалистичных рендеров (стекло, блики, градиенты):
 *   quality=85 обычно меньше lossless.
 * Для чистой CGI-графики (плоские цвета, мало шума):
 *   lossless обычно меньше.
 * Скрипт выбирает автоматически.
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const inputDir  = process.argv[2] || './frames';
const outputDir = process.argv[3] || './frames-optimized';
const maxWidth  = parseInt(process.argv[4]) || 0;

if (!fs.existsSync(inputDir)) {
  console.error('Папка не найдена:', inputDir);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const SUPPORTED = /\.(png|jpg|jpeg)$/i;

async function optimizeFile(file) {
  const ext   = path.extname(file).toLowerCase();
  const base  = path.basename(file, ext);
  const input = path.join(inputDir, file);
  const output = path.join(outputDir, base + '.webp');
  const srcSize = fs.statSync(input).size;

  const meta = await sharp(input).metadata();
  const hasAlpha = meta.channels === 4;

  function pipeline() {
    let img = sharp(input);
    if (maxWidth > 0) {
      img = img.resize(maxWidth, maxWidth, { fit: 'inside', withoutEnlargement: true });
    }
    return img;
  }

  let method;

  if (!hasAlpha || ext !== '.png') {
    // Нет прозрачности — просто quality 85
    await pipeline().webp({ quality: 85, effort: 6, smartSubsample: true }).toFile(output);
    method = 'q85';
  } else {
    // Есть alpha — пробуем оба, берём меньший
    const tmpLossless = output + '.ll.webp';
    const tmpLossy    = output + '.ly.webp';

    await pipeline().webp({ lossless: true }).toFile(tmpLossless);
    await pipeline().webp({ quality: 85, alphaQuality: 100, effort: 6, smartSubsample: true }).toFile(tmpLossy);

    const llSize = fs.statSync(tmpLossless).size;
    const lySize = fs.statSync(tmpLossy).size;

    if (llSize <= lySize) {
      fs.renameSync(tmpLossless, output);
      fs.unlinkSync(tmpLossy);
      method = 'lossless';
    } else {
      fs.renameSync(tmpLossy, output);
      fs.unlinkSync(tmpLossless);
      method = 'q85+a100';
    }
  }

  const dstSize = fs.statSync(output).size;
  const saved   = Math.round((1 - dstSize / srcSize) * 100);
  return { file, srcSize, dstSize, saved, method };
}

async function run() {
  const files = fs.readdirSync(inputDir).filter(f => SUPPORTED.test(f)).sort();
  if (files.length === 0) {
    console.log('PNG/JPG файлы не найдены в', inputDir);
    return;
  }

  const meta = await sharp(path.join(inputDir, files[0])).metadata();
  const hasAlpha = meta.channels === 4;

  console.log(`\nИсходный размер кадра: ${meta.width}x${meta.height}px`);
  console.log(`Alpha-канал: ${hasAlpha ? 'да (прозрачный фон)' : 'нет (белый/цветной фон)'}`);
  if (maxWidth > 0) console.log(`Изменение размера до: ${maxWidth}px`);
  console.log(`Обрабатываю ${files.length} файлов...\n`);

  let totalSrc = 0, totalDst = 0;

  for (const file of files) {
    const r = await optimizeFile(file);
    totalSrc += r.srcSize;
    totalDst += r.dstSize;
    process.stdout.write(
      `  ${r.file.padEnd(35)} ${mb(r.srcSize).padStart(8)} → ${mb(r.dstSize).padStart(8)}   -${r.saved}%  [${r.method}]\n`
    );
  }

  const savedMB = ((totalSrc - totalDst) / 1024 / 1024).toFixed(1);
  console.log('\n' + '─'.repeat(70));
  console.log(`  ИТОГО: ${mb(totalSrc)} → ${mb(totalDst)}   сэкономлено ${savedMB} MB  (-${Math.round((1 - totalDst / totalSrc) * 100)}%)`);
  console.log(`\n  Файлы готовы: ${outputDir}`);
  console.log('  Замени пути в Webflow с .png → .webp\n');
}

function mb(b) {
  return b >= 1048576 ? (b / 1048576).toFixed(2) + ' MB' : Math.round(b / 1024) + ' KB';
}

run().catch(console.error);
