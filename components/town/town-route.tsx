import { Bus, Car, Clock, MapPin, ParkingSquare, Phone } from 'lucide-react'

import { LazyMap } from '@/components/lazy-map'
import { getCityBySlug } from '@/config/cities'
import type { NearbyTown } from '@/config/nearby-towns'
import { getCityContent } from '@/content'
import type { TownContent } from '@/content/towns'
import { formatCityHours } from '@/lib/format-hours'
import { formatTravelTime, yandexRouteHref } from '@/lib/town-clinics'

/*
 * «Как добраться» — по блоку на каждую клинику из content.route.clinics:
 * слева маршрут на машине и общественным транспортом, справа карта клиники
 * (грузится по клику, см. lazy-map.tsx) и кнопка маршрута от центра города.
 * Секция с id="route" — на неё ведёт кнопка из hero.
 */
export function TownRoute({ town, content }: { town: NearbyTown; content: TownContent }) {
  const blocks = content.route.clinics.flatMap((route) => {
    const city = getCityBySlug(route.clinicSlug)
    const cityContent = getCityContent(route.clinicSlug)
    const clinic = town.clinics.find((c) => c.slug === route.clinicSlug)
    return city && cityContent && clinic ? [{ route, city, cityContent, clinic }] : []
  })

  return (
    <div id="route" className="scroll-mt-24">
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm font-medium text-(--panel-eyebrow)">Дорога</span>
        <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
          {content.route.title}
        </h2>
        <p className="max-w-2xl text-pretty text-(--panel-body)">{content.route.subtitle}</p>
      </div>

      <div className="flex flex-col gap-6">
        {blocks.map(({ route, city, cityContent, clinic }) => (
          <div
            key={city.slug}
            className="grid gap-6 rounded-2xl bg-card p-5 ring-1 ring-border md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-8 sm:p-6"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-heading text-xl font-bold text-foreground">32Дент {city.name}</h3>
                  <span className="text-sm font-medium text-primary">
                    {clinic.distanceKm} км · ~{formatTravelTime(clinic.travelMinutes)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{route.summary}</p>
              </div>

              <dl className="flex flex-col gap-4 text-sm">
                <div className="flex gap-3">
                  <Car className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="flex flex-col gap-0.5">
                    <dt className="font-medium text-foreground">На машине</dt>
                    <dd className="leading-relaxed text-muted-foreground">{route.car}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Bus className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="flex flex-col gap-0.5">
                    <dt className="font-medium text-foreground">Поездом или маршруткой</dt>
                    <dd className="leading-relaxed text-muted-foreground">{route.publicTransport}</dd>
                  </div>
                </div>
                {route.parking && (
                  <div className="flex gap-3">
                    <ParkingSquare className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="flex flex-col gap-0.5">
                      <dt className="font-medium text-foreground">Парковка</dt>
                      <dd className="leading-relaxed text-muted-foreground">{route.parking}</dd>
                    </div>
                  </div>
                )}
              </dl>

              <div className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  {city.address}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-primary" />
                  {formatCityHours(cityContent.contacts.hours)}
                </span>
                <a href={city.phoneHref} className="flex items-center gap-2 font-medium text-foreground hover:text-primary">
                  <Phone className="size-4 shrink-0 text-primary" />
                  {city.phone}
                </a>
              </div>
            </div>

            <LazyMap
              embedSrc={`https://yandex.ru/map-widget/v1/?ll=${city.coordinates.lng},${city.coordinates.lat}&z=15&pt=${city.coordinates.lng},${city.coordinates.lat},pm2rdm`}
              externalHref={yandexRouteHref(town.coordinates, city.coordinates)}
              title={`Маршрут из ${town.nameFrom} к 32Дент в ${city.nameIn}`}
              address={city.address}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
