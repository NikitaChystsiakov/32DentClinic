import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import type { City } from '@/config/cities'
import { getCityBySlug, VALID_CITY_SLUGS } from '@/config/cities'
import { getCityContent } from '@/content'
import { CityProvider } from '@/lib/contexts/city-context'

export function generateStaticParams() {
  return VALID_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
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
      canonical: `https://32dent-beta.vercel.app/${citySlug}`,
    },
  }
}

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
})

export default async function CityLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  const content = getCityContent(citySlug)
  if (!content) notFound()

  return (
    <CityProvider city={city} content={content}>
      {children}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(city)) }}
      />
    </CityProvider>
  )
}
