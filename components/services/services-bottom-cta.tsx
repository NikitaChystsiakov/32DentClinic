'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'

export function ServicesBottomCta() {
  const { openBookingModal } = useBookingModal()

  return (
    <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-muted/40 p-8 text-center ring-1 ring-foreground/10 sm:p-12">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Не уверены, что нужно?</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" render={<Link href="/kalkulyator/" />} nativeButton={false}>
          Пройти короткий тест
        </Button>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => openBookingModal()}
        >
          Записаться на бесплатную консультацию
        </Button>
      </div>
    </div>
  )
}
