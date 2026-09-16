import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Reveal } from '@/components/reveal'
import { BeforeAfterGallery } from '@/components/gallery/before-after-gallery'
import { GalleryFinalCta } from '@/components/gallery/gallery-final-cta'
import { JsonLd } from '@/components/seo/json-ld'
import { getCityBySlug } from '@/config/cities'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}

  return buildMetadata({
    title: `Примеры работ до и после — стоматология в ${city.nameIn}`,
    description: `Фото до и после лечения, протезирования и имплантации в ${city.brandName} ${city.name}. Опубликованы с согласия пациентов; результат индивидуален и зависит от исходной ситуации.`,
    path: `/${citySlug}/primery-rabot/`,
    city,
  })
}

export default async function GalleryPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: `/${citySlug}/` }, { name: 'Примеры работ' }])} />
      <Reveal delay={0}>
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Примеры работ стоматологии в {city.nameIn}
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Результаты лечения наших врачей, опубликованные с согласия пациентов. Передвиньте ползунок, чтобы
            сравнить «до» и «после». Результат индивидуален и зависит от исходной ситуации.
          </p>
        </div>
      </Reveal>

      <Reveal delay={1}>
        <BeforeAfterGallery />
      </Reveal>

      <Reveal delay={2}>
        <GalleryFinalCta />
      </Reveal>
    </div>
  )
}
