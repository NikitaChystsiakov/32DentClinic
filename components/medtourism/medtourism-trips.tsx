import { Home, Info, Plane } from 'lucide-react'

import { MedTourismHeading, TbdBadge } from '@/components/medtourism/medtourism-heading'
import { MEDTOURISM_DRAFT, type MedTourismContent } from '@/content/medtourism'
import { cn } from '@/lib/utils'

/*
 * «Сколько поездок» — по плану на каждый вид лечения: поездка → дома →
 * поездка. Поездки — белые карточки, пауза дома — прозрачная с пунктиром:
 * сразу видно, что в Минске нужно быть только в двух отрезках. Сроки
 * поездок пока ориентировочные — в черновике у заголовка плашка.
 */
export function MedTourismTrips({ content }: { content: MedTourismContent }) {
  const { trips } = content
  return (
    <>
      <MedTourismHeading eyebrow="Поездки" title={trips.title} subtitle={trips.subtitle} />
      {MEDTOURISM_DRAFT && (
        <div className="-mt-4 mb-6">
          <TbdBadge />
        </div>
      )}
      <div className="flex flex-col gap-8">
        {trips.plans.map((plan) => (
          <div key={plan.name} className="flex flex-col gap-3">
            <h3 className="font-heading text-lg font-semibold text-(--panel-heading)">{plan.name}</h3>
            <ol className="grid gap-3 md:grid-cols-3">
              {plan.phases.map((phase) => {
                const isTrip = phase.kind === 'trip'
                const Icon = isTrip ? Plane : Home
                return (
                  <li
                    key={phase.label}
                    className={cn(
                      'flex flex-col gap-2 rounded-2xl p-5',
                      isTrip ? 'bg-card ring-1 ring-border' : 'border-2 border-dashed border-primary/25 bg-card/40'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        <Icon className="size-4" />
                        {phase.label}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-primary">
                        {phase.duration}
                      </span>
                    </div>
                    <h4 className="font-heading text-base font-semibold text-foreground">{phase.title}</h4>
                    <ul className="flex list-disc flex-col gap-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                      {phase.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
      <p className="mt-6 flex items-start gap-2 text-sm text-(--panel-body)">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>{trips.note}</span>
      </p>
    </>
  )
}
