'use client'

import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'

export function DoctorHeroCta({ slug, name }: { slug: string; name: string }) {

  return (
    <BookingButton
      size="lg"
      options={{ doctor: slug }}
      className="w-fit bg-accent text-accent-foreground hover:bg-accent/90"
    >
      <Calendar data-icon="inline-start" />
      Записаться к врачу {name}
    </BookingButton>
  )
}

export function DoctorFinalCta({ slug }: { slug: string }) {

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-silver-muted p-8 text-center ring-1 ring-silver/25 sm:p-12">
      <div className="flex flex-col gap-3 sm:flex-row">
        <BookingButton
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          options={{ doctor: slug }}
        >
          Записаться к этому врачу
        </BookingButton>
        <Button variant="outline" render={<Link href="/vrachi/" />} nativeButton={false}>
          Посмотреть всех врачей
        </Button>
      </div>
    </div>
  )
}
