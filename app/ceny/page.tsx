import type { Metadata } from 'next'
import { PriceAccordion } from '@/components/pricing/price-accordion'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Цены',
  description: 'Прайс-лист на услуги стоматологии 32Дент в Рогачёве — терапия, хирургия, протезирование и другие направления.',
}

export default function PricesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal delay={0}>
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Цены на услуги 32Дент
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
        <p className="mt-8 text-sm text-muted-foreground">
          Точную стоимость лечения врач озвучит после бесплатной консультации.
        </p>
      </Reveal>
    </div>
  )
}
