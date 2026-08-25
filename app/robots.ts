import type { MetadataRoute } from 'next'

const baseUrl = 'https://32dent-beta.vercel.app'

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