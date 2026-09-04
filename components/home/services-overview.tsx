'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useCity } from '@/lib/contexts/city-context'
import { getServicesForCity } from '@/config/services'
import { PhotoPlaceholder } from '@/components/photo-placeholder'

// У «Имплантации» в данных вместо фото стоит англоязычная медицинская схема —
// не подходит для сайта. Показываем заглушку, пока не заменят на реальное фото.
const SERVICES_NEEDING_REAL_PHOTO = new Set(['implantaciya'])

export function ServicesOverview() {
  const { city } = useCity()
  const services = getServicesForCity(city.slug)

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm font-medium text-(--panel-eyebrow)">Направления</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">Что мы лечим</h2>
        <p className="max-w-2xl text-pretty text-(--panel-body)">
          От планового осмотра до сложного протезирования — семь направлений на одной базе, с общей
          историей лечения у каждого пациента.
        </p>
      </div>
      {/* На телефоне — плитка 2×N: одной колонкой семь карточек с картинкой,
          описанием и ссылкой растягивались на три экрана. В узкой карточке
          описание и «Подробнее» скрыты (вся карточка и так ссылка), остаются
          картинка, название и цена — этого хватает, чтобы выбрать направление. */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {services.map((service) => {
          const needsPlaceholder = SERVICES_NEEDING_REAL_PHOTO.has(service.slug)
          return (
            <Link
              key={service.slug}
              href={`/${city.slug}/uslugi/${service.slug}/`}
              className="group flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-silver/25 transition-shadow duration-300 hover:shadow-lg hover:ring-primary/40"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden">
                {needsPlaceholder ? (
                  <PhotoPlaceholder
                    label={`Фото приёма или оборудования для услуги «${service.shortName}»`}
                    width={1200}
                    height={900}
                    className="h-full rounded-none border-0"
                  />
                ) : (
                  <Image
                    src={service.image}
                    alt={service.shortName}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                  <h3 className="font-heading text-base font-bold text-balance text-foreground sm:text-lg">
                    {service.shortName}
                  </h3>
                  <span className="shrink-0 text-sm font-semibold text-primary">от {service.priceFrom} р.</span>
                </div>
                <p className="hidden line-clamp-2 text-sm text-muted-foreground sm:block">
                  {service.cardDescription}
                </p>
                <span className="mt-auto hidden items-center gap-1 pt-1 text-sm font-medium text-primary transition-transform duration-300 group-hover:gap-2 sm:inline-flex">
                  Подробнее
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
