import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

// Метаданные-маршруты при output: 'export' нужно явно объявить статическими,
// иначе сборка падает — файл генерируется один раз в out/.
export const dynamic = 'force-static'

const baseUrl = siteConfig.siteUrl

export default function robots(): MetadataRoute.Robots {
  return {
    // robots.txt не понимает регулярные выражения (только * и $), поэтому
    // правила простые. /_next/ не закрываем: там CSS и JS, без них Google
    // не отрендерит страницу. Юридические документы и заглушки закрыты
    // через meta robots noindex на самих страницах.
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}