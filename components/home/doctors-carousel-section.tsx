'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { useCity } from '@/lib/contexts/city-context'
import { getDoctorsForCity } from '@/config/doctors'

export function DoctorsCarouselSection() {
  const { city } = useCity()
  const doctors = getDoctorsForCity(city.slug)

  return (
    <>
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-(--panel-eyebrow)">Команда</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">Наши врачи</h2>
        </div>
        <Button
          variant="silver"
          className="w-fit"
          render={<Link href={`/${city.slug}/vrachi/`} />}
          nativeButton={false}
        >
          Все врачи
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
      <Carousel opts={{ align: 'start' }} className="px-1">
        <CarouselContent>
          {doctors.map((doctor) => (
            <CarouselItem key={doctor.slug} className="basis-4/5 sm:basis-1/2 lg:basis-1/3">
              <Link
                href={`/${city.slug}/vrachi/${doctor.slug}/`}
                className="group flex h-full flex-col overflow-hidden rounded-xl ring-1 ring-silver/25 transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-xl hover:ring-primary/40"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={doctor.photo}
                    alt={doctor.name}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                    loading="eager"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 bg-card p-4">
                  <h3 className="font-heading text-base font-semibold text-foreground">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  <p className="mt-1 text-sm font-medium text-primary">Стаж {doctor.experienceYears} лет</p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Стрелки только с sm: они вынесены на 48px наружу карусели
            (-left-12/-right-12) и на телефоне вылезали за край экрана, давая
            горизонтальную прокрутку. Листается свайпом. */}
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </>
  )
}
