import * as React from 'react'

import { cn } from '@/lib/utils'

// Палитра панелей: пять светлых холодных оттенков (каждый закреплён за двумя
// секциями по кругу страницы) плюс три насыщенные indigo/perivinkle панели.
// Имена вариантов = имена оттенков: лаванда, небо, мята, аква, лёд. Тёплых
// (кремовых, розовых) панелей в палитре больше нет — вся гамма холодная.
// Порядок вариантов на странице задаётся в app/[city]/page.tsx.
type SectionPanelVariant =
  | 'neutral'
  | 'lavender'
  | 'sky'
  | 'mint'
  | 'aqua'
  | 'ice'
  | 'indigo-bold'
  | 'indigo-light'
  | 'periwinkle'
  | 'dark'

const variantClasses: Record<SectionPanelVariant, string> = {
  neutral: 'bg-card ring-1 ring-border',
  lavender: 'bg-(--panel-lavender)',
  sky: 'bg-(--panel-sky)',
  mint: 'bg-(--panel-mint)',
  aqua: 'bg-(--panel-aqua)',
  ice: 'bg-(--panel-ice)',
  'indigo-bold': 'bg-(--panel-indigo-bold)',
  'indigo-light': 'bg-(--panel-indigo-light)',
  periwinkle: 'bg-(--panel-periwinkle)',
  dark: 'bg-[linear-gradient(135deg,var(--hero-surface),var(--hero-surface-accent))] text-white',
}

interface SectionPanelProps {
  variant?: SectionPanelVariant
  className?: string
  children: React.ReactNode
}

export function SectionPanel({ variant = 'neutral', className, children }: SectionPanelProps) {
  return (
    // Поля на телефоне заметно уже: при px-4 снаружи и p-8 внутри на экране
    // 390px контенту оставалось ~294px — текст рвался на короткие строки.
    // Теперь остаётся ~326px, а с sm вёрстка возвращается к прежним отступам.
    <section className="px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div
        data-variant={variant}
        className={cn(
          'relative mx-auto max-w-6xl rounded-3xl p-5 sm:p-8 lg:p-12',
          variantClasses[variant],
          className
        )}
      >
        {children}
      </div>
    </section>
  )
}
