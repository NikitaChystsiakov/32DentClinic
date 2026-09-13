'use client'

import { BookingButton } from '@/components/booking-button'

export function ContactBookingButton() {

  return (
    <BookingButton
      size="lg"
      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-fit cursor-pointer"
    >
      Записаться на приём
    </BookingButton>
  )
}
