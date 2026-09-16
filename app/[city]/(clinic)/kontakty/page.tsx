import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getCityContent } from '@/content'
import { ContactsPageContent } from '@/components/contact/contacts-page-content'
import { buildMetadata, truncateDescription } from '@/lib/seo'

// Серверная обёртка ради generateMetadata (см. uslugi/page.tsx). Разметка —
// в components/contact/contacts-page-content.tsx.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  const content = getCityContent(citySlug)
  if (!city || !content) return {}

  // Часы — только если заполнены: у Жлобина пока «[TODO: …]», такое в
  // description выводить нельзя.
  const hours = content.contacts.hours
    .filter((h) => !h.time.includes('TODO'))
    .map((h) => `${h.days} ${h.time}`)
    .join(', ')

  return buildMetadata({
    title: `Контакты и адрес стоматологии в ${city.nameIn}`,
    description: truncateDescription(
      `${city.brandName} в ${city.nameIn}: ${city.address}, ${city.phone}${hours ? `. ${hours}` : ''}. Карта проезда, Viber и Telegram, запись на приём онлайн.`,
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
