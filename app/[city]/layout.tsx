import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { City } from '@/config/cities'
import { getCityBySlug, VALID_CITY_SLUGS } from '@/config/cities'
import {
  getNearbyTownBySlug,
  getNearbyTownsForCity,
  getPrimaryClinicSlug,
  NEARBY_TOWN_SLUGS,
} from '@/config/nearby-towns'
import { getCityContent } from '@/content'
import { getTownContent } from '@/content/towns'
import { CityProvider } from '@/lib/contexts/city-context'
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
      title: {
        default: townContent.metaTitle,
        template: `%s | 32Дент`,
      },
      description: townContent.metaDescription,
      robots: { index: true, follow: true },
      alternates: { canonical: `${siteConfig.siteUrl}/${slug}` },
    }
  }

  const city = getCityBySlug(slug)
  if (!city) return {}

  return {
    title: {
      default: city.seoTitle,
      template: `%s | 32Дент, ${city.name}`,
    },
    description: city.seoDescription,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${siteConfig.siteUrl}/${slug}`,
    },
  }
}

// areaServed — соседние города, откуда клиника принимает пациентов. Так
// поисковик понимает, что жлобинская клиника относится и к запросам из
// Светлогорска, без выдуманного адреса в самом Светлогорске.
const generateJsonLd = (city: City) => ({
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  name: city.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: city.address,
    addressLocality: city.name,
    addressCountry: 'BY',
  },
  telephone: city.phone,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: city.coordinates.lat,
    longitude: city.coordinates.lng,
  },
  openingHours: 'Mo-Sa 08:00-19:00',
  areaServed: [
    { '@type': 'City', name: city.name },
    ...getNearbyTownsForCity(city.slug).map((t) => ({
      '@type': 'City',
      name: t.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: t.region },
    })),
  ],
})

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(city)).replace(/</g, '\\u003c') }}
      />
    </CityProvider>
  )
}
