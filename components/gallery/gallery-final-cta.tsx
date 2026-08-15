'use client'

import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'

export function GalleryFinalCta() {
  const { openBookingModal } = useBookingModal()

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/40 p-8 text-center ring-1 ring-foreground/10 sm:p-12">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Хотите такой же результат?
      </h2>
      <Button
        className="bg-accent text-accent-foreground hover:bg-accent/90"
        onClick={() => openBookingModal()}
      >
        Записаться на консультацию
      </Button>
    </div>
  )
}
