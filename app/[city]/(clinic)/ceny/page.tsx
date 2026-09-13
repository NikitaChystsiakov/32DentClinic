import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PriceAccordion } from '@/components/pricing/price-accordion'
import { Reveal } from '@/components/reveal'
import { getCityBySlug } from '@/config/cities'
import { siteConfig } from '@/lib/site-config'

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}
  return {
    title: 'Цены',
    description: `Прайс-лист на услуги стоматологии ${city.brandName} в ${city.nameIn} — терапия, хирургия, протезирование и другие направления.`,
  }
}

export default async function PricesPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal delay={0}>
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Цены на услуги {city.brandName}
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Все цены — ориентировочные, точную стоимость врач определит после осмотра.
          </p>
        </div>
      </Reveal>

      <Reveal delay={1}>
        <PriceAccordion />
      </Reveal>

      <Reveal delay={2}>
        {/* Подпись обязательна: без неё «от 90 BYN» на сайте могут прочитать
            как публичную оферту (ст. 407 ГК). Текст — в lib/site-config.ts. */}
        <p className="mt-8 text-sm text-muted-foreground">{siteConfig.priceNotice}</p>
      </Reveal>
    </div>
  )
}
