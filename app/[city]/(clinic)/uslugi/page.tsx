import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getServicesForCity } from '@/config/services'
import { ServicesPageContent } from '@/components/services/services-page-content'
import { buildMetadata } from '@/lib/seo'

// Страница серверная ради generateMetadata: раньше она была 'use client'
// без метаданных и наследовала title главной города — в выдаче четыре
// страницы города назывались одинаково. Разметка — в
// components/services/services-page-content.tsx.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}

  // Список — словами из запросов, а не shortName подряд: тот давал
  // «проф.гигиена и отбеливание, 3d…» и обрезался посреди слова.
  const hasOrthodontics = getServicesForCity(citySlug).some((s) => s.slug === 'ortodontiya')

  return buildMetadata({
    title: `Услуги стоматологии и цены в ${city.nameIn}`,
    description: `Услуги и цены ${city.brandName} в ${city.nameIn}: имплантация, лечение зубов, протезирование, хирургия${hasOrthodontics ? ', ортодонтия' : ''}, гигиена и 3D-диагностика. Точная цена — после осмотра.`,
    path: `/${citySlug}/uslugi/`,
    city,
  })
}

export default async function ServicesPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  if (!getCityBySlug(citySlug)) notFound()
  return <ServicesPageContent />
}
