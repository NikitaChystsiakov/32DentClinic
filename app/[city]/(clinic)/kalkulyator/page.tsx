import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { CalculatorPageContent } from '@/components/calculator-page-content'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

// Серверная обёртка ради generateMetadata (см. uslugi/page.tsx). Разметка —
// в components/calculator-page-content.tsx.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}

  return buildMetadata({
    title: `Калькулятор стоимости лечения зубов в ${city.nameIn}`,
    description: `Ответьте на несколько вопросов и получите ориентировочный план и стоимость лечения в ${city.brandName} ${city.name}. Точную сумму врач назовёт после осмотра.`,
    path: `/${citySlug}/kalkulyator/`,
    city,
  })
}

export default async function CalculatorPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  if (!getCityBySlug(citySlug)) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Главная', path: `/${citySlug}/` },
          { name: 'Калькулятор' },
        ])}
      />
      <CalculatorPageContent />
    </>
  )
}
