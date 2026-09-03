'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Flame } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import type { HeroBadge, HeroOffer } from '@/content/types'

interface HeroStat {
  value: string
  label: string
}

interface HeroSplitProps {
  /** Описательные плашки над заголовком (не завязаны на срок акции), например
   *  «Имплант под ключ». Рендерятся всегда, если переданы. */
  tags?: string[]
  title: string
  highlights: string[]
  badge: HeroBadge
  offers: HeroOffer[]
  photo: { src: string; alt: string }
  /** Видеопортрет вместо статичного фото — если передан, рендерится вместо `photo`. */
  video?: string
  /**
   * Бейдж срочности активной акции, например «Только в сентябре». Передавайте
   * его вместе с countdown или не передавайте вовсе — оба поля приходят из
   * одного hero.promo в конфиге города и должны появляться/исчезать вместе
   * (см. app/[city]/page.tsx).
   */
  urgencyBadge?: string
  /** Подпись обратного отсчёта акции, например «Осталось 13д 7ч». */
  countdown?: string
  /** Строка метрик под hero. */
  stats?: HeroStat[]
}

// Радиус окружности, по которой идёт текст бейджа, и её длина —
// textLength растягивает любую надпись ровно на полный круг.
const BADGE_RADIUS = 38
const BADGE_CIRCUMFERENCE = 2 * Math.PI * BADGE_RADIUS

function SpinningBadge({ badge, className }: { badge: HeroBadge; className?: string }) {
  const pathId = React.useId()

  return (
    <div
      className={cn(
        'relative size-26 shrink-0 rounded-full bg-primary text-white shadow-lg ring-4 ring-white/85',
        className
      )}
    >
      <svg viewBox="0 0 100 100" className="animate-badge-spin size-full" aria-hidden>
        <defs>
          <path
            id={pathId}
            fill="none"
            d={`M 50,50 m -${BADGE_RADIUS},0 a ${BADGE_RADIUS},${BADGE_RADIUS} 0 1,1 ${BADGE_RADIUS * 2},0 a ${BADGE_RADIUS},${BADGE_RADIUS} 0 1,1 -${BADGE_RADIUS * 2},0`}
          />
        </defs>
        <text className="fill-white/85 text-[7.5px] font-semibold uppercase">
          <textPath
            href={`#${pathId}`}
            startOffset="0"
            textLength={BADGE_CIRCUMFERENCE}
            lengthAdjust="spacing"
          >
            {badge.ring}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-2xl leading-none font-bold">{badge.centerValue}</span>
        <span className="mt-0.5 text-[11px] tracking-wide text-white/75">{badge.centerLabel}</span>
      </div>
    </div>
  )
}

function OfferCard({ offer }: { offer: HeroOffer }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl bg-[linear-gradient(140deg,var(--hero-surface),var(--hero-surface-accent))] p-6 text-white">
      {/* Слот под стикер: без рамки, ринга и обрезки — просто область
          200×200px под PNG-стикер без фона (схема имплантации, зубная дуга).
          Крупный и прижат к самому краю карточки — стикер здесь такой же
          акцент, как фото врача в левой карточке. Фиксированный px, а не %, —
          так размер не «плывёт» вместе с высотой карточки. object-contain не
          обрежет стикер, каким бы он ни был по пропорциям. */}
      <div className="pointer-events-none absolute -right-3 -bottom-3 size-50">
        <Image
          src={offer.image}
          alt=""
          fill
          sizes="200px"
          className="object-contain drop-shadow-xl"
        />
      </div>

      <div className="relative flex max-w-[54%] flex-1 flex-col gap-2">
        {offer.tag && (
          <span className="w-fit rounded-md bg-accent px-2 py-1 text-[11px] font-bold tracking-wide text-accent-foreground uppercase">
            {offer.tag}
          </span>
        )}
        <h2 className="font-heading text-xl leading-tight font-bold text-balance">{offer.title}</h2>
        <p className="text-sm leading-relaxed text-white/70">{offer.description}</p>

        <div className="mt-auto flex flex-col items-start gap-3 pt-5">
          <span className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold">{offer.price}</span>
            {offer.oldPrice && (
              <span className="text-sm text-white/50 line-through">{offer.oldPrice}</span>
            )}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            render={<Link href={offer.href} />}
            nativeButton={false}
          >
            Подробнее
          </Button>
        </div>
      </div>
    </div>
  )
}

