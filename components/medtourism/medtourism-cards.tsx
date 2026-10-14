import {
  BadgePercent,
  BedDouble,
  CalendarClock,
  Car,
  FileCheck,
  MessageCircle,
  Microscope,
  Plane,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

import { MedTourismHeading, TbdBadge } from '@/components/medtourism/medtourism-heading'
import { MEDTOURISM_DRAFT, type MedTourismCard } from '@/content/medtourism'

// Иконки, доступные полю `icon` в content/medtourism.ts. Новая иконка —
// добавьте импорт и строку сюда.
const iconMap: Record<string, LucideIcon> = {
  BadgePercent,
  BedDouble,
  CalendarClock,
  Car,
  FileCheck,
  MessageCircle,
  Microscope,
  Plane,
  ShieldCheck,
  TrainFront,
  Users,
  Wrench,
}

/**
 * Сетка карточек «иконка — заголовок — текст»: причины, дорога, проживание,
 * гарантия. Одна вёрстка на все четыре блока — отличаются только тексты и
 * число колонок (четыре карточки встают 2×2, остальное — по три в ряд).
 */
export function MedTourismCards({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  items: MedTourismCard[]
}) {
  const columns = items.length === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <>
      <MedTourismHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className={`grid gap-4 ${columns}`}>
        {items.map((item) => {
          const Icon = iconMap[item.icon] ?? Sparkles
          return (
            <div key={item.title} className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-border">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                {MEDTOURISM_DRAFT && item.tbd && <TbdBadge />}
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}
