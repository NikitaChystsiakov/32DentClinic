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

export interface TownFaqItem {
  question: string
  answer: string
}

export interface TownContent {
  metaTitle: string
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
