'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'

export function ServiceFinalCta({ slug }: { slug: string }) {
  const { openBookingModal } = useBookingModal()

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-muted/40 p-8 text-center ring-1 ring-foreground/10 sm:p-12">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Остались вопросы?</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => openBookingModal({ service: slug })}
        >
          Записаться на консультацию
        </Button>
        <Button variant="outline" render={<Link href="/uslugi/" />} nativeButton={false}>
          Смотреть все услуги
        </Button>
      </div>
    </div>
  )
}
