'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhotoPlaceholder } from '@/components/photo-placeholder'
import { useBookingModal } from '@/components/booking-modal-provider'
import type { ServiceCategory } from '@/lib/services-data'

// У «Имплантации» в данных вместо фото стоит англоязычная медицинская схема —
// не подходит для сайта. Показываем заглушку, пока не заменят на реальное фото.
const SERVICES_NEEDING_REAL_PHOTO = new Set(['implantaciya'])

export function ServiceCard({ service }: { service: ServiceCategory }) {
  const { openBookingModal } = useBookingModal()
  const needsPlaceholder = SERVICES_NEEDING_REAL_PHOTO.has(service.slug)

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-silver/25 transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-xl hover:ring-primary/40">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        {needsPlaceholder ? (
          <PhotoPlaceholder
            label={`Фото приёма или оборудования для услуги «${service.shortName}»`}
            width={1200}
            height={900}
            className="h-full rounded-none border-0"
          />
        ) : (
          <>
            <Image
              src={service.image}
              alt={service.shortName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent" />
            <h3 className="absolute inset-x-0 bottom-0 p-4 font-heading text-lg font-bold text-white drop-shadow-sm">
              {service.shortName}
            </h3>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {needsPlaceholder && (
          <h3 className="font-heading text-lg font-bold text-foreground">{service.shortName}</h3>
        )}
        <p className="line-clamp-2 text-sm text-muted-foreground">{service.cardDescription}</p>
        <span className="font-medium text-foreground">от {service.priceFrom} BYN</span>
        <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row">
          <Button
            variant="silver"
            className="flex-1"
            render={<Link href={`/uslugi/${service.slug}/`} />}
            nativeButton={false}
          >
            Подробнее
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => openBookingModal({ service: service.slug })}
          >
            Записаться
          </Button>
        </div>
      </div>
    </div>
  )
}
