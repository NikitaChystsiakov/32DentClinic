'use client'

import { BadgePercent, ShieldCheck, Factory, CalendarClock, Cpu, Sofa, MapPin, Handshake } from 'lucide-react'
import { useCity } from '@/lib/contexts/city-context'

const iconMap = {
  BadgePercent,
  ShieldCheck,
  Factory,
  CalendarClock,
  Cpu,
  Sofa,
  MapPin,
  Handshake,
} as const

export function WhyUsSection() {
  const { content } = useCity()
  const points = content.whyUs.points.map((point, index) => ({
    ...point,
    icon: Object.values(iconMap)[index],
  }))

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Почему именно мы</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          <span className="text-accent">32</span> причины выбрать 32Дент
        </h2>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          {content.whyUs.subtitle}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => (
          <div key={point.title} className="flex flex-col gap-3 rounded-xl p-5">
            <div className="flex size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <point.icon className="size-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">{point.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
