import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LegalDocumentPage } from '@/components/legal/legal-document'
import { getLegalDocument, legalDocuments } from '@/config/legal'

// Версия документа для страниц сети без города (главная, блог):
// /dokumenty/<slug>/. Показывает общий файл `all`, а если документы разные
// по городам — ссылки на городские версии.

export function generateStaticParams() {
  return legalDocuments.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = getLegalDocument(slug)
  if (!doc) return {}
  return { title: doc.title, robots: { index: false, follow: true } }
}

export default async function LegalDocumentRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getLegalDocument(slug)
  if (!doc) notFound()

  return <LegalDocumentPage doc={doc} />
}
