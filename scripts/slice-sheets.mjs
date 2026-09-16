// Нарезка сгенерированных листов с иллюстрациями на отдельные файлы.
// Запуск: `pnpm slice-sheets` — когда в assets/sheets/ лежат три листа
// (см. docs/ИЗОБРАЖЕНИЯ-СГЕНЕРИРОВАТЬ.md):
//   services.png  — 2×4, лист 2:3, обложки услуг (4:3) → public/images/services/<slug>.webp
//   implants.png  — 3×3, лист 4:3, виды имплантации (4:3) → public/images/implants/<slug>.webp
//   stickers.png  — 3×2, лист 3:2, стикеры для hero (1:1) → public/stickers/<name>.webp (с альфой)
// Расширение исходника любое (png/jpg/webp). Между ячейками у листов тонкие
// белые линии — GUTTER срезает их по краю каждой ячейки. У стикеров белый
// фон переводится в прозрачность (порог WHITE_THRESHOLD), чтобы объект лежал
// на карточке без белого квадрата. Папка assets/sheets — вне public/, чтобы
// листы не попадали в сборку, и в .gitignore: это исходники, а не ассеты сайта.
import { access, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..', 'public')
const SHEETS = path.resolve(import.meta.dirname, '..', 'assets', 'sheets')
const GUTTER = 6 // px, срезаем белые линии между ячейками
// Порог белого для стикеров: фон у листа чисто белый (255), а у белых зубов
// даже блики чуть темнее и обведены серой тенью — поэтому порог высокий и
// заливка от краёв останавливается на контуре объекта, не заходя внутрь.
const WHITE_THRESHOLD = 252
const WHITE_FEATHER = 6 // ширина плавного края, единиц яркости
const QUALITY = 82

const SHEET_SPECS = [
  {
    name: 'services',
    // Лист 2:3 (портрет), 2 колонки × 4 ряда — тогда ячейки ровно 4:3, как
    // слоты обложек (service-card, services-overview, hero страницы услуги).
    // Старый лист был квадратный 4×2 с ячейками 1:2 — для него включается
    // extendToLandscape (см. ниже, по факту пропорции ячейки).
    cols: 2,
    rows: 4,
    out: path.join(ROOT, 'images', 'services'),
    width: 1600,
    height: 1200,
    // Порядок — слева направо, сверху вниз, как в промпте листа 1
    // (docs/ИЗОБРАЖЕНИЯ-СГЕНЕРИРОВАТЬ.md, §4).
    slugs: [
      'implantaciya',
      'terapiya',
      'lechenie-pod-mikroskopom',
      'khirurgiya',
      'ortodontiya',
      'protezirovanie',
      'gigiena',
      'diagnostika',
    ],
  },
  {
    name: 'implants',
    cols: 3,
    rows: 3,
    out: path.join(ROOT, 'images', 'implants'),
    width: 1600,
    height: 1200,
    // Как в промпте листа 2; slug — как в config/implantation.ts.
    slugs: [
      'odinochnyj-implant',
      'neskolko-zubov',
      'odnomomentnaya',
      'all-on-4',
      'all-on-6',
      'sinus-lifting',
      'kostnaya-plastika',
      'navigacionnaya',
      'protezirovanie-na-implantah',
    ],
  },
  {
    name: 'stickers',
    cols: 3,
    rows: 2,
    out: path.join(ROOT, 'stickers'),
    width: 1000,
    height: 1000,
    transparent: true,
    slugs: ['implant', 'all-on-4', 'all-on-6', 'air-flow', 'plomba', 'implant-screw'],
  },
]

async function findSheet(name) {
  const files = await readdir(SHEETS)
  const file = files.find((f) => path.parse(f).name === name)
  return file ? path.join(SHEETS, file) : null
}

// Белый фон → альфа. Прозрачным становится только белое, до которого можно
// «дойти» от края ячейки по белым пикселям (заливка, как волшебная палочка
// от рамки) — иначе белый зуб внутри объекта тоже стал бы прозрачным.
// У границы объекта альфа плавная, чтобы край не был рваным.
async function whiteToAlpha(image) {
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const px = new Uint8ClampedArray(data)
  const isWhite = (i) => Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]) >= WHITE_THRESHOLD - WHITE_FEATHER
  const outside = new Uint8Array(width * height)
  const stack = []
  for (let x = 0; x < width; x++) stack.push(x, (height - 1) * width + x)
  for (let y = 0; y < height; y++) stack.push(y * width, y * width + width - 1)
  while (stack.length) {
    const i = stack.pop()
    if (outside[i] || !isWhite(i)) continue
    outside[i] = 1
    const x = i % width
    if (x > 0) stack.push(i - 1)
    if (x < width - 1) stack.push(i + 1)
    if (i >= width) stack.push(i - width)
    if (i < width * (height - 1)) stack.push(i + width)
  }
  for (let i = 0; i < width * height; i++) {
    if (!outside[i]) continue
    const min = Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])
    px[i * 4 + 3] = min >= WHITE_THRESHOLD ? 0 : Math.round(((WHITE_THRESHOLD - min) / WHITE_FEATHER) * 255)
  }
  return sharp(Buffer.from(px.buffer), { raw: { width, height, channels: 4 } })
}

