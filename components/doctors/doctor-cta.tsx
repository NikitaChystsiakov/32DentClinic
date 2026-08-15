'use client'

import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'

export function DoctorHeroCta({ slug, name }: { slug: string; name: string }) {
  const { openBookingModal } = useBookingModal()

  return (
    <Button
      size="lg"
      onClick={() => openBookingModal({ doctor: slug })}
      className="w-fit bg-accent text-accent-foreground hover:bg-accent/90"
    >
      <Calendar data-icon="inline-start" />
      Записаться к врачу {name}
    </Button>
  )
}

export function DoctorFinalCta({ slug }: { slug: string }) {
  const { openBookingModal } = useBookingModal()

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/40 p-8 text-center ring-1 ring-foreground/10 sm:p-12">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => openBookingModal({ doctor: slug })}
        >
          Записаться к этому врачу
        </Button>
        <Button variant="outline" render={<Link href="/vrachi/" />} nativeButton={false}>
          Посмотреть всех врачей
        </Button>
      </div>
    </div>
  )
}
