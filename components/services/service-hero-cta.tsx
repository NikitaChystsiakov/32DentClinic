'use client'

import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'

export function ServiceHeroCta({ slug }: { slug: string }) {
  const { openBookingModal } = useBookingModal()

  return (
    <Button
      size="lg"
      onClick={() => openBookingModal({ service: slug })}
      className="w-fit bg-accent text-accent-foreground hover:bg-accent/90"
    >
      <Calendar data-icon="inline-start" />
      Записаться
    </Button>
  )
}
