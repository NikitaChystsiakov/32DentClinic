import { cities } from '@/config/cities'

export const dynamic = 'force-static'
export const revalidate = 60 * 60 * 24 * 30

export default { dynamic, revalidate, generateSitemap }

export function generateSitemap() {
  const baseUrl = 'https://32dent-beta.vercel.app'
  const pages = [
    {
      url: baseUrl,
      lastmod: new Date(),
      changeFrequency: ' daily ',
      priority: 1,
    },
  ]

  const cityUrls = cities.map((city) => ({
    url: `${baseUrl}/${city.slug}`,
    lastmod: new Date(),
    changeFrequency: ' monthly ' as const,
    priority: 0.8,
  }))

  return [pages, cityUrls].flat()
}