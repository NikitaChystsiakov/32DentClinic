'use client'

import { Calendar } from 'lucide-react'
import { BookingButton } from '@/components/booking-button'

export function ServiceHeroCta({ slug }: { slug: string }) {

  return (
    <BookingButton
      size="lg"
      options={{ service: slug }}
      className="w-fit bg-accent text-accent-foreground hover:bg-accent/90"
    >
      <Calendar data-icon="inline-start" />
      Записаться
    </BookingButton>
  )
}
