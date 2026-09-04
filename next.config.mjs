import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
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