// Вертикальная ячейка → горизонтальный слот 4:3 без обрезки объекта: ячейка
// целиком по высоте в центре, по бокам — ровный градиент в цветах фона
// листа (лавандовый → небесный, замерено по краям ячеек). Размытая копия
// ячейки по бокам не подошла: тёмные пятна объекта проступали полосами.
async function extendToLandscape(image, width, height) {
  const cell = await image.png().toBuffer()
  const background = await sharp(
    Buffer.from(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#dde2fe"/>
          <stop offset="1" stop-color="#cfe1fc"/>
        </linearGradient></defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
      </svg>`
    )
  )
    .png()
    .toBuffer()
  const fg = sharp(cell).resize({ height, fit: 'inside' })
  const { width: fgWidth } = await fg.metadata().then(async (m) => {
    const ratio = height / m.height
    return { width: Math.round(m.width * ratio) }
  })
  // Края ячейки растворяем в фон (маска с прозрачными полосами по бокам),
  // иначе граница между резкой ячейкой и размытым фоном видна как рамка.
  const fade = Math.round(fgWidth * 0.3)
  const mask = Buffer.from(
    `<svg width="${fgWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset="${fade / fgWidth}" stop-color="#fff" stop-opacity="1"/>
        <stop offset="${1 - fade / fgWidth}" stop-color="#fff" stop-opacity="1"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`
  )
  const foreground = await fg
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
  return sharp(background).composite([{ input: foreground, gravity: 'centre' }])
}

try {
  await access(SHEETS)
} catch {
  console.error(`Нет папки ${SHEETS}. Положите туда services.*, implants.*, stickers.* и запустите снова.`)
  process.exit(1)
}

for (const spec of SHEET_SPECS) {
  const file = await findSheet(spec.name)
  if (!file) {
    console.log(`· ${spec.name}: листа нет, пропускаю`)
    continue
  }
  const meta = await sharp(file).metadata()
  // Пропорции листа должны соответствовать сетке (cols × rows ячеек целевой
  // пропорции), иначе это лист под другую раскладку — старый квадратный,
  // например — и нарезка порежет объекты. Допуск ±20 % на поля генератора.
  const expectedRatio = (spec.cols * spec.width) / (spec.rows * spec.height)
  const actualRatio = meta.width / meta.height
  if (Math.abs(actualRatio / expectedRatio - 1) > 0.2) {
    console.warn(
      `! ${spec.name}: лист ${meta.width}×${meta.height} не похож на сетку ${spec.cols}×${spec.rows} ` +
        `из ячеек ${spec.width}×${spec.height} (ожидаю пропорцию ~${expectedRatio.toFixed(2)}). Пропускаю — ` +
        `перегенерируйте лист по промпту из docs/ИЗОБРАЖЕНИЯ-СГЕНЕРИРОВАТЬ.md §4.`
    )
    continue
  }
  const cellW = Math.floor(meta.width / spec.cols)
  const cellH = Math.floor(meta.height / spec.rows)
  await mkdir(spec.out, { recursive: true })

  for (let i = 0; i < spec.slugs.length; i++) {
    const col = i % spec.cols
    const row = Math.floor(i / spec.cols)
    const region = {
      left: col * cellW + GUTTER,
      top: row * cellH + GUTTER,
      width: cellW - GUTTER * 2,
      height: cellH - GUTTER * 2,
    }
    let image = sharp(file).extract(region)
    if (spec.transparent) {
      image = await whiteToAlpha(image)
      // Стикер — квадрат, объект по центру: обрезаем лишние прозрачные поля.
      image = image.trim({ threshold: 10 })
    }
    // Ячейка листа обычно меньше целевого размера — увеличиваем до целевого
    // (kernel lanczos3 даёт самый чистый апскейл), без обрезки по сторонам.
    // Если ячейка заметно уже целевой пропорции (старый лист с ячейками 1:2
    // под слот 4:3), обрезать её нельзя — объект пропадёт; достраиваем поля.
    const needsExtend = region.width / region.height < (spec.width / spec.height) * 0.85
    const target = spec.transparent
      ? image.resize({ width: spec.width, height: spec.height, fit: 'inside', withoutEnlargement: false })
      : needsExtend
        ? await extendToLandscape(image, spec.width, spec.height)
        : image.resize({ width: spec.width, height: spec.height, fit: 'cover', position: 'centre' })
    const outFile = path.join(spec.out, `${spec.slugs[i]}.webp`)
    await target.webp({ quality: QUALITY }).toFile(outFile)
    console.log(`✓ ${path.relative(ROOT, outFile)}  (${region.width}×${region.height} → ${spec.width}×${spec.height})`)
  }
}

console.log('\nГотово. Проверьте public/images/services, public/images/implants, public/stickers,')
console.log('затем пропишите пути в config/implantation.ts (image) и content/<город>.ts (hero.offers[].image).')
