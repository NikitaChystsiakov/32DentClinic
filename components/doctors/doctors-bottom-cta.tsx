'use client'

import { BookingButton } from '@/components/booking-button'

export function DoctorsBottomCta() {

  return (
    <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-muted/40 p-8 text-center ring-1 ring-foreground/10 sm:p-12">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Не знаете, к какому врачу записаться?
      </h2>
      <BookingButton className="bg-accent text-accent-foreground hover:bg-accent/90">
        Оставить заявку — подберём специалиста
      </BookingButton>
    </div>
  )
}
