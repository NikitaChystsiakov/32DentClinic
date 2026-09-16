import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getServicesForCity } from '@/config/services'
import { ServicesPageContent } from '@/components/services/services-page-content'
import { buildMetadata, truncateDescription } from '@/lib/seo'

// Страница серверная ради generateMetadata: раньше она была 'use client'
// без метаданных и наследовала title главной города — в выдаче четыре
// страницы города назывались одинаково. Разметка — в
// components/services/services-page-content.tsx.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}

  const names = getServicesForCity(citySlug)
    .map((s) => s.shortName.toLowerCase())
    .join(', ')

  return buildMetadata({
    title: `Услуги стоматологии и цены в ${city.nameIn}`,
    description: truncateDescription(
      `Направления стоматологии ${city.brandName} в ${city.nameIn} с ценами «от»: ${names}. Точную стоимость врач называет после осмотра.`,
      165
    ),
    path: `/${citySlug}/uslugi/`,
    city,
  })
}

export default async function ServicesPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  if (!getCityBySlug(citySlug)) notFound()
  return <ServicesPageContent />
}