export function HeroSplit({
  tags,
  title,
  highlights,
  badge,
  offers,
  photo,
  video,
  urgencyBadge,
  countdown,
  stats,
}: HeroSplitProps) {
  const { openBookingModal } = useBookingModal()

  return (
    // Hero намеренно шире остальных секций и с меньшими полями: на ноутбучных
    // экранах (1280–1600) он идёт почти впритык к краям, упираясь в потолок
    // только на очень широких мониторах.
    <section className="px-3 py-6 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-[100rem]">
        {/* Ширину сначала забирает правая колонка (clamp), большая карточка
            получает остаток. Ниже lg сетка перестраивается: большая карточка
            во всю ширину, два оффера — рядом под ней. Высоту секции задаёт
            содержимое (никакого принудительного min-h на всю высоту экрана —
            от него внутри карточек оставалось много пустого места); grid-rows
            остаётся [1fr], чтобы обе колонки уравнивались по высоте наравне
            с самой высокой из них, а не растягивались до вьюпорта. */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_clamp(25rem,32vw,34rem)] lg:grid-rows-[1fr]">
          {/* Левая карточка: предложение месяца */}
          <div
            data-variant="dark"
            className="relative overflow-hidden rounded-3xl bg-[linear-gradient(125deg,var(--hero-surface),var(--hero-surface-accent))] p-6 sm:p-8 lg:p-10"
          >
            {/* Портрет врача — главный визуальный акцент карточки: большой,
                прижат к правому краю на всю высоту карточки (bleed до самой
                рамки, скругление обрезает её же родительским overflow-hidden).
                Видео — с уже вшитой тёмной виньеткой по краям, поэтому
                object-cover сливается с градиентом карточки без видимых
                границ. Без video — картинка-стикер на прозрачном фоне,
                object-contain вписывает её целиком, object-bottom прижимает
                к нижнему краю карточки — сверху фото обрезано (кадр начинается
                от груди), поэтому object-top показывал бы обрезанный край. */}
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] sm:block lg:w-[44%]">
              {video ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="size-full object-cover object-top"
                >
                  <source src={video} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 46vw, 52vw"
                  className="object-contain object-bottom drop-shadow-2xl"
                />
              )}
            </div>

            {/* От sm — свободный угол над фото, бейдж можно позиционировать
                абсолютно. На узких экранах там же начинаются плашки тегов,
                поэтому ниже sm бейдж встаёт в их ряд как ещё один элемент. */}
            {countdown && (
              <span className="absolute top-5 right-5 z-10 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur sm:flex">
                <Flame className="size-3.5 text-accent" />
                {countdown}
              </span>
            )}

            {/* Высоту левой карточки задаёт правая колонка, поэтому контент
                центрируем: иначе весь запас воздуха собирается под кнопкой. */}
            <div className="relative flex h-full flex-col justify-center gap-5 sm:max-w-[52%] lg:max-w-[60%]">
              {(urgencyBadge || (tags && tags.length > 0) || countdown) && (
                <div className="flex flex-wrap gap-2">
                  {urgencyBadge && (
                    <span className="rounded-md bg-accent px-3 py-1.5 text-xs font-bold tracking-wide text-accent-foreground uppercase">
                      {urgencyBadge}
                    </span>
                  )}
                  {tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white px-3 py-1.5 text-xs font-bold tracking-wide text-slate-900 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                  {countdown && (
                    <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm sm:hidden">
                      <Flame className="size-3.5 text-accent" />
                      {countdown}
                    </span>
                  )}
                </div>
              )}

              <h1 className="font-heading text-3xl leading-[1.08] font-bold tracking-tight text-balance text-white sm:text-4xl xl:text-5xl">
                {title}
              </h1>

              <ul className="flex flex-col gap-2.5">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-white/85">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Check className="size-3.5" />
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* Без привязки к конкретному времени: пока нет системы записи/CRM,
                  показывать вычисленный «ближайший слот» нельзя — это выглядело бы
                  как реальная запись, а по факту никем не подтверждено. */}
              <div className="relative mt-1 flex items-center gap-4">
                <Button
                  size="lg"
                  onClick={() => openBookingModal()}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Записаться
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <SpinningBadge badge={badge} className="hidden shrink-0 lg:block" />
              </div>
            </div>
          </div>

          {/* Два предложения: справа колонкой на десктопе, парой под большой
              карточкой на планшете, друг под другом на телефоне. От lg — flex,
              не grid: flex-1 на карточках делит выросшую высоту секции пополам
              (grid с auto-строками просто оставил бы лишнюю высоту пустой). */}
          <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 lg:flex lg:flex-col">
            {offers.map((offer) => (
              <OfferCard key={offer.href + offer.title} offer={offer} />
            ))}
          </div>
        </div>

        {stats && stats.length > 0 && (
          <div className="mt-5 grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-card px-6 py-5">
                <span className="font-heading text-2xl font-bold text-primary">{stat.value}</span>
                <span className="text-sm leading-tight text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
