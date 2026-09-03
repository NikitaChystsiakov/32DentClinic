// Круглый вращающийся бейдж рядом с CTA в hero: ring — текст по окружности,
// в центре — крупное значение и подпись.
export interface HeroBadge {
  ring: string
  centerValue: string
  centerLabel: string
}

// Карточка предложения в правой колонке hero. oldPrice опционален —
// без него цена выводится без зачёркнутой.
export interface HeroOffer {
  title: string
  description: string
  image: string
  price: string
  oldPrice?: string
  href: string
  /** Плашка над заголовком карточки, например «Горячее предложение». */
  tag?: string
}

// Короткий анонс акции в нижней полосе шапки. Меняется по городам.
export interface CityPromo {
  text: string
  href: string
}

/**
 * Активная акция для hero: бейдж срочности над заголовком и обратный отсчёт
 * рендерятся, только если это поле задано (см. hero-split.tsx). Пока акции
 * нет — просто не указывайте `promo` в конфиге города, а не гасите бейдж
 * закомментированной датой или флагом.
 */
export interface HeroPromo {
  /** Текст бейджа срочности, например «Только в сентябре». */
  badge: string
  /** ISO-дата и время окончания — из неё считается «Осталось Nд Nч». */
  endsAt: string
}

export interface TreatmentTimelineStep {
  step: number
  duration: string
  title: string
  description: string
  icon: string
  isMilestone?: boolean
  photo?: string
}

export interface TreatmentTimelineGapLabel {
  afterStep: number
  label: string
  icon?: string
}

export interface TreatmentTimeline {
  steps: TreatmentTimelineStep[]
  gapLabels?: TreatmentTimelineGapLabel[]
}
