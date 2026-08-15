'use client'

import Image from 'next/image'
import { Star, ShieldCheck, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import { siteConfig } from '@/lib/site-config'

export function HeroSection() {
  const { openBookingModal } = useBookingModal()

  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center md:py-20 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="size-4 fill-accent text-accent" />
            <span>
              {siteConfig.rating} · {siteConfig.reviewsCount} отзывов на {siteConfig.reviewsSource}
            </span>
          </div>
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Стоматология Dent32 в {siteConfig.city}
          </h1>
          <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            Лечение, протезирование и имплантация зубов у {siteConfig.doctorsCount} врачей с собственной
            зуботехнической лабораторией. Работаем по полису «{siteConfig.insurancePartner}» и без записи по
            острой боли.
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
            <Button size="lg" variant="outline" render={<a href="/ceny/" />} nativeButton={false}>
              Смотреть цены
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            <span>{siteConfig.disclaimer}</span>
          </div>
        </div>
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl ring-1 ring-foreground/10">
          <Image
            src="/images/hero-clinic.png"
            alt="Приём пациента в клинике Dent32"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
