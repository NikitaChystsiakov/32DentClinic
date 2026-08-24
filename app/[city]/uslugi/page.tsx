'use client'

import { useCity } from '@/lib/contexts/city-context'
import { getServicesForCity } from '@/config/services'
import { ServiceCard } from '@/components/services/service-card'
import { ServicesBottomCta } from '@/components/services/services-bottom-cta'
import { Reveal } from '@/components/reveal'

export default function ServicesPage() {
  const { city, content } = useCity()
  const services = getServicesForCity(city.slug)

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal delay={0}>
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {content.services.title}
          </h1>
          <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {content.services.description}
          </p>
        </div>
      </Reveal>

      <Reveal delay={1}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
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
