import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'

import type { NearbyTown } from '@/config/nearby-towns'
import { formatServicePrice, getServiceBySlug } from '@/config/services'
import type { TownContent } from '@/content/towns'
import { getClinicForService } from '@/lib/town-clinics'

/*
 * Услуги, за которыми едут из соседнего города. Название, цена и картинка —
 * из config/services.ts; клиника на плашке — первая по приоритету, где
 * услуга есть по availableIn, туда же ведёт ссылка. Услуга, которой нет ни
 * в одной из клиник города, просто не рендерится.
 */
export function TownFeaturedServices({ town, content }: { town: NearbyTown; content: TownContent }) {
  const items = content.featuredServices.items.flatMap((item) => {
    const service = getServiceBySlug(item.slug)
    const clinic = getClinicForService(town, item.slug)
    return service && clinic ? [{ ...item, service, clinic }] : []
  })

  if (items.length === 0) return null

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm font-medium text-(--panel-eyebrow)">Услуги</span>
        <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
          {content.featuredServices.title}
        </h2>
        <p className="max-w-2xl text-pretty text-(--panel-body)">{content.featuredServices.subtitle}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {items.map(({ service, clinic, note }) => (
          <Link
            key={service.slug}
            href={`/${clinic.slug}/uslugi/${service.slug}/`}
            className="group flex overflow-hidden rounded-2xl bg-card ring-1 ring-primary/10 transition-all duration-300 ease-out hover:shadow-lg hover:ring-primary/40"
          >
            <div className="relative w-32 shrink-0 overflow-hidden sm:w-40">
              <Image
                src={service.image}
                alt={service.shortName}
                fill
                sizes="(max-width: 640px) 128px, 160px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <MapPin className="size-3" />в {clinic.city.nameIn} · {clinic.distanceKm} км
              </span>
              <div className="flex items-baseline justify-between gap-x-3">
                <h3 className="min-w-0 font-heading text-lg leading-snug font-bold text-balance text-foreground">
                  {service.shortName}
                </h3>
                <span className="shrink-0 text-sm font-semibold text-primary">{formatServicePrice(service, 'р.')}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
              <span className="mt-auto inline-flex w-fit items-center gap-1 pt-2 text-sm font-medium text-primary transition-[gap] duration-300 group-hover:gap-2">
                Подробнее
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
