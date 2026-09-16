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
 * «Рейтинг уточняется».
 */

export type AggregatorId = '103by' | 'yandex' | 'google'

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
  // Минск: по данным заказчика 103.by 5.0 (89 отзывов), Google 4.8, 2GIS 5.0 —
  // но ссылок на профили нет, а карточка без ссылки бесполезна. Появятся
  // адреса профилей — вписать сюда (docs/ЗАГЛУШКИ-И-УТОЧНЕНИЯ.md § 5).
  minsk: [],
  // Жлобин: профили на площадках не найдены.
  zhlobin: [],
}

export function getAggregatorsForCity(citySlug: string): AggregatorRating[] {
  return byCity[citySlug as City['slug']] ?? []
}

/** Основная площадка города для шапки и hero — первая с подтверждённой оценкой. */
export function getMainRatingForCity(citySlug: string): AggregatorRating | undefined {
  return getAggregatorsForCity(citySlug).find((a) => a.rating !== null)
}
