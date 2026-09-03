'use client'

import Image from 'next/image'
import { Star, ShieldCheck, Calendar, Users2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import { useCity } from '@/lib/contexts/city-context'
import { getDoctorsForCity } from '@/config/doctors'
import { aggregatorRatings } from '@/lib/data/aggregators'

function pluralizeDoctors(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'врач'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'врача'
  return 'врачей'
}

export function HeroSection() {
  const { openBookingModal } = useBookingModal()
  const { city, content } = useCity()
  const doctorsCount = getDoctorsForCity(city.slug).length
  const mainRating = aggregatorRatings.find((a) => a.id === '103by')

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <Image
          src="/clinic/reception.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/45" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="relative mx-auto flex min-h-160 max-w-6xl flex-col justify-center gap-8 px-4 py-16 sm:px-6 md:py-20 lg:min-h-180 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-6">
          {mainRating && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-background/70 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-silver/25 backdrop-blur">
              <Star className="size-4 fill-accent text-accent" />
              <span>
                {mainRating.reviewsCount} отзывов на {mainRating.name}
              </span>
            </div>
          )}
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
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Calendar data-icon="inline-start" />
              Записаться на приём
            </Button>
            <Button size="lg" variant="silver" render={<a href={`/${city.slug}/ceny/`} />} nativeButton={false}>
              Смотреть цены
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            <span>Есть противопоказания, необходима консультация специалиста.</span>
          </div>
        </div>

        <div className="flex max-w-2xl flex-wrap items-center gap-x-8 gap-y-4 border-t border-silver/25 pt-6">
          {mainRating && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-heading text-2xl font-bold text-foreground">
                <Star className="size-5 fill-accent text-accent" />
                {mainRating.rating}
              </span>
              <span className="max-w-28 text-xs leading-tight text-muted-foreground">
                рейтинг на {mainRating.name} · {mainRating.reviewsCount} отзывов
              </span>
            </div>
          )}
          <div className="h-9 w-px bg-silver/30" />
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-heading text-2xl font-bold text-foreground">
              <Users2 className="size-5 text-secondary" />
              {doctorsCount}
            </span>
            <span className="max-w-28 text-xs leading-tight text-muted-foreground">
              {pluralizeDoctors(doctorsCount)} принимают пациентов в клинике
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}