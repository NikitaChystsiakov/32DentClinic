'use client'

import Image from 'next/image'
import { Calendar, Car, ShieldCheck, Route, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import type { NearbyTown } from '@/config/nearby-towns'
import type { TownContent } from '@/content/towns'
import { formatTravelTime, getTownClinics } from '@/lib/town-clinics'

/*
 * Первый экран страницы «соседнего» города. Собран по образцу HeroSection
 * (фото клиники на фоне, тот же ритм заголовка и кнопок), но вместо рейтинга
 * и числа врачей внизу — клиники сети с расстоянием и временем в пути:
 * человек из другого города первым делом хочет понять, куда и сколько ехать.
 */
export function TownHero({ town, content }: { town: NearbyTown; content: TownContent }) {
  const clinics = getTownClinics(town)

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Фон — интерьер ресепшена сети (снят в Рогачёве), декоративный: под
          градиентом он читается как «клиника 32Дент», а не как конкретный
          адрес. Появится фото жлобинской клиники — заменить здесь. */}
      <div className="absolute inset-0">
        <Image src="/clinic/reception.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/45" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-var(--header-h))] max-w-6xl flex-col justify-center gap-8 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-background/70 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-silver/25 backdrop-blur">
            <Route className="size-4 text-secondary" />
            <span>
              {content.hero.eyebrow} · {town.region}
            </span>
          </div>
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {content.hero.title}
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {content.hero.subtitle}
          </p>
          <ul className="flex flex-col gap-2 text-sm text-foreground">
            {content.hero.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-secondary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <BookingButton size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Calendar data-icon="inline-start" />
              Записаться на приём
            </BookingButton>
            <Button size="lg" variant="outline" render={<a href="#route" />} nativeButton={false}>
              <Car data-icon="inline-start" />
              Как добраться
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            <span>Есть противопоказания, необходима консультация специалиста.</span>
          </div>
        </div>

        {/* Клиники сети от ближней к дальней: город, километры, время. */}
        <div className="flex max-w-2xl flex-wrap items-center gap-x-8 gap-y-4 border-t border-silver/25 pt-6">
          {clinics.map((clinic, index) => (
            <div key={clinic.slug} className="contents">
              {index > 0 && <div className="hidden h-9 w-px bg-silver/30 sm:block" />}
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl font-bold text-foreground">{clinic.distanceKm} км</span>
                <span className="max-w-36 text-xs leading-tight text-muted-foreground">
                  до клиники в {clinic.city.nameIn} · ~{formatTravelTime(clinic.travelMinutes)} на машине
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
