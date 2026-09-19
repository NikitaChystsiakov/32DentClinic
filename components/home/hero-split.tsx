'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Flame } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import type { HeroBadge, HeroOffer, HeroPromo } from '@/content/types'
import { usePromoCountdown } from '@/lib/hero-schedule'

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
   * Активная акция: бейдж срочности («Только в сентябре») и дата окончания.
   * Отсчёт «Осталось 13д 7ч» считается в браузере (usePromoCountdown) — сайт
   * статический, на сборке актуального времени нет. Пока акция не началась
   * или уже прошла, ни бейдж, ни таймер не рендерятся.
   */
  promo?: HeroPromo
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
        // Белый диск, а не bg-primary: hero теперь сам синий, и синий бейдж
        // на нём переставал читаться как отдельный объект.
        'relative size-26 shrink-0 rounded-full bg-white text-(--brand-ink) shadow-xl ring-4 ring-white/35',
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
        <text className="fill-(--brand-ink)/75 text-[7.5px] font-semibold uppercase">
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
        <span className="mt-0.5 text-[11px] tracking-wide text-(--brand-ink)/70">{badge.centerLabel}</span>
      </div>
    </div>
  )
}

function OfferCard({ offer }: { offer: HeroOffer }) {
  return (
    // Светлая карточка на фоне синей левой: вся секция перестаёт быть одним
    // сплошным цветным блоком, а «чистый» белый работает на ощущение клиники.
    // Кликабельна вся карточка, а не только «Подробнее»: ссылка одна на весь
    // блок, а сама кнопка — оформленный span. Так не появляется вложенных
    // ссылок и не нужен перекрывающий оверлей, который отбирал бы выделение
    // текста; кнопка при этом реагирует на наведение по всей карточке через
    // group-hover.
    <Link
      href={offer.href}
      className="group relative flex flex-1 flex-col overflow-hidden rounded-3xl bg-[linear-gradient(140deg,var(--card),var(--panel-sky))] p-6 text-card-foreground ring-1 ring-primary/12 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/30 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
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
          className="object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="relative flex max-w-[54%] flex-1 flex-col gap-2">
        {offer.tag && (
          <span className="w-fit rounded-md bg-secondary px-2 py-1 text-[11px] font-bold tracking-wide text-secondary-foreground uppercase">
            {offer.tag}
          </span>
        )}
        <h2 className="font-heading text-xl leading-tight font-bold text-balance text-foreground">
          {offer.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{offer.description}</p>

        <div className="mt-auto flex flex-col items-start gap-3 pt-5">
          <span className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-primary">{offer.price}</span>
            {offer.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">{offer.oldPrice}</span>
            )}
          </span>
          <span
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'group-hover:-translate-y-px'
            )}
          >
            Подробнее
          </span>
        </div>
      </div>
    </Link>
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
  promo,
  stats,
}: HeroSplitProps) {
  const countdown = usePromoCountdown(promo?.endsAt)
  const urgencyBadge = countdown ? promo?.badge : undefined

  return (
    // Hero намеренно шире остальных секций и с меньшими полями: на ноутбучных
    // экранах (1280–1600) он идёт почти впритык к краям, упираясь в потолок
    // только на очень широких мониторах.
    //
    // Высота — ровно первый экран: 100svh минус залипающая шапка (--header-h,
    // см. globals.css). svh, а не vh, — на телефоне vh считается по свёрнутой
    // адресной строке, и низ секции уезжал под неё. Это min-height, поэтому
    // если контент выше экрана (узкий телефон), секция просто вырастет.
    <section className="flex min-h-[calc(100svh-var(--header-h))] flex-col px-3 py-6 sm:px-4 lg:px-6">
      <div className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col">
        {/* Ширину сначала забирает правая колонка (clamp), большая карточка
            получает остаток. Ниже lg сетка перестраивается: большая карточка
            во всю ширину, два оффера — рядом под ней. flex-1 отдаёт сетке всю
            свободную высоту секции (строка метрик забирает своё снизу), а
            grid-rows-[1fr] уравнивает обе колонки по этой высоте. Пустоты
            внутри карточек не появляется: контент в них центрирован, а цена с
            кнопкой прижаты к низу через mt-auto. */}
        <div className="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_clamp(25rem,32vw,34rem)] lg:grid-rows-[1fr]">
          {/* Левая карточка: предложение месяца */}
          <div
            data-variant="dark"
            className="relative overflow-hidden rounded-3xl bg-[linear-gradient(125deg,var(--hero-surface),var(--hero-surface-accent))] p-6 sm:p-8 lg:p-10"
          >
            {/* Два мягких пятна поверх ровного градиента: голубое сверху и
                бирюзовое снизу. Оба сильно прозрачные — они добавляют глубины,
                не затемняя фон (затемнение как раз и просили убрать). */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(255,255,255,0.28),transparent_45%),radial-gradient(circle_at_78%_112%,color-mix(in_oklch,var(--secondary),transparent_55%),transparent_55%)]"
            />
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
                <>
                  {/* Колонка скрыта ниже sm, но <img> браузер скачал бы всё
                      равно, а с preload — ещё и раньше H1: на телефоне это
                      175 КБ впустую до LCP. Поэтому картинка lazy (в
                      display:none такие не грузятся), а на широких экранах
                      её заранее тянет preload с media-условием — React
                      поднимает <link> в <head>. */}
                  <link
                    rel="preload"
                    as="image"
                    href={photo.src}
                    media="(min-width: 640px)"
                    fetchPriority="high"
                  />
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 46vw, 52vw"
                    className="object-contain object-bottom drop-shadow-2xl"
                  />
                </>
              )}
            </div>

            {/* От sm — свободный угол над фото, бейдж можно позиционировать
                абсолютно. На узких экранах там же начинаются плашки тегов,
                поэтому ниже sm бейдж встаёт в их ряд как ещё один элемент. */}
            {countdown && (
              <span className="absolute top-5 right-5 z-10 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur sm:flex">
                <Flame className="size-3.5 text-secondary" />
                {countdown}
              </span>
            )}

            {/* Высоту левой карточки задаёт правая колонка, поэтому контент
                центрируем: иначе весь запас воздуха собирается под кнопкой. */}
            <div className="relative flex h-full flex-col justify-center gap-5 sm:max-w-[52%] lg:max-w-[60%]">
              {(urgencyBadge || (tags && tags.length > 0) || countdown) && (
                <div className="flex flex-wrap gap-2">
                  {urgencyBadge && (
                    <span className="rounded-md bg-secondary px-3 py-1.5 text-xs font-bold tracking-wide text-secondary-foreground uppercase">
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
                      <Flame className="size-3.5 text-secondary" />
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
                  <li key={highlight} className="flex items-start gap-3 text-white/95">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-(--brand-ink)">
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
                <BookingButton size="lg" variant="inverse">
                  Записаться
                  <ArrowRight data-icon="inline-end" />
                </BookingButton>
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
          <div className="mt-5 grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-3">
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
