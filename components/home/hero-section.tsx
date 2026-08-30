'use client'

import Image from 'next/image'
import { Star, ShieldCheck, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import { useCity } from '@/lib/contexts/city-context'
import { getDoctorsForCity } from '@/config/doctors'

export function HeroSection() {
  const { openBookingModal } = useBookingModal()
  const { city, content } = useCity()
  const doctorsCount = getDoctorsForCity(city.slug).length

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/clinic/reception.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/45" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Диагональный переход в следующую секцию вместо прямой границы */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-br from-muted/20 via-muted/70 to-muted [clip-path:polygon(0_100%,100%_45%,100%_100%)] sm:h-24"
      />

      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center gap-6 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-background/70 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-foreground/10 backdrop-blur">
            <Star className="size-4 fill-accent text-accent" />
            <span>
              {content.aggregators.reviewsCount} отзывов на {content.aggregators.source}
            </span>
          </div>
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {content.hero.title}
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {content.hero.subtitle}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => openBookingModal()}
              className="shine-hover bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Calendar data-icon="inline-start" />
              Записаться на приём
            </Button>
            <Button size="lg" variant="outline" render={<a href={`/${city.slug}/ceny/`} />} nativeButton={false}>
              Смотреть цены
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            <span>Есть противопоказания, необходима консультация специалиста.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
