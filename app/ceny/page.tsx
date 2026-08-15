import type { Metadata } from 'next'
import { PriceAccordion } from '@/components/pricing/price-accordion'

export const metadata: Metadata = {
  title: 'Цены',
  description: 'Прайс-лист на услуги стоматологии Dent32 в Рогачёве — терапия, хирургия, протезирование и другие направления.',
}

export default function PricesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4">
        <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Цены на услуги Dent32
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Все цены — ориентировочные, точную стоимость врач определит после осмотра.
        </p>
      </div>

      <PriceAccordion />

      <p className="mt-8 text-sm text-muted-foreground">
        Точную стоимость лечения врач озвучит после бесплатной консультации.
      </p>
    </div>
  )
}
