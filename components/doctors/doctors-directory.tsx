'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { BookingButton } from '@/components/booking-button'
import { useCity } from '@/lib/contexts/city-context'
import { getDoctorsForCity, doctorCategoryLabels, type DoctorCategory, type Doctor } from '@/config/doctors'

const FILTERS: { id: 'all' | DoctorCategory; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'terapevt', label: doctorCategoryLabels.terapevt },
  { id: 'ortoped', label: doctorCategoryLabels.ortoped },
  { id: 'hirurg', label: doctorCategoryLabels.hirurg },
  { id: 'ortodont', label: doctorCategoryLabels.ortodont },
]

function DoctorCard({ doctor, citySlug }: { doctor: Doctor; citySlug: string }) {

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl ring-1 ring-silver/25 transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-xl hover:ring-primary/40">
      <Link href={`/${citySlug}/vrachi/${doctor.slug}/`} className="relative aspect-square overflow-hidden">
        <Image
          src={doctor.photo}
          alt={doctor.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="eager"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 bg-card p-4">
        <Link href={`/${citySlug}/vrachi/${doctor.slug}/`}>
          <h3 className="font-heading text-base font-semibold text-foreground hover:text-primary">
            {doctor.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
        {doctor.experienceYears !== undefined && (
          <Badge variant="secondary" className="w-fit">
            Стаж {doctor.experienceYears} лет
          </Badge>
        )}
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            render={<Link href={`/${citySlug}/vrachi/${doctor.slug}/`} />}
            nativeButton={false}
          >
            Подробнее
          </Button>
          <BookingButton
            size="sm"
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            options={{ doctor: doctor.slug }}
          >
            Записаться
          </BookingButton>
        </div>
      </div>
    </div>
  )
}

export function DoctorsDirectory() {
  const { city } = useCity()
  const [filter, setFilter] = React.useState<'all' | DoctorCategory>('all')

  const cityDoctors = getDoctorsForCity(city.slug)
  // Вкладки — только по профилям, которые есть в городе: ортодонт один и
  // только в Минске, и в Рогачёве вкладка «Ортодонты» открывала бы пустой
  // список с подписью «врачи пока не добавлены».
  const filters = FILTERS.filter((f) => {
    const id = f.id
    return id === 'all' || cityDoctors.some((doctor) => doctor.categories.includes(id))
  })
  const filteredDoctors = cityDoctors.filter(
    (doctor) => filter === 'all' || doctor.categories.includes(filter)
  )

  return (
    <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | DoctorCategory)}>
      <Reveal delay={0}>
        <TabsList>
          {filters.map((f) => (
            <TabsTrigger key={f.id} value={f.id}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Reveal>
      <TabsContent value={filter} className="mt-8">
        <Reveal delay={1}>
          {filteredDoctors.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">
              Врачи в этом городе пока не добавлены. Попробуйте позже.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.slug} doctor={doctor} citySlug={city.slug} />
              ))}
            </div>
          )}
        </Reveal>
      </TabsContent>
    </Tabs>
  )
}
