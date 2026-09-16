'use client'

import { Crown, Infinity, ShieldCheck, Stethoscope, type LucideIcon } from 'lucide-react'

import { BookingButton } from '@/components/booking-button'
import { useCity } from '@/lib/contexts/city-context'

const iconMap: Record<string, LucideIcon> = {
  Infinity,
  Stethoscope,
  Crown,
  ShieldCheck,
}

/**
 * «Гарантия» — отдельный блок, а не строка в «32 причинах»: для имплантации
 * это второй по важности вопрос после цены, и раньше он был размазан по
 * hero, whyUs и FAQ. Набор карточек — из content/<город>.ts → guarantee.
 */
export function GuaranteeSection() {
  const { content } = useCity()
  const { guarantee } = content

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center lg:gap-12">
      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium text-(--panel-eyebrow)">{guarantee.eyebrow}</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading) sm:text-4xl">
          {guarantee.title}
        </h2>
        <p className="text-pretty text-(--panel-body)">{guarantee.subtitle}</p>
        <BookingButton variant="inverse" className="mt-2 w-fit" options={{ service: 'implantaciya' }}>
          Записаться на консультацию
        </BookingButton>
        <p className="text-xs text-(--panel-body)/80">{guarantee.note}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        {guarantee.items.map((item, index) => {
          const Icon = iconMap[item.icon]
          return (
            <div
              key={item.label}
              // Первая карточка (гарантия на импланты) растянута на две колонки:
              // это главный аргумент блока, и при трёх карточках сетка 2×2
              // иначе оставляла бы пустую ячейку.
              className={
                index === 0 && guarantee.items.length === 3
                  ? 'flex flex-col gap-3 rounded-2xl bg-white/85 p-5 ring-1 ring-primary/10 sm:col-span-2 sm:flex-row sm:items-center sm:gap-6'
                  : 'flex flex-col gap-3 rounded-2xl bg-white/85 p-5 ring-1 ring-primary/10'
              }
            >
              <div className="flex shrink-0 items-center gap-3">
                {Icon && (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                )}
                <dt className="flex flex-col">
                  <span className="font-heading text-3xl leading-none font-bold text-foreground">{item.value}</span>
                  <span className="mt-1 text-sm font-medium whitespace-nowrap text-primary">{item.label}</span>
                </dt>
              </div>
              <dd className="text-sm leading-relaxed text-muted-foreground">{item.description}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
