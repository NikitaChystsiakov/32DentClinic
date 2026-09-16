import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { City } from '@/config/cities'
import { getCityBySlug, VALID_CITY_SLUGS } from '@/config/cities'
import { getNearbyTownBySlug, getPrimaryClinicSlug, NEARBY_TOWN_SLUGS } from '@/config/nearby-towns'
import { getCityContent } from '@/content'
import { getTownContent } from '@/content/towns'
import { CityProvider } from '@/lib/contexts/city-context'
import { absoluteUrl, clinicJsonLd, OG_IMAGE } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

/*
 * Сегмент [city] обслуживает два вида адресов:
 *   • /minsk, /rogachev, /zhlobin — города с клиникой (config/cities.ts),
 *     у них есть подстраницы в группе (clinic);
 *   • /svetlogorsk — «соседний» город без клиники (config/nearby-towns.ts),
 *     у него одна посадочная страница, подстраниц нет.
 * В обоих случаях в CityProvider уходит клиника: для соседнего города — его
 * основная (первая в clinics), чтобы шапка, футер и форма записи показывали
 * её телефон и адрес.
 */
export function generateStaticParams() {
  return [...VALID_CITY_SLUGS, ...NEARBY_TOWN_SLUGS].map((city) => ({ city }))
}

function resolveClinic(slug: string): City | undefined {
  const city = getCityBySlug(slug)
  if (city) return city
  const town = getNearbyTownBySlug(slug)
  return town ? getCityBySlug(getPrimaryClinicSlug(town)) : undefined
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: slug } = await params

  const town = getNearbyTownBySlug(slug)
  const townContent = town ? getTownContent(slug) : undefined
  if (town && townContent) {
    return {
      // absolute — metaTitle посадочной уже содержит бренд («… | 32Дент»);
      // с `default` корневой шаблон дописывал бренд второй раз, и title
      // раздувался до 85 знаков. Подстраниц у соседнего города нет, поэтому
      // template не нужен.
      title: { absolute: townContent.metaTitle },
      description: townContent.metaDescription,
      robots: { index: true, follow: true },
      alternates: { canonical: absoluteUrl(`/${slug}/`) },
      openGraph: {
        title: townContent.metaTitle,
        description: townContent.metaDescription,
        url: absoluteUrl(`/${slug}/`),
        siteName: siteConfig.name,
        locale: 'ru_BY',
        type: 'website',
        images: [OG_IMAGE],
      },
    }
  }

  const city = getCityBySlug(slug)
  if (!city) return {}

  return {
    // absolute — чтобы корневой шаблон «%s | 32Дент» не дописывал сеть к
    // заголовку города («…32Дент+ Минск | 32Дент»); template — для подстраниц.
    title: {
      absolute: city.seoTitle,
      template: `%s | ${city.brandName}, ${city.name}`,
    },
    description: city.seoDescription,
    robots: {
      index: true,
      follow: true,
    },
    // canonical здесь — только для главной города (/minsk/): у неё нет
    // своего generateMetadata. Всё, что задано в layout, Next наследует на
    // подстраницы, поэтому КАЖДАЯ подстраница обязана переопределять его
    // через buildMetadata() из lib/seo.ts — иначе /minsk/uslugi/… снова
    // станет для поисковика «копией» /minsk/. Адрес со слешем на конце,
    // как отдаёт хостинг (trailingSlash).
    alternates: {
      canonical: absoluteUrl(`/${slug}/`),
    },
    openGraph: {
      title: city.seoTitle,
      description: city.seoDescription,
      url: absoluteUrl(`/${slug}/`),
      siteName: siteConfig.name,
      locale: 'ru_BY',
      type: 'website',
      images: [OG_IMAGE],
    },
  }
}

// Схема клиники (schema.org/Dentist) — общая с посадочными соседних
// городов, см. clinicJsonLd в lib/seo.ts. Часы — из content.contacts.hours.
export default async function CityLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ city: string }>
}) {
  const { city: slug } = await params
  const city = resolveClinic(slug)
  if (!city) notFound()

  const content = getCityContent(city.slug)
  if (!content) notFound()

  return (
    <CityProvider city={city} content={content}>
      {children}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd(city, content.contacts.hours)).replace(/</g, '\\u003c') }}
      />
    </CityProvider>
  )
}
