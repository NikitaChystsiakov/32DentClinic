'use client'

import Image from 'next/image'
import { BadgePercent, ShieldCheck, Factory, CalendarClock, Cpu, Sofa, MapPin, Handshake } from 'lucide-react'
import { useCity } from '@/lib/contexts/city-context'
import { getDoctorsForCity, type Doctor } from '@/config/doctors'
import { cn } from '@/lib/utils'

function pluralizeDoctors(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'врач'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'врача'
  return 'врачей'
}

// Предпочитаем конкретного врача (Киреев — фото хорошо ложится в формат панели),
// иначе берём любого ортопеда города, иначе первого доступного.
function pickShowcaseDoctor(doctors: Doctor[]): Doctor | undefined {
  return (
    doctors.find((d) => d.slug === 'kireev-vladislav') ??
    doctors.find((d) => d.categories.includes('ortoped')) ??
    doctors[0]
  )
}

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
  const { city, content } = useCity()
  const doctors = getDoctorsForCity(city.slug)
  const doctorsCount = doctors.length
  const showcaseDoctor = pickShowcaseDoctor(doctors)
  const points = content.whyUs.points.map((point, index) => ({
    ...point,
    icon: Object.values(iconMap)[index],
  }))

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Почему именно мы</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          <span className="text-accent">32</span> причины выбрать 32Дент
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-10">
        {/* На телефоне карточка квадратная, а не низкая полоса: фото врача
            квадратное, и в контейнере 326×240 object-cover срезал голову, а
            подпись ложилась прямо на лицо. С квадратом кадр совпадает с
            пропорциями исходника, а текст внизу остаётся на плечах.
            С sm возвращается прежняя высокая карточка десктопа. */}
        <div className="silver-sheen relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl border border-silver/30 shadow-lg sm:aspect-auto sm:min-h-95">
          {showcaseDoctor ? (
            <Image
              src={showcaseDoctor.photo}
              alt={showcaseDoctor.name}
              fill
              sizes="(max-width: 1024px) 100vw, 300px"
              // object-top только на телефоне: если кадр всё же придётся
              // подрезать, обрезается низ, а не голова. На десктопе карточка
              // высокая и центрирование даёт лучший кадр — поэтому sm:object-center.
              className="object-cover object-top sm:object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-b from-silver-muted to-transparent" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />
          <div className="relative flex flex-col gap-3 p-6">
            <span className="font-heading text-5xl font-bold tracking-tight text-white drop-shadow-sm">
              {doctorsCount}
            </span>
            <p className="font-heading text-base font-semibold text-white drop-shadow-sm">
              {pluralizeDoctors(doctorsCount)} принимают пациентов в клинике
            </p>
            <p className="text-pretty text-xs leading-relaxed text-white/80">
              {content.whyUs.subtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 sm:gap-y-6">
          {points.map((point, index) => (
            <div
              key={point.title}
              className={cn(
                'group flex items-start gap-3 pb-4 sm:gap-3.5 sm:pb-6',
                // На телефоне колонка одна, поэтому разделитель нужен у всех,
                // кроме последнего; в две колонки — кроме последней пары.
                index < points.length - 1 && 'border-b border-border/60',
                index >= points.length - 2 && 'sm:border-b-0'
              )}
            >
              <point.icon className="mt-0.5 size-5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:text-accent" />
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">{point.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
