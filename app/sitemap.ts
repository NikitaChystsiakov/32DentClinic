import type { MetadataRoute } from 'next'
import { cities } from '@/config/cities'
import { getRealDoctorsForCity } from '@/config/doctors'
import { nearbyTowns } from '@/config/nearby-towns'
import { getServicesForCity } from '@/config/services'
import { getPublishedPosts } from '@/lib/blog'
import { siteConfig } from '@/lib/site-config'

// Метаданные-маршруты при output: 'export' нужно явно объявить статическими,
// иначе сборка падает — файл генерируется один раз в out/.
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Адреса со слешем на конце — как их отдаёт хостинг (trailingSlash в next.config).
  const baseUrl = siteConfig.siteUrl
  const pages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  const cityUrls = cities.map((city) => ({
    url: `${baseUrl}/${city.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Разделы клиники и страницы услуг/врачей — только те, что реально есть
  // в городе (availableIn у услуги, cities у врача), иначе в карту попадут
  // страницы направлений, которых в этой клинике нет. Врачи-заглушки
  // (isPlaceholder) в карту не идут.
  const CITY_SECTIONS = ['uslugi', 'vrachi', 'ceny', 'kontakty', 'o-nas', 'primery-rabot', 'kalkulyator']
  const citySectionUrls = cities.flatMap((city) => [
    ...CITY_SECTIONS.map((section) => ({
      url: `${baseUrl}/${city.slug}/${section}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...getServicesForCity(city.slug).map((service) => ({
      url: `${baseUrl}/${city.slug}/uslugi/${service.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...getRealDoctorsForCity(city.slug).map((doctor) => ({
      url: `${baseUrl}/${city.slug}/vrachi/${doctor.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ])

  // Посадочные страницы «соседних» городов без клиники (/svetlogorsk).
  const townUrls = nearbyTowns.map((town) => ({
    url: `${baseUrl}/${town.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Черновики getPublishedPosts не отдаёт, поэтому в карту сайта они не попадут.
  const posts = await getPublishedPosts()
  const blogUrls = [
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]

  return [...pages, ...cityUrls, ...citySectionUrls, ...townUrls, ...blogUrls]
}