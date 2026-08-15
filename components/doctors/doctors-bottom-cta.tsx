'use client'

import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'

export function DoctorsBottomCta() {
  const { openBookingModal } = useBookingModal()

  return (
    <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-muted/40 p-8 text-center ring-1 ring-foreground/10 sm:p-12">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Не знаете, к какому врачу записаться?
      </h2>
      <Button
        className="bg-accent text-accent-foreground hover:bg-accent/90"
        onClick={() => openBookingModal()}
      >
        Оставить заявку — подберём специалиста
      </Button>
    </div>
  )
}
