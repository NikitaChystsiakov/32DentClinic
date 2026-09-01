'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useCity } from '@/lib/contexts/city-context'
import { getServicesForCity } from '@/config/services'
import { cn } from '@/lib/utils'
import { PhotoPlaceholder } from '@/components/photo-placeholder'

const FEATURED_SLUG = 'protezirovanie'

// У «Имплантации» в данных вместо фото стоит англоязычная медицинская схема —
// не подходит для сайта. Показываем заглушку, пока не заменят на реальное фото.
const SERVICES_NEEDING_REAL_PHOTO = new Set(['implantaciya'])

export function ServicesOverview() {
  const { city } = useCity()
  const services = getServicesForCity(city.slug)

  return (
    <section className="border-y border-silver/25 bg-silver-muted">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary">Направления</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Что мы лечим</h2>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            От планового осмотра до сложного протезирования — семь направлений на одной базе, с общей
            историей лечения у каждого пациента.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const isFeatured = service.slug === FEATURED_SLUG
            const needsPlaceholder = SERVICES_NEEDING_REAL_PHOTO.has(service.slug)
            return (
              <Link
                key={service.slug}
                href={`/${city.slug}/uslugi/${service.slug}/`}
                className={cn('group', isFeatured && 'sm:col-span-2')}
              >
                <div className="flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-silver/25 transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-xl hover:ring-primary/40">
                  <div
                    className={cn(
                      'relative w-full overflow-hidden',
                      isFeatured ? 'aspect-21/9' : 'aspect-4/3'
                    )}
                  >
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
                          sizes={isFeatured ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                          <h3
                            className={cn(
                              'font-heading font-bold text-white drop-shadow-sm',
                              isFeatured ? 'text-2xl' : 'text-lg'
                            )}
                          >
                            {service.shortName}
                          </h3>
                          <span className="shrink-0 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">
                            от {service.priceFrom} р.
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    {needsPlaceholder && (
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-heading text-lg font-bold text-foreground">{service.shortName}</h3>
                        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                          от {service.priceFrom} р.
                        </span>
                      </div>
                    )}
                    <p
                      className={cn(
                        'text-sm text-muted-foreground',
                        isFeatured ? 'line-clamp-2 max-w-xl' : 'line-clamp-2'
                      )}
                    >
                      {service.cardDescription}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform duration-300 group-hover:gap-2">
                      Подробнее
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
