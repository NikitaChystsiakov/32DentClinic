import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getCityContent } from '@/content'
import { AboutContent } from '@/components/about/about-content'

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

  return {
    title: `О клинике 32Дент — стоматология в ${city.name}`,
    description: content.about.description,
  }
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

  return <AboutContent />
}
