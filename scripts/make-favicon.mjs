// Генерирует фавиконки из знака «32»: скруглённый квадрат фирменного индиго
// (--brand-ink в globals.css) и цифры шрифтом Unbounded 700 — тем же, что в
// заголовках сайта. Запуск: `node scripts/make-favicon.mjs` (нужен python3 с
// fonttools — цифры переводятся в SVG-пути, чтобы картинка не зависела от
// установленных шрифтов; сам TTF качается из репозитория Google Fonts, как в
// subset-fonts.sh). Перегенерировать при смене цвета или шрифта.
//
// На выходе: public/icon.svg (векторная, для современных браузеров),
// public/icon-32x32.png (Safari и старые браузеры), public/apple-icon.png
// 180×180. Пути прописаны в metadata.icons в app/layout.tsx.
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const font = path.join(tmpdir(), 'Unbounded[wght].ttf')
const res = await fetch('https://github.com/google/fonts/raw/main/ofl/unbounded/Unbounded%5Bwght%5D.ttf')
if (!res.ok) throw new Error(`Не скачался Unbounded: ${res.status}`)
writeFileSync(font, Buffer.from(await res.arrayBuffer()))
const BG = '#3b41c5'

// Контуры «32» при весе 700: fonttools отдаёт path в единицах шрифта
// (y вверх), ниже он переворачивается и масштабируется под иконку.
const py = `
import json, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.varLib.instancer import instantiateVariableFont
f = instantiateVariableFont(TTFont(sys.argv[1]), {"wght": 700})
gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f["hmtx"]
x = 0; paths = []
for ch in "32":
    name = cmap[ord(ch)]; pen = SVGPathPen(gs)
    gs[name].draw(pen); paths.append((x, pen.getCommands())); x += hmtx[name][0]
print(json.dumps({"upm": f["head"].unitsPerEm, "width": x, "capHeight": f["OS/2"].sCapHeight, "paths": paths}))
`
const g = JSON.parse(execFileSync('python3', ['-c', py, font], { encoding: 'utf8' }))

// Иконка 100×100: цифры занимают ~66% ширины, стоят по центру.
const S = 100
const scale = (S * 0.66) / g.width
const textH = g.capHeight * scale
const ox = (S - g.width * scale) / 2
const oy = (S + textH) / 2
const digits = g.paths
  .map(([dx, d]) => `<path transform="translate(${(ox + dx * scale).toFixed(2)} ${oy.toFixed(2)}) scale(${scale.toFixed(5)} ${(-scale).toFixed(5)})" d="${d}"/>`)
  .join('\n    ')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" rx="22" fill="${BG}"/>
  <g fill="#ffffff">
    ${digits}
  </g>
</svg>
`
writeFileSync(path.join(root, 'public/icon.svg'), svg)

const png = (size) => sharp(Buffer.from(svg), { density: 72 * (size / S) * 4 }).resize(size, size).png()
await png(32).toFile(path.join(root, 'public/icon-32x32.png'))
// Apple сама скругляет углы — отдаём квадрат без своего радиуса.
await sharp(Buffer.from(svg.replace('rx="22"', 'rx="0"')), { density: 72 * (180 / S) * 4 })
  .resize(180, 180).png().toFile(path.join(root, 'public/apple-icon.png'))
console.log('ok')
