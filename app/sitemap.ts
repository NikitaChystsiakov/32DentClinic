import type { MetadataRoute } from 'next'
import { cities } from '@/config/cities'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://32dent-beta.vercel.app'
  const pages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  const cityUrls = cities.map((city) => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...pages, ...cityUrls]
}