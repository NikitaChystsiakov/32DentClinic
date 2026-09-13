// Сжатие фотографий в public/images/**. Запуск вручную: `pnpm optimize-images`
// — когда добавили новые фото. Файлы тяжелее MAX_BYTES ресайзятся до ширины
// MAX_WIDTH и пережимаются в webp; остальные не трогаются. Перезаписывает
// на месте (webp остаётся webp, jpg/png превращаются в .webp рядом, а
// исходник удаляется — путь в конфиге тогда нужно поправить, скрипт об этом
// напомнит). Сайт собирается как статика с `images.unoptimized`, поэтому
// сжатие делается здесь, один раз, а не сервером при каждом запросе.
import { readdir, stat, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..', 'public', 'images')
const MAX_BYTES = 300 * 1024
const MAX_WIDTH = 1600
const QUALITY = 80
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (EXT.has(path.extname(entry.name).toLowerCase())) yield full
  }
}

const kb = (n) => `${Math.round(n / 1024)} КБ`

const rows = []
const renamed = []
for await (const file of walk(ROOT)) {
  const before = (await stat(file)).size
  if (before <= MAX_BYTES) continue

  const buf = await sharp(file)
    .rotate() // учесть EXIF-ориентацию до ресайза
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer()

  const target = file.replace(/\.[^.]+$/, '.webp')
  await writeFile(target, buf)
  if (target !== file) {
    await unlink(file)
    renamed.push([path.relative(ROOT, file), path.relative(ROOT, target)])
  }
  rows.push({ file: path.relative(ROOT, target), before, after: buf.length })
}

if (rows.length === 0) {
  console.log(`Все файлы в public/images легче ${kb(MAX_BYTES)} — ничего не сжато.`)
} else {
  const width = Math.max(...rows.map((r) => r.file.length))
  for (const r of rows) {
    console.log(`${r.file.padEnd(width)}  ${kb(r.before).padStart(8)} → ${kb(r.after).padStart(8)}`)
  }
  const total = rows.reduce((s, r) => s + r.before - r.after, 0)
  console.log(`\nСжато файлов: ${rows.length}, освобождено ${kb(total)}.`)
}

if (renamed.length) {
  console.log('\nРасширение сменилось на .webp — поправьте пути в конфигах:')
  for (const [from, to] of renamed) console.log(`  ${from} → ${to}`)
}
