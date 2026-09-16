import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PriceAccordion } from '@/components/pricing/price-accordion'
import { Reveal } from '@/components/reveal'
import { getCityBySlug } from '@/config/cities'
import { getServiceBySlug } from '@/config/services'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}

  // Цены в description берём из прайса, чтобы они не разошлись с тем, что
  // на странице. Когда прайс станет по городам — обновятся сами.
  const price = (slug: string) => getServiceBySlug(slug)?.priceFrom
  const parts = [
    ['лечение кариеса', price('terapevticheskaya-stomatologiya')],
    ['удаление зуба', price('khirurgiya')],
    ['коронка', price('protezirovanie')],
    ['имплант', price('implantaciya')],
  ]
    .filter(([, v]) => typeof v === 'number')
    .map(([name, v]) => `${name} от ${v} р.`)
    .join(', ')

  return buildMetadata({
    title: `Цены на лечение зубов в ${city.nameIn}`,
    description: `Прайс стоматологии ${city.brandName} в ${city.nameIn}: ${parts}. Цены «от», точный расчёт после осмотра.`,
    path: `/${citySlug}/ceny/`,
    city,
  })
}

export default async function PricesPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: `/${citySlug}/` }, { name: 'Цены' }])} />
      <Reveal delay={0}>
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Цены на услуги {city.brandName} в {city.nameIn}
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
