import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarClock, Check, ShieldCheck, Smile } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import { MedTourismHeading } from '@/components/medtourism/medtourism-heading'
import type { City } from '@/config/cities'
import { paymentPageHref } from '@/config/payment-pages'
import { orthodontics, type OrthoBraces, type OrthoPackage } from '@/content/orthodontics'

/*
 * Секции страницы «Ортодонтия» и блок ортодонтии на главной. Серверные:
 * интерактивных частей нет, кроме кнопок записи (клиентские островки).
 */

export function formatRub(value: number): string {
  return `${value.toLocaleString('ru-RU')} р.`
}

export function OrthoHero({ city }: { city: City }) {
  const { hero } = orthodontics
  const minBraces = Math.min(...orthodontics.braces.items.map((b) => b.price))
  const minAligners = Math.min(...orthodontics.aligners.packages.map((p) => p.price))
  const facts = [
    { value: `от ${formatRub(minBraces)}`, label: 'брекеты на одну челюсть' },
    { value: `от ${formatRub(minAligners)}`, label: 'курс элайнеров' },
    { value: formatRub(hero.consultationPrice), label: 'консультация ортодонта' },
  ]

  return (
    <section className="border-b border-border px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-background/70 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-silver/25">
            <Smile className="size-4 text-secondary" />
            <span>
              {hero.eyebrow} · {city.brandName} {city.name}
            </span>
          </div>
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {hero.title}
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">{hero.subtitle}</p>
          <ul className="flex flex-col gap-2 text-sm text-foreground">
            {hero.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-secondary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <BookingButton
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              options={{ service: 'ortodontiya' }}
            >
              Записаться на консультацию
            </BookingButton>
            <Button size="lg" variant="outline" render={<a href="#ceny" />} nativeButton={false}>
              Смотреть цены
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-silver/25 pt-6">
            {facts.map((fact, index) => (
              <div key={fact.label} className="contents">
                {index > 0 && <div aria-hidden className="hidden h-9 w-px bg-silver/30 sm:block" />}
                <div className="flex items-center gap-3">
                  <span className="font-heading text-2xl font-bold whitespace-nowrap text-foreground">{fact.value}</span>
                  <span className="max-w-28 text-xs leading-tight text-muted-foreground">{fact.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl ring-1 ring-foreground/10 lg:aspect-4/5">
          <Image
            src="/images/services/ortodontiya.webp"
            alt={`Ортодонтия в стоматологии ${city.brandName} в ${city.nameIn}`}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}

function PackageCard({ pkg, featured }: { pkg: OrthoPackage; featured: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 rounded-3xl p-6 sm:p-7',
        featured
          ? 'bg-[linear-gradient(140deg,var(--hero-surface),var(--hero-surface-accent))] text-white shadow-xl shadow-primary/20'
          : 'bg-card ring-1 ring-border'
      )}
    >
      <div className="flex flex-col gap-1">
        <span className={cn('text-sm font-medium', featured ? 'text-white/80' : 'text-muted-foreground')}>
          Элайнеры · {pkg.aligners}
        </span>
        <h3 className={cn('font-heading text-2xl font-bold', featured ? 'text-white' : 'text-foreground')}>
          {pkg.name}
        </h3>
      </div>
      <p className={cn('text-sm leading-relaxed', featured ? 'text-white/90' : 'text-muted-foreground')}>
        {pkg.forWhom}
      </p>
      <ul className="flex flex-col gap-2">
        {pkg.points.map((point) => (
          <li key={point} className={cn('flex items-start gap-2 text-sm', featured ? 'text-white' : 'text-foreground')}>
            <Check className={cn('mt-0.5 size-4 shrink-0', featured ? 'text-white' : 'text-secondary')} />
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-4 pt-2">
        <span className={cn('font-heading text-3xl font-bold', featured ? 'text-white' : 'text-primary')}>
          {formatRub(pkg.price)}
        </span>
        <BookingButton
          variant={featured ? 'inverse' : 'default'}
          className="w-full"
          options={{ service: 'ortodontiya' }}
        >
          Записаться на консультацию
        </BookingButton>
      </div>
    </div>
  )
}

export function OrthoAligners() {
  const { aligners } = orthodontics
  return (
    <>
      <MedTourismHeading eyebrow="Элайнеры" title={aligners.title} subtitle={aligners.subtitle} />
      <div className="grid gap-4 md:grid-cols-3">
        {aligners.packages.map((pkg, index) => (
          <PackageCard key={pkg.name} pkg={pkg} featured={index === 1} />
        ))}
      </div>
    </>
  )
}

function BracesCard({ item }: { item: OrthoBraces }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-border">
      <h3 className="font-heading text-base font-semibold text-foreground">{item.name}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      <div className="mt-auto flex flex-col pt-2">
        <span className="font-heading text-xl font-bold whitespace-nowrap text-primary">от {formatRub(item.price)}</span>
        <span className="text-xs text-muted-foreground">за одну челюсть</span>
      </div>
    </div>
  )
}

export function OrthoBracesSection() {
  const { braces } = orthodontics
  return (
    <>
      <MedTourismHeading eyebrow="Брекеты" title={braces.title} subtitle={braces.subtitle} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {braces.items.map((item) => (
          <BracesCard key={item.name} item={item} />
        ))}
      </div>
    </>
  )
}

/** Плашка «рассрочка» — ведёт на страницу оплаты, если она есть у города. */
export function OrthoPaymentBanner({ city }: { city: City }) {
  const href = paymentPageHref(city.slug)
  if (!href) return null
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-3xl bg-card p-6 ring-1 ring-primary/15 transition-shadow hover:shadow-xl hover:shadow-primary/10 sm:flex-row sm:items-center sm:p-8"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarClock className="size-6" />
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <h2 className="font-heading text-xl font-bold text-foreground">Брекеты и элайнеры — в рассрочку</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Карты «Халва» и «Черепаха» — до 8 месяцев без переплаты, кредит в банке-партнёре — до 7 лет.
        </p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        Условия оплаты
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/**
 * Блок «Ортодонтия» на главной города: три пакета элайнеров и брекеты одной
 * строкой, со ссылкой на отдельную страницу. Только у городов, где есть
 * ортодонт (решает страница).
 */
export function OrthodonticsHomeSection({ city }: { city: City }) {
  const { aligners, braces } = orthodontics
  const minBraces = Math.min(...braces.items.map((b) => b.price))
  const pageHref = `/${city.slug}/uslugi/ortodontiya/`

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <span className="text-sm font-medium text-(--panel-eyebrow)">Ортодонтия</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading) sm:text-4xl">
            Ровные зубы: брекеты и элайнеры
          </h2>
          <p className="text-pretty text-(--panel-body)">
            Исправляем прикус у детей и взрослых. Прозрачные элайнеры — три пакета по сложности случая, брекеты —{' '}
            <span className="font-semibold text-(--panel-heading)">от {formatRub(minBraces)}</span> на челюсть.
          </p>
        </div>
        <Button variant="outline" className="w-fit shrink-0" render={<Link href={pageHref} />} nativeButton={false}>
          Всё об ортодонтии
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {aligners.packages.map((pkg) => (
          <Link
            key={pkg.name}
            href={pageHref}
            className="group flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-border transition-shadow hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/30"
          >
            <span className="text-xs font-semibold tracking-wide text-secondary uppercase">Элайнеры</span>
            <h3 className="font-heading text-xl font-bold text-foreground">{pkg.name}</h3>
            <p className="text-sm font-medium text-foreground">{pkg.aligners}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{pkg.forWhom}</p>
            <span className="mt-auto pt-3 font-heading text-2xl font-bold text-primary">{formatRub(pkg.price)}</span>
          </Link>
        ))}
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-primary p-5 text-primary-foreground">
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-lg leading-snug font-bold">Не знаете, что подойдёт?</h3>
            <p className="text-sm leading-relaxed text-primary-foreground/85">
              Ортодонт со стажем 20 лет оценит прикус и предложит варианты. Консультация —{' '}
              {formatRub(orthodontics.hero.consultationPrice)}
            </p>
          </div>
          <BookingButton variant="inverse" className="w-fit" options={{ service: 'ortodontiya' }}>
            Записаться
          </BookingButton>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-(--panel-body)">
        <ShieldCheck className="size-4 shrink-0 text-secondary" />
        Есть противопоказания, необходима консультация специалиста.
      </p>
    </>
  )
}
