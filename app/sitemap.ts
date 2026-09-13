import type { MetadataRoute } from 'next'
import { cities } from '@/config/cities'
import { nearbyTowns } from '@/config/nearby-towns'
import { getPublishedPosts } from '@/lib/blog'
import { siteConfig } from '@/lib/site-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl
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

  // Посадочные страницы «соседних» городов без клиники (/svetlogorsk).
  const townUrls = nearbyTowns.map((town) => ({
    url: `${baseUrl}/${town.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Черновики getPublishedPosts не отдаёт, поэтому в карту сайта они не попадут.
  const posts = await getPublishedPosts()
  const blogUrls = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]

  return [...pages, ...cityUrls, ...townUrls, ...blogUrls]
}