import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LegalDocumentPage } from '@/components/legal/legal-document'
import { getCityBySlug, VALID_CITY_SLUGS } from '@/config/cities'
import { getLegalDocument, legalDocuments } from '@/config/legal'
import { absoluteUrl } from '@/lib/seo'

// Юридические документы клиники города: /minsk/dokumenty/<slug>/.
// Список документов и их файлы — в config/legal.ts.

export function generateStaticParams() {
  return VALID_CITY_SLUGS.flatMap((city) => legalDocuments.map((d) => ({ city, slug: d.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}): Promise<Metadata> {
  const { city, slug } = await params
  const doc = getLegalDocument(slug)
  if (!doc) return {}
  // Свой canonical, иначе наследуется canonical главной города из layout;
  // noindex — документы в выдаче не нужны, но ссылки с них пусть учитываются.
  return {
    title: doc.title,
    robots: { index: false, follow: true },
    alternates: { canonical: absoluteUrl(`/${city}/dokumenty/${slug}/`) },
  }
}

export default async function CityLegalDocumentPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city: citySlug, slug } = await params
  const city = getCityBySlug(citySlug)
  const doc = getLegalDocument(slug)
  if (!city || !doc) notFound()

  return <LegalDocumentPage doc={doc} city={city} />
}
