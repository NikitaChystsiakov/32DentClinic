import {
  BadgePercent,
  CalendarClock,
  Clock,
  Factory,
  FileCheck,
  Microscope,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Users,
  type LucideIcon,
} from 'lucide-react'

import type { TownContent } from '@/content/towns'

// Иконки, доступные полю `icon` у причин в content/towns/<город>.ts.
// Новая иконка — добавьте импорт и строку сюда.
const iconMap: Record<string, LucideIcon> = {
  BadgePercent,
  CalendarClock,
  Clock,
  Factory,
  FileCheck,
  Microscope,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Users,
}

export function TownReasons({ content }: { content: TownContent }) {
  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm font-medium text-(--panel-eyebrow)">Почему к нам</span>
        <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
          {content.reasons.title}
        </h2>
        <p className="max-w-2xl text-pretty text-(--panel-body)">{content.reasons.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.reasons.items.map((item) => {
          const Icon = iconMap[item.icon] ?? Sparkles
          return (
            <div key={item.title} className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-border">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="font-heading text-base font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}
