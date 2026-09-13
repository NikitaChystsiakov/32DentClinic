import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

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