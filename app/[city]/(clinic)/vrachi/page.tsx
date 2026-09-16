import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getRealDoctorsForCity } from '@/config/doctors'
import { DoctorsPageContent } from '@/components/doctors/doctors-page-content'
import { buildMetadata } from '@/lib/seo'

// Серверная обёртка ради generateMetadata (см. uslugi/page.tsx). Разметка —
// в components/doctors/doctors-page-content.tsx.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}

  // В счётчик идут только реальные врачи — заглушки (isPlaceholder) в
  // description обещать нельзя.
  const count = getRealDoctorsForCity(citySlug).length
  const countText = count > 0 ? `${count} ${pluralize(count)} ` : 'Врачи '

  return buildMetadata({
    title: `Врачи-стоматологи в ${city.nameIn}`,
    description: `${countText}стоматологии ${city.brandName} в ${city.nameIn}: терапевты, ортопеды, хирург-имплантолог. Специализация, стаж и запись к конкретному врачу онлайн.`,
    path: `/${citySlug}/vrachi/`,
    city,
  })
}

function pluralize(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'врач'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'врача'
  return 'врачей'
}

export default async function DoctorsPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  if (!getCityBySlug(citySlug)) notFound()
  return <DoctorsPageContent />
}
