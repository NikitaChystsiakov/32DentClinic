import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LicenseDocuments } from '@/components/about/license-documents'
import { JsonLd } from '@/components/seo/json-ld'
import { getCityBySlug } from '@/config/cities'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}
  return buildMetadata({
    title: 'Документы и лицензии',
    description: `Лицензия на медицинскую деятельность № ${city.legal.license.number}, реквизиты и сканы документов стоматологии ${city.brandName} в ${city.nameIn}.`,
    path: `/${citySlug}/o-nas/dokumenty-i-licenzii/`,
    city,
  })
}

export default async function DocumentsPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Главная', path: `/${citySlug}/` },
          { name: 'О клинике', path: `/${citySlug}/o-nas/` },
          { name: 'Документы и лицензии' },
        ])}
      />
      <LicenseDocuments city={city} />
    </>
  )
}
