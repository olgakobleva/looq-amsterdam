/**
 * Batch frame optimizer для фотореалистичных рендеров бутылок (Solignac).
 *
 * Использование:
 *   1. npm install sharp
 *   2. node optimize-frames.js ./твои-кадры ./output
 *
 * Опционально — изменить размер (например до 1400px):
 *   node optimize-frames.js ./frames ./out 1400
 *
 * Стратегия для фотореалистичных PNG рендеров с белым фоном:
 *   WebP quality=85 — сохраняет мелкий текст, стеклянные блики, тонкие детали.
 *   Lossless НЕ используется — фотореалистичные рендеры не сжимаются losslessly,
 *   файл был бы больше оригинала.
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const inputDir   = process.argv[2] || './frames';
const outputDir  = process.argv[3] || './frames-optimized';
const maxWidth   = parseInt(process.argv[4]) || 0; // 0 = не изменять размер

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
  let img = sharp(input);

  // Уменьшить если указан maxWidth
  if (maxWidth > 0) {
    img = img.resize(maxWidth, maxWidth, {
      fit: 'inside',        // не обрезает, вписывает в квадрат
      withoutEnlargement: true,
    });
  }

  // Для фотореалистичных рендеров: quality 85 оптимален.
  // Стекло, мелкий текст и тонкие детали сохраняются полностью.
  // Артефакты заметны только ниже 75.
  await img
    .webp({
      quality: 85,
      effort: 6,          // 0-6, больше = меньше файл, медленнее конвертация
      smartSubsample: true, // лучше для мелких деталей и текста
    })
    .toFile(output);

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

  const meta = await sharp(path.join(inputDir, files[0])).metadata();
  console.log(`\nИсходный размер кадра: ${meta.width}x${meta.height}px`);
  if (maxWidth > 0) console.log(`Изменение размера до: ${maxWidth}px по ширине`);
  console.log(`Обрабатываю ${files.length} файлов...\n`);

  let totalSrc = 0, totalDst = 0;

  for (const file of files) {
    const result = await optimizeFile(file);
    totalSrc += result.srcSize;
    totalDst += result.dstSize;
    process.stdout.write(
      `  ${result.file.padEnd(35)} ${mb(result.srcSize).padStart(8)} → ${mb(result.dstSize).padStart(8)}   -${result.saved}%\n`
    );
  }

  const totalSavedMB = ((totalSrc - totalDst) / 1024 / 1024).toFixed(1);
  console.log('\n' + '─'.repeat(65));
  console.log(
    `  ИТОГО: ${mb(totalSrc)} → ${mb(totalDst)}` +
    `   сэкономлено ${totalSavedMB} MB  (-${Math.round((1 - totalDst / totalSrc) * 100)}%)`
  );
  console.log(`\n  Файлы готовы: ${outputDir}\n`);
  console.log('  Следующий шаг: замени пути к файлам в Webflow на .webp\n');
}

function mb(bytes) {
  return bytes >= 1024 * 1024
    ? (bytes / 1024 / 1024).toFixed(2) + ' MB'
    : Math.round(bytes / 1024) + ' KB';
}

run().catch(console.error);
