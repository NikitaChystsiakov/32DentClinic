import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Сайт отдаётся как статика с обычного хостинга (hoste.by, без Node.js):
  // `next build` складывает готовые HTML в out/, деплой — копирование папки.
  // См. docs/ДЕПЛОЙ.md. Серверных фич (route handlers, middleware, ISR) в
  // проекте нет и быть не должно; форма записи ходит в public/api/booking.php.
  output: 'export',
  // На хостинге нет оптимизатора картинок, поэтому next/image отдаёт файлы
  // из public/ как есть; сжатие делается заранее — `pnpm optimize-images`.
  images: { unoptimized: true },
  // /minsk/uslugi/ → out/minsk/uslugi/index.html: так Apache отдаёт страницы
  // без правил перезаписи.
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Статьи блога — .mdx-файлы в content/blog. Само расширение в pageExtensions
  // нужно, чтобы Next умел их компилировать; страницами они не становятся —
  // маршрут отдаёт app/blog/[slug]/page.tsx (см. lib/blog.ts).
  pageExtensions: ['ts', 'tsx', 'mdx'],
}

// Плагины remark/rehype намеренно не подключены: с Turbopack их можно
// передавать только строками-именами, а без них сборка проще и быстрее.
const withMDX = createMDX({})

export default withMDX(nextConfig)
