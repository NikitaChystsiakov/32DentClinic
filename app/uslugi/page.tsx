import type { Metadata } from 'next'
import { serviceCategories } from '@/lib/services-data'
import { ServiceCard } from '@/components/services/service-card'
import { ServicesBottomCta } from '@/components/services/services-bottom-cta'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Услуги и цены',
  description:
    'Полный спектр стоматологической помощи в клинике Dent32 в Рогачёве — от профилактики до сложной имплантации.',
}

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal delay={0}>
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Услуги и цены стоматологии Dent32 в Рогачёве
          </h1>
          <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Полный спектр стоматологической помощи в одной клинике — от профилактики до сложной имплантации.
            Ниже — основные направления и ориентировочные цены. Точную стоимость лечения врач назовёт после
            осмотра, консультация бесплатна.
          </p>
        </div>
      </Reveal>

      <Reveal delay={1}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Reveal>

      <Reveal delay={2}>
        <ServicesBottomCta />
      </Reveal>
    </div>
  )
}
