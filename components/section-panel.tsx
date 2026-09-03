import * as React from 'react'

import { cn } from '@/lib/utils'

// Палитра панелей: пять светлых оттенков (каждый закреплён за двумя
// секциями по кругу страницы) плюс три насыщенные indigo/perivinkle панели.
// Порядок вариантов на странице задаётся в app/[city]/page.tsx.
type SectionPanelVariant =
  | 'neutral'
  | 'cool-1'
  | 'warm-1'
  | 'mint-1'
  | 'rose-1'
  | 'lavender-1'
  | 'indigo-bold'
  | 'indigo-light'
  | 'periwinkle'
  | 'dark'

const variantClasses: Record<SectionPanelVariant, string> = {
  neutral: 'bg-card ring-1 ring-border',
  'cool-1': 'bg-(--panel-cool-1)',
  'warm-1': 'bg-(--panel-warm-1)',
  'mint-1': 'bg-(--panel-mint-1)',
  'rose-1': 'bg-(--panel-rose-1)',
  'lavender-1': 'bg-(--panel-lavender-1)',
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
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div
        data-variant={variant}
        className={cn(
          'relative mx-auto max-w-6xl rounded-3xl p-8 sm:p-12',
          variantClasses[variant],
          className
        )}
      >
        {children}
      </div>
    </section>
  )
}
