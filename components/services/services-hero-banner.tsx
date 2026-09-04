'use client'

import Link from 'next/link'
import { ArrowRight, Calculator, ShieldCheck, Wallet, Stethoscope } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'

const TRUST_POINTS = [
  { icon: Stethoscope, label: 'Все направления в одной клинике' },
  { icon: ShieldCheck, label: 'Гарантия на выполненные работы' },
  { icon: Wallet, label: 'Рассрочка 0% и понятные цены' },
]

interface ServicesHeroBannerProps {
  /** SEO-заголовок страницы города. Идёт вторым, более мелким блоком h1 —
   *  крупная строка выше это слоган, но ключевые слова остаются внутри h1. */
  title: string
  description: string
  /** Ссылка на калькулятор — с префиксом города или без него. */
  calculatorHref: string
}

export function ServicesHeroBanner({ title, description, calculatorHref }: ServicesHeroBannerProps) {
  const { openBookingModal } = useBookingModal()

  return (
    // Баннер, а не просто заголовок: до перечня услуг у страницы не было
    // ни одного сообщения о клинике — человек попадал сразу в список плиток.
    <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(125deg,var(--hero-surface),var(--hero-surface-accent))] p-6 sm:p-10 lg:p-14">
      {/* Светлые пятна вместо затемняющего оверлея: фон остаётся чистым цветом. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_-10%,rgba(255,255,255,0.3),transparent_50%),radial-gradient(circle_at_-5%_110%,color-mix(in_oklch,var(--secondary),transparent_55%),transparent_55%)]"
      />
      {/* Крупная полупрозрачная «32» — фирменный знак вместо стоковой картинки.
          Скрыта на телефоне: там она перекрывала бы текст. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-16 hidden font-heading text-[13rem] leading-none font-bold text-white/10 select-none lg:block"
      >
        32
      </span>

      <div className="relative flex max-w-3xl flex-col gap-6">
        <span className="w-fit rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold tracking-wide text-white uppercase ring-1 ring-white/25">
          Услуги и цены
        </span>

        <h1 className="flex flex-col gap-3">
          <span className="font-heading text-3xl leading-[1.12] font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
            Здоровые зубы — без страха, боли и сюрпризов в цене
          </span>
          <span className="text-base font-medium text-white/80">{title}</span>
        </h1>

        <p className="max-w-2xl text-pretty leading-relaxed text-white/90">{description}</p>

        <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
          {TRUST_POINTS.map((point) => (
            <li key={point.label} className="flex items-center gap-2 text-sm font-medium text-white/90">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                <point.icon className="size-4" />
              </span>
              {point.label}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <Button size="lg" variant="inverse" onClick={() => openBookingModal()}>
            Записаться на консультацию
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white dark:border-white/35 dark:bg-white/10 dark:hover:bg-white/20"
            render={<Link href={calculatorHref} />}
            nativeButton={false}
          >
            <Calculator data-icon="inline-start" />
            Рассчитать стоимость
          </Button>
        </div>
      </div>
    </div>
  )
}
