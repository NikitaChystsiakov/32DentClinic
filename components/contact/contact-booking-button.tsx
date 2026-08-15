'use client'

import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'

export function ContactBookingButton() {
  const { openBookingModal } = useBookingModal()

  return (
    <Button
      size="lg"
      onClick={() => openBookingModal()}
      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-fit"
    >
      Записаться на приём
    </Button>
  )
}
