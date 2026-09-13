import Link from 'next/link'
import { ArrowRight, MapPin, Phone } from 'lucide-react'

import type { NearbyTown } from '@/config/nearby-towns'
import { getServicesForCity } from '@/config/services'
import { getDoctorsForCity } from '@/config/doctors'
import type { TownContent } from '@/content/towns'
import { formatTravelTime, getTownClinics } from '@/lib/town-clinics'

function pluralizeDoctors(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'врач'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'врача'
  return 'врачей'
}

/*
 * Честный абзац о том, что клиники в городе нет, и карточки клиник сети,
 * куда ехать: адрес, телефон, кто принимает и что здесь делают. Список
 * направлений берётся из availableIn в config/services.ts — если в Жлобине
 * нет имплантации, карточка её и не покажет.
 */
export function TownIntro({ town, content }: { town: NearbyTown; content: TownContent }) {
  const clinics = getTownClinics(town)

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium text-(--panel-eyebrow)">Где мы принимаем</span>
        <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
          {content.intro.title}
        </h2>
        {content.intro.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-pretty leading-relaxed text-(--panel-body)">
            {paragraph}
          </p>
        ))}
        {town.transfer && (
          <p className="rounded-2xl bg-card px-4 py-3 text-sm font-medium text-foreground ring-1 ring-border">
            {town.transfer}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {clinics.map((clinic) => {
          const services = getServicesForCity(clinic.slug)
          const doctorsCount = getDoctorsForCity(clinic.slug).length
          return (
            <article
              key={clinic.slug}
              className="flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-border transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-heading text-xl font-bold text-foreground">32Дент {clinic.city.name}</h3>
                <span className="text-sm font-medium text-primary">
                  {clinic.distanceKm} км · ~{formatTravelTime(clinic.travelMinutes)}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  {clinic.city.address}
                </span>
                <a href={clinic.city.phoneHref} className="flex items-center gap-2 font-medium text-foreground hover:text-primary">
                  <Phone className="size-4 shrink-0 text-primary" />
                  {clinic.city.phone}
                </a>
                <span>
                  {doctorsCount} {pluralizeDoctors(doctorsCount)} · {services.map((s) => s.shortName.toLowerCase()).join(', ')}
                </span>
              </div>
              <Link
                href={`/${clinic.slug}/`}
                className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-[gap]"
              >
                Страница клиники
                <ArrowRight className="size-4" />
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
