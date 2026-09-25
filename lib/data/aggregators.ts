import type { City } from '@/config/cities'

/*
 * Оценки клиник на сторонних площадках — по городам. Раньше здесь был один
 * список с рогачёвскими данными, и он выводился в шапке, hero и блоке
 * «Оценки на площадках» всех городов: в Минске стояло «4.9 · 89 отзывов на
 * 103.by» со ссылкой на рогачёвский профиль. Это ввод в заблуждение, поэтому
 * данные разложены по городам, а город без записей просто не показывает
 * рейтинг (шапка, hero) и блок площадок.
 *
 * Для не-разработчика: добавить площадку городу — скопировать блок в его
 * массив и подставить ссылку на профиль клиники, оценку и число отзывов.
 * Цифры должны совпадать с площадкой на момент правки — сверять раз в
 * квартал. `rating: null` — оценка не подтверждена, карточка покажет
 * «Рейтинг уточняется»; `reviewsCount: null` — число отзывов не выводится,
 * остаётся только оценка и ссылка «Читать отзывы».
 */

export type AggregatorId = '103by' | 'yandex' | 'google' | '2gis'

export interface AggregatorRating {
  id: AggregatorId
  /** Полное название площадки, выводится в карточке. */
  name: string
  /** Ссылка на страницу отзывов клиники на площадке. */
  href: string
  rating: number | null
  reviewsCount: number | null
  /** Ссылка на форму «оставить отзыв», если у площадки она отдельная. */
  reviewHref?: string
}

const byCity: Record<City['slug'], AggregatorRating[]> = {
  // Рогачёв — единственный город с подтверждёнными профилями (сверено 16.09.2026).
  rogachev: [
    {
      id: '103by',
      name: '103.by',
      href: 'https://32dent.103.by/otzyvy/',
      rating: 4.9,
      reviewsCount: 89,
    },
    {
      id: 'yandex',
      name: 'Яндекс Карты',
      href: 'https://yandex.by/maps/org/32dent/1679633446/reviews/?ll=30.051943%2C53.081320&z=16',
      // TODO: цифры не сверялись с картой — проверить перед релизом
      rating: 4.9,
      reviewsCount: 27,
    },
    {
      id: 'google',
      name: 'Google Карты',
      href: 'https://www.google.com/maps/place/Стоматологический+центр+%2232Дент%22/@53.0811508,30.0518887,17z/data=!4m8!3m7!1s0x46d13481a574ca05:0x646910a9e50222b2!8m2!3d53.0811508!4d30.0518887!9m1!1b1!16s%2Fg%2F11bv30h42d?entry=ttu',
      // TODO: цифры не сверялись с картой — проверить перед релизом
      rating: 4.5,
      reviewsCount: 50,
    },
  ],
  // Минск: профили найдены 25.09.2026. Яндекс (5.0, 19 отзывов) и 2ГИС
  // (5.0, 9 отзывов) — по данным заказчика от 25.09.2026; 103.by — 5.0,
  // число отзывов по выдаче поиска. TODO: сверить 103.by с площадкой.
  minsk: [
    {
      id: '103by',
      name: '103.by',
      href: 'https://32dent-plus.103.by/otzyvy/',
      rating: 5.0,
      reviewsCount: 388,
    },
    {
      id: 'yandex',
      name: 'Яндекс Карты',
      href: 'https://yandex.by/maps/org/32dent_/62123372700/reviews/',
      rating: 5.0,
      reviewsCount: 19,
    },
    {
      id: '2gis',
      name: '2ГИС',
      href: 'https://2gis.by/minsk/firm/70000001042329625/tab/reviews',
      rating: 5.0,
      reviewsCount: 9,
    },
  ],
  // Жлобин: оценок на сайте нет намеренно — отзывов на площадках мало,
  // профиля в Google Картах нет (заказчик, 25.09.2026). Без записей блок
  // «Оценки на площадках» и рейтинг в шапке у города не показываются.
  // Профиль на 103.by: https://32dent-1.103.by/otzyvy/
  zhlobin: [],
}

export function getAggregatorsForCity(citySlug: string): AggregatorRating[] {
  return byCity[citySlug as City['slug']] ?? []
}

/** «388 отзывов», «21 отзыв», «42 отзыва». */
export function reviewsLabel(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  const word =
    mod10 === 1 && mod100 !== 11
      ? 'отзыв'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? 'отзыва'
        : 'отзывов'
  return `${count} ${word}`
}

/** Оценка для вывода: «5.0», «4.9». */
export function formatRating(rating: number) {
  return rating.toFixed(1)
}

/**
 * Основная площадка города для шапки и hero — первая, у которой подтверждены
 * и оценка, и число отзывов: там подпись «5.0 · 388 отзывов на 103.by».
 */
export function getMainRatingForCity(
  citySlug: string
): (AggregatorRating & { rating: number; reviewsCount: number }) | undefined {
  return getAggregatorsForCity(citySlug).find(
    (a): a is AggregatorRating & { rating: number; reviewsCount: number } =>
      a.rating !== null && a.reviewsCount !== null
  )
}
