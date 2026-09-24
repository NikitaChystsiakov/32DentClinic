import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'

import { Reveal } from '@/components/reveal'
import { BeforeAfterGallery } from '@/components/gallery/before-after-gallery'
import { GalleryFinalCta } from '@/components/gallery/gallery-final-cta'
import { JsonLd } from '@/components/seo/json-ld'
import { getCityBySlug } from '@/config/cities'
import { hasRealCasesForCity } from '@/lib/data/before-after'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}

  return buildMetadata({
    title: `Примеры работ до и после — стоматология в ${city.nameIn}`,
    description: `Примеры работ врачей стоматологии ${city.brandName} в ${city.nameIn}: реставрация, коронки, протезирование, имплантация. Фото до и после с ползунком сравнения; план лечения определяет врач после осмотра.`,
    path: `/${citySlug}/primery-rabot/`,
    city,
  })
}

export default async function GalleryPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()
  const real = hasRealCasesForCity(citySlug)

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: `/${citySlug}/` }, { name: 'Примеры работ' }])} />
      <Reveal delay={0}>
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Примеры работ стоматологии в {city.nameIn}
          </h1>
          {/* «Работы клиники» — только когда у города есть реальные работы
              (cases в lib/data/before-after.ts): иллюстрации не фото пациентов. */}
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {real
              ? `Работы клиники ${city.brandName} в ${city.nameIn}. Передвиньте ползунок, чтобы сравнить «до» и «после».`
              : 'Виды работ, которые выполняет клиника: реставрация, протезирование, имплантация, гигиена. Передвиньте ползунок, чтобы сравнить «до» и «после».'}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-secondary" />
            Показанные работы не гарантируют аналогичного результата: план лечения и его итог зависят от исходной
            ситуации и определяются врачом после осмотра. {siteConfig.disclaimer}
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
