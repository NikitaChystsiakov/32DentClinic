// Заранее сжимает текстовые файлы out/ в .br и .gz рядом с оригиналами.
// nginx отдаёт .gz как есть (gzip_static), без сжатия на лету; .br — на
// будущее, модуля Brotli на сервере пока нет — см. docs/nginx-32dent.by.conf.
//
// Зачем: «на лету» nginx жмёт gzip уровнем 1, а Brotli 11 уменьшает HTML
// главной Минска с 72 до 32 КБ, а всё, что нужно для первого экрана, — на
// треть. На медленном мобильном интернете это напрямую ускоряет первую
// отрисовку (PageSpeed, LCP). Максимальные уровни медленные, но жмём один
// раз при сборке, а не на каждый запрос.
//
// Запускается из `pnpm build` после next build: next build пересоздаёт out/,
// так что старых .br/.gz с устаревшим содержимым там не остаётся.

import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { brotliCompressSync, gzipSync, constants } from 'node:zlib'

const root = new URL('../out/', import.meta.url).pathname
const extensions = new Set(['.html', '.css', '.js', '.txt', '.json', '.xml', '.svg', '.map', '.webmanifest'])
// Меньше ~1 КБ сжатие почти ничего не даёт, а файлов становится втрое больше.
const minSize = 1024

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else yield path
  }
}

let files = 0
let before = 0
let afterBr = 0

for await (const path of walk(root)) {
  if (!extensions.has(extname(path))) continue
  // api/ — PHP формы записи и его локальный config.php, их не трогаем.
  if (path.startsWith(join(root, 'api'))) continue
  if ((await stat(path)).size < minSize) continue

  const data = await readFile(path)
  const br = brotliCompressSync(data, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
      [constants.BROTLI_PARAM_SIZE_HINT]: data.length,
    },
  })
  const gz = gzipSync(data, { level: 9 })
  await writeFile(`${path}.br`, br)
  await writeFile(`${path}.gz`, gz)

  files++
  before += data.length
  afterBr += br.length
}

const kb = (n) => `${Math.round(n / 1024)} КБ`
console.log(`precompress: ${files} файлов, ${kb(before)} → ${kb(afterBr)} в Brotli`)
