import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getCityContent } from '@/content'
import { ContactsPageContent } from '@/components/contact/contacts-page-content'
import { buildMetadata, cityStreet, truncateDescription } from '@/lib/seo'
import { formatCityHoursShort } from '@/lib/format-hours'

// Серверная обёртка ради generateMetadata (см. uslugi/page.tsx). Разметка —
// в components/contact/contacts-page-content.tsx.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  const content = getCityContent(citySlug)
  if (!city || !content) return {}

  // Часы — коротко («Пн–Пт 8:00–20:00») и только если подтверждены.
  const hours = formatCityHoursShort(content.contacts.hours)

  return buildMetadata({
    title: `Контакты и адрес стоматологии в ${city.nameIn}`,
    description: truncateDescription(
      `Стоматология ${city.brandName} в ${city.nameIn}: ${cityStreet(city)}, ${city.phone}${hours ? `, ${hours}` : ''}. Карта проезда, Viber и Telegram, запись на приём онлайн.`,
      165
    ),
    path: `/${citySlug}/kontakty/`,
    city,
  })
}

export default async function ContactsPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  if (!getCityBySlug(citySlug)) notFound()
  return <ContactsPageContent />
}
