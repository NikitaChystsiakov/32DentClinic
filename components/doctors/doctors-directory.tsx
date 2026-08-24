'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { useBookingModal } from '@/components/booking-modal-provider'
import { doctors, doctorCategoryLabels, type DoctorCategory } from '@/lib/doctors-data'

const FILTERS: { id: 'all' | DoctorCategory; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'terapevt', label: doctorCategoryLabels.terapevt },
  { id: 'ortoped', label: doctorCategoryLabels.ortoped },
  { id: 'hirurg', label: doctorCategoryLabels.hirurg },
]

function DoctorCard({ doctor }: { doctor: (typeof doctors)[number] }) {
  const { openBookingModal } = useBookingModal()

  return (
    <div className="flex flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Link href={`/vrachi/${doctor.slug}/`} className="group relative aspect-square overflow-hidden">
        <Image
          src={doctor.photo}
          alt={doctor.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="eager"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 bg-card p-4">
        <Link href={`/vrachi/${doctor.slug}/`}>
          <h3 className="font-heading text-base font-semibold text-foreground hover:text-primary">
            {doctor.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
        <Badge variant="secondary" className="w-fit">
          Стаж {doctor.experienceYears} лет
        </Badge>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            render={<Link href={`/vrachi/${doctor.slug}/`} />}
            nativeButton={false}
          >
            Подробнее
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => openBookingModal({ doctor: doctor.slug })}
          >
            Записаться
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DoctorsDirectory() {
  const [filter, setFilter] = React.useState<'all' | DoctorCategory>('all')

  const filteredDoctors = doctors.filter(
    (doctor) => filter === 'all' || doctor.categories.includes(filter)
  )

  return (
    <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | DoctorCategory)}>
      <Reveal delay={0}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.id} value={f.id}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Reveal>
      <TabsContent value={filter} className="mt-8">
        <Reveal delay={1}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.slug} doctor={doctor} />
            ))}
          </div>
        </Reveal>
      </TabsContent>
    </Tabs>
  )
}
