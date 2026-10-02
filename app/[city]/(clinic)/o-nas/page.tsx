import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getCityContent } from '@/content'
import { AboutContent } from '@/components/about/about-content'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd, buildMetadata, truncateDescription } from '@/lib/seo'

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

  return buildMetadata({
    // Бренд допишет шаблон («| 32Дент»), здесь его не повторяем.
    title: `О клинике — стоматология в ${city.nameIn}`,
    description: content.about.metaDescription ?? truncateDescription(content.about.description),
    path: `/${citySlug}/o-nas/`,
    city,
  })
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  const content = getCityContent(citySlug)
  if (!content) notFound()

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: `/${citySlug}/` }, { name: 'О клинике' }])} />
      <AboutContent />
    </>
  )
}
