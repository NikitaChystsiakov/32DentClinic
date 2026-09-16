// Структура текстов посадочной страницы «соседнего» города (см.
// config/nearby-towns.ts). Одинаковая для всех городов; сами тексты — в
// content/towns/<город>.ts и должны быть у каждого города свои. Одна и та же
// болванка с заменённым названием — это «дорвей», поисковики такие страницы
// не ранжируют, а могут понизить и весь сайт.

export interface TownReason {
  title: string
  description: string
  /** Имя иконки из lucide-react, см. iconMap в components/town/town-reasons.tsx. */
  icon: string
}

/**
 * Услуга-приманка на странице города. Название, цена и ссылка берутся из
 * config/services.ts по slug — здесь только подпись, объясняющая, как
 * услуга укладывается в поездку из другого города.
 */
export interface TownFeaturedService {
  /** slug категории из config/services.ts. */
  slug: string
  /** Одна фраза: сколько визитов, что можно совместить. */
  note: string
}

/** Как доехать до конкретной клиники сети. */
export interface TownRoute {
  /** slug клиники из config/cities.ts — та же, что в nearby-towns.ts. */
  clinicSlug: string
  /** Чем эта клиника хороша именно для приезжих: короткая подпись. */
  summary: string
  car: string
  publicTransport: string
  parking?: string
}

/** Один шаг плана поездки «за один день»: время, что происходит. */
export interface TownTripStep {
  /** «6:20», «~7:05», «после 17:00» — как удобно читать, не парсится. */
  time: string
  title: string
  description: string
}

export interface TownFaqItem {
  question: string
  answer: string
}

export interface TownContent {
  /**
   * Title страницы целиком, вместе с брендом: шаблон « | 32Дент» к нему
   * не добавляется (см. generateMetadata в app/[city]/layout.tsx).
   * Держите в 55–60 знаках, иначе поисковик обрежет.
   */
  metaTitle: string
  /** До ~158 знаков: длиннее Google обрезает многоточием. */
  metaDescription: string

  hero: {
    /** Строка над заголовком: «Пациентам из Светлогорска». */
    eyebrow: string
    title: string
    subtitle: string
    /** Три коротких тезиса под подзаголовком. */
    highlights: string[]
  }

  /** Почему стоит ехать: честный абзац о расстоянии и о том, что получаете взамен. */
  intro: {
    title: string
    paragraphs: string[]
  }

  reasons: {
    title: string
    subtitle: string
    items: TownReason[]
  }

  featuredServices: {
    title: string
    subtitle: string
    items: TownFeaturedService[]
  }

  /**
   * Поездка за один день по шагам — необязательный блок. Расписания
   * транспорта меняются, поэтому время пишите «около», а в note давайте
   * ссылку, где сверить (например, pass.rw.by).
   */
  tripPlan?: {
    title: string
    subtitle: string
    steps: TownTripStep[]
    note?: string
  }

  route: {
    title: string
    subtitle: string
    clinics: TownRoute[]
  }

  faq: {
    subtitle: string
    items: TownFaqItem[]
  }
}
