'use client'

import { BookingButton } from '@/components/booking-button'

export function GalleryFinalCta() {

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-silver-muted p-8 text-center ring-1 ring-silver/25 sm:p-12">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Хотите такой же результат?
      </h2>
      <BookingButton className="bg-accent text-accent-foreground hover:bg-accent/90">
        Записаться на консультацию
      </BookingButton>
    </div>
  )
}
