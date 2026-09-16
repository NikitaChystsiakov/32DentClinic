'use client'

import { BookingButton } from '@/components/booking-button'

export function GalleryFinalCta() {

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-silver-muted p-8 text-center ring-1 ring-silver/25 sm:p-12">
      {/* Не «хотите такой же результат?» — это обещание эффекта, запрещённое
          ст. 15 Закона «О рекламе». Зовём обсудить свой случай с врачом. */}
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Обсудите свой случай с врачом
      </h2>
      <p className="max-w-lg text-pretty text-muted-foreground">
        Какая работа подойдёт именно вам и сколько она будет стоить, врач скажет после осмотра и снимка.
      </p>
      <BookingButton className="bg-accent text-accent-foreground hover:bg-accent/90">
        Записаться на консультацию
      </BookingButton>
    </div>
  )
}
