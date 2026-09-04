import type { Metadata } from 'next'
import { serviceCategories } from '@/lib/services-data'
import { ServiceCard } from '@/components/services/service-card'
import { ServicesHeroBanner } from '@/components/services/services-hero-banner'
import { ServicesBottomCta } from '@/components/services/services-bottom-cta'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Услуги и цены',
  description:
    'Полный спектр стоматологической помощи в клинике 32Дент в Рогачёве — от профилактики до сложной имплантации.',
}

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal delay={0}>
        <div className="mb-10">
          <ServicesHeroBanner
            title="Услуги и цены стоматологии 32Дент в Рогачёве"
            description="Полный спектр стоматологической помощи в одной клинике — от профилактики до сложной имплантации. Ниже — основные направления и ориентировочные цены. Точную стоимость лечения врач назовёт после осмотра, консультация бесплатна."
            calculatorHref="/kalkulyator/"
          />
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
