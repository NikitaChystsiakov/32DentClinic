// Подготовка фотографий клиники к передаче через git: исходники с фотосессии
// (4–5 МБ jpg) пережимаются в webp шириной 1400 px (~150–250 КБ), чтобы всю
// папку можно было запушить в отдельную ветку и выбрать кадры для сайта.
//
//   node scripts/prepare-upload-photos.mjs <папка-с-фото> [город]
//   node scripts/prepare-upload-photos.mjs ~/Downloads/32dent minsk
//
// Результат — upload/<город>/<имя>.webp в корне репозитория (не в public/:
// на сайт эти файлы не попадают, отобранные кадры потом переносятся в
// public/clinic/<город>/ отдельно). Подпапки обходятся рекурсивно, префикс
// «Копия » в имени файла отбрасывается.
import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const [, , srcArg, city = 'minsk'] = process.argv
if (!srcArg) {
  console.error('Укажите папку с фото: node scripts/prepare-upload-photos.mjs <папка> [город]')
  process.exit(1)
}

const SRC = path.resolve(srcArg.replace(/^~(?=$|\/)/, process.env.HOME ?? '~'))
const OUT = path.resolve(import.meta.dirname, '..', 'upload', city)
const WIDTH = 1400
const QUALITY = 75
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic'])

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (EXT.has(path.extname(entry.name).toLowerCase())) yield full
  }
}

await mkdir(OUT, { recursive: true })

let count = 0
let before = 0
let after = 0
for await (const file of walk(SRC)) {
  const name = path.basename(file, path.extname(file)).replace(/^Копия\s+/i, '').replace(/\s+/g, '-')
  const target = path.join(OUT, `${name}.webp`)
  try {
    const info = await sharp(file)
      .rotate() // учесть EXIF-ориентацию до ресайза
      .resize({ width: WIDTH, height: WIDTH, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(target)
    before += (await stat(file)).size
    after += info.size
    count++
    process.stdout.write(`\r${count} файлов…`)
  } catch (error) {
    console.error(`\nПропущен ${file}: ${error.message}`)
  }
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} МБ`
console.log(`\nГотово: ${count} фото, ${mb(before)} → ${mb(after)}. Папка: ${path.relative(process.cwd(), OUT)}`)
