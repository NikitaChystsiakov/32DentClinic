'use client'

import { MapPin, Clock, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import { useCity } from '@/lib/contexts/city-context'

export function ContactCtaSection() {
  const { openBookingModal } = useBookingModal()
  const { city } = useCity()

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-2xl bg-muted/40 p-8 ring-1 ring-foreground/10 md:grid-cols-2 md:p-12">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Приходите на консультацию
          </h2>
          <p className="text-pretty text-muted-foreground">
            Расскажем, что можно сделать с вашей ситуацией, и составим план лечения без обязательств.
          </p>
          <div className="flex flex-col gap-3 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span>{city.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <span>Пн–Сб 8:00–19:00</span>
            </div>
            <a href={city.phoneHref} className="flex items-center gap-2 hover:text-primary">
              <Phone className="size-4 text-primary" />
              <span>{city.phone}</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <Button
            size="lg"
            onClick={() => openBookingModal()}
            className="shine-hover bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Записаться онлайн
          </Button>
          <Button size="lg" variant="outline" render={<a href={`/${city.slug}/kontakty/`} />} nativeButton={false}>
            Как нас найти
          </Button>
        </div>
      </div>
    </section>
  )
}
