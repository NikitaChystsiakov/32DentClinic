// Генерирует app/opengraph-image.png — превью ссылки в Viber/Telegram/соцсетях
// (1200×630). Запуск: `node scripts/make-og-image.mjs`. Перегенерировать
// при смене логотипа или фирменного цвета (--hero-surface в globals.css).
//
// Логотип в public/images/logo.png серый на прозрачном фоне — здесь его
// альфа-канал используется как маска и заливается белым.

import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const W = 1200
const H = 630

const logoSrc = path.join(root, 'public/images/logo.png')
const out = path.join(root, 'app/opengraph-image.png')

// Белый логотип: берём альфу исходника, красим в белый.
const logoWidth = 520
const { data: alpha, info } = await sharp(logoSrc)
  .resize({ width: logoWidth, kernel: 'lanczos3' })
  .extractChannel('alpha')
  .raw()
  .toBuffer({ resolveWithObject: true })

const white = await sharp({
  create: { width: info.width, height: info.height, channels: 3, background: '#ffffff' },
})
  .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
  .png()
  .toBuffer()

const background = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4b4ecf"/>
      <stop offset="1" stop-color="#5f63dc"/>
    </linearGradient>
    <radialGradient id="r" cx="0.9" cy="-0.1" r="0.7">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#r)"/>
  <text x="${W / 2}" y="${H - 118}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="40" font-weight="700" fill="#ffffff">Сеть стоматологий</text>
  <text x="${W / 2}" y="${H - 66}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="28" fill="#ffffff" fill-opacity="0.85">Минск · Рогачёв · Жлобин</text>
</svg>`

await sharp(Buffer.from(background))
  .composite([{ input: white, left: Math.round((W - info.width) / 2), top: Math.round((H - 150 - info.height) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile(out)

console.log(`ok → ${path.relative(root, out)}`)
