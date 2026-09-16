import type { MetadataRoute } from 'next'
import { cities } from '@/config/cities'
import { getRealDoctorsForCity } from '@/config/doctors'
import { nearbyTowns } from '@/config/nearby-towns'
import { getProtocolsForCity } from '@/config/implantation'
import { getServicesForCity } from '@/config/services'
import { getPublishedPosts } from '@/lib/blog'
import { siteConfig } from '@/lib/site-config'

// Метаданные-маршруты при output: 'export' нужно явно объявить статическими,
// иначе сборка падает — файл генерируется один раз в out/.
export const dynamic = 'force-static'

// lastModified у страниц намеренно нет: раньше стояло `new Date()`, и каждая
// сборка «обновляла» все 77 адресов разом — поисковик перестаёт верить такой
// дате. Реальная дата есть только у статей блога (post.date).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Адреса со слешем на конце — как их отдаёт хостинг (trailingSlash в next.config).
  const baseUrl = siteConfig.siteUrl
  const pages = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ]

  const cityUrls = cities.map((city) => ({
    url: `${baseUrl}/${city.slug}/`,
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
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...getServicesForCity(city.slug).map((service) => ({
      url: `${baseUrl}/${city.slug}/uslugi/${service.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Подстраницы протоколов имплантации — хаб /uslugi/implantaciya/ уже
    // попал выше вместе с остальными услугами.
    ...getProtocolsForCity(city.slug).map((protocol) => ({
      url: `${baseUrl}/${city.slug}/uslugi/implantaciya/${protocol.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...getRealDoctorsForCity(city.slug).map((doctor) => ({
      url: `${baseUrl}/${city.slug}/vrachi/${doctor.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ])

  // Посадочные страницы «соседних» городов без клиники (/svetlogorsk).
  const townUrls = nearbyTowns.map((town) => ({
    url: `${baseUrl}/${town.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Черновики getPublishedPosts не отдаёт, поэтому в карту сайта они не попадут.
  // Индекс блога — только когда есть хотя бы одна статья: пустой раздел в
  // карте сайта поисковику не нужен (сама страница /blog/ при этом noindex,
  // см. app/blog/page.tsx).
  const posts = await getPublishedPosts()
  const blogUrls = [
    ...(posts.length > 0
      ? [
          {
            url: `${baseUrl}/blog/`,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          },
        ]
      : []),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]

  return [...pages, ...cityUrls, ...citySectionUrls, ...townUrls, ...blogUrls]
}