import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

// Метаданные-маршруты при output: 'export' нужно явно объявить статическими,
// иначе сборка падает — файл генерируется один раз в out/.
export const dynamic = 'force-static'

const baseUrl = siteConfig.siteUrl

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/([a-z]+)?/'],
      disallow: ['/api/', '/admin/', '/(.*)__*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}