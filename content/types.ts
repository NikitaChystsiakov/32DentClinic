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

/**
 * Видеообзор клиники для главной и «О нас» (см. clinic-video-section.tsx).
 * Ролик тяжёлый, поэтому на страницу кладётся только постер: сам файл
 * подгружается по клику на play. Города без ролика поле не задают — блок
 * тогда не рендерится вовсе.
 */
export interface ClinicVideo {
  /** Путь к mp4 (H.264 + AAC, faststart) в public/video. */
  src: string
  /** Кадр-обложка 16:9, показывается до клика. */
  poster: string
  /** Описание для alt постера и aria-label кнопки play. */
  alt: string
  /** Длительность подписью на постере, например «1:11». */
  duration: string
  /** Заголовок и подводка блока — свои у каждого города. */
  title: string
  description: string
  /** Что человек увидит в ролике, 3 коротких пункта. */
  highlights: string[]
}

/**
 * Бриф на реальное фото клиники. Пока фото не сняли, на его месте
 * рендерится PhotoPlaceholder с этим текстом — так съёмочный лист виден
 * прямо на странице, а не теряется в задачах. Появилось фото — добавьте
 * `src`, и заглушка сама сменится на картинку (см. about-content.tsx).
 */
export interface AboutPhoto {
  /** Что именно снять: ракурс, что в кадре, чего избегать. */
  hint: string
  /** Рекомендуемый минимальный размер исходника, px. */
  width: number
  height: number
  /** Путь к готовому фото. Пока не задан — показывается заглушка. */
  src?: string
}

/** Короткая цифра-факт в шапке страницы: значение + расшифровка. */
export interface AboutStat {
  value: string
  label: string
}

/** Карточка принципа клиники: чем она отличается именно в этом городе. */
export interface AboutPrinciple {
  title: string
  description: string
  /** Имя иконки из lucide-react, см. iconMap в about-content.tsx. */
  icon: string
}

/** Текстовый блок с фотографией: история, оборудование, лаборатория. */
export interface AboutBlock {
  title: string
  paragraphs: string[]
  photo: AboutPhoto
}

/**
 * Контент страницы «О нас». Структура одинаковая во всех городах, а текст
 * и фотографии — разные: у Минска хирургический центр и лаборатория-партнёр,
 * у Рогачёва и Жлобина — своя история и другой набор аргументов.
 */
export interface AboutSection {
  eyebrow: string
  title: string
  description: string
  heroPhoto: AboutPhoto
  /** Цифры-факты города. Количество врачей секция считает сама. */
  stats: AboutStat[]
  history: AboutBlock
  principles: {
    title: string
    subtitle: string
    items: AboutPrinciple[]
  }
  equipment: AboutBlock
  laboratory: AboutBlock
  team: {
    title: string
    description: string
  }
  insurance: {
    title: string
    description: string
  }
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

/** Одна карточка гарантии: крупное значение, на что действует, условие. */
export interface GuaranteeItem {
  value: string
  label: string
  description: string
  /** Имя иконки из lucide-react, см. iconMap в guarantee-section.tsx. */
  icon: string
}

/**
 * Блок «Гарантия» на главной. У Минска — тройная (импланты, работа врача,
 * протезы), у Рогачёва и Жлобина — 2 года на всё плюс гарантия производителя
 * на сами импланты; поэтому набор карточек задаётся в контенте города.
 */
export interface GuaranteeSection {
  eyebrow: string
  title: string
  subtitle: string
  items: GuaranteeItem[]
  /** Подпись под карточками: где закреплены условия. */
  note: string
}
