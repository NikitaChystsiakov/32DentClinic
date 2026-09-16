import { Info } from 'lucide-react'

import type { TownContent } from '@/content/towns'

/*
 * «Как уложить лечение в один день» — план поездки по шагам из
 * content.tripPlan: время слева, что происходит — справа. Блок
 * необязательный: города без него секцию не рендерят вовсе. Время здесь
 * — просто текст («≈ 6:20», «после 17:00»), его никто не парсит, чтобы
 * автор мог писать «около» и не привязываться к минутам расписания.
 */
export function TownTripPlan({ content }: { content: TownContent }) {
  const plan = content.tripPlan
  if (!plan || plan.steps.length === 0) return null

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm font-medium text-(--panel-eyebrow)">За один день</span>
        <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
          {plan.title}
        </h2>
        <p className="max-w-2xl text-pretty text-(--panel-body)">{plan.subtitle}</p>
      </div>

      <ol className="relative flex flex-col gap-4 sm:gap-0">
        {plan.steps.map((step, index) => {
          const isLast = index === plan.steps.length - 1
          return (
            <li key={step.title} className="relative grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 sm:pb-6">
              {/* Линия и точка на границе колонок — только с sm, на телефоне
                  шаги идут карточками друг под другом без оси. */}
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute top-[2.6rem] bottom-0 left-40 hidden w-px -translate-x-1/2 bg-primary/25 sm:block"
                />
              )}
              <span
                aria-hidden
                className="absolute top-[1.65rem] left-40 hidden size-3 -translate-x-1/2 rounded-full bg-primary sm:block"
              />
              <div className="flex items-start sm:justify-end sm:pt-[1.15rem] sm:pr-6">
                <span className="whitespace-nowrap rounded-full bg-primary px-3 py-1 font-heading text-sm font-bold tabular-nums text-primary-foreground">
                  {step.time}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 rounded-2xl bg-card p-5 ring-1 ring-border">
                <h3 className="font-heading text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {plan.note && (
        <p className="mt-6 flex items-start gap-2 text-sm text-(--panel-body)">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{plan.note}</span>
        </p>
      )}
    </>
  )
}
