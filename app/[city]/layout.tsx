import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
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

  const content = getCityContent(citySlug)
  if (!content) return {}

  return {
    title: {
      default: content.metaTitle,
      template: `%s | 32Дент, ${city.name}`,
    },
    description: content.metaDescription,
    alternates: {
      canonical: `https://32dent-beta.vercel.app/${citySlug}`,
    },
  }
}

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
    </CityProvider>
  )
}
