// Оценки клиники на сторонних площадках (агрегаторах).
// 103.by — подтверждённые данные: 4.9★ и 89 отзывов.
// TODO: подставить реальные данные для Яндекс.Карт и Google Карт, когда они подтвердятся.
// rating: null означает, что оценка пока не подтверждена — карточка выводит плейсхолдер.

export type AggregatorId = '103by' | 'yandex' | 'google'

export interface AggregatorRating {
  id: AggregatorId
  // Полное название площадки, выводится в карточке
  name: string
  // Короткая подпись под рейтингом
  shortName: string
  href: string
  rating: number | null
  reviewsCount: number | null
  ratingsCount?: number
}

export const aggregatorRatings: AggregatorRating[] = [
  {
    id: '103by',
    name: '103.by',
    shortName: 'Каталог медицинских услуг',
    // TODO: подставить ссылку на профиль клиники на 103.by
    href: 'https://32dent.103.by/otzyvy/',
    rating: 4.9,
    reviewsCount: 89,
  },
  {
    id: 'yandex',
    name: 'Яндекс Карты',
    shortName: 'Карты и отзывы',
    // TODO: подставить ссылку на профиль клиники в Яндекс.Картах
    href: 'https://yandex.by/maps/org/32dent/1679633446/reviews/?ll=30.051943%2C53.081320&z=16',
    // TODO: подставить реальный рейтинг и количество отзывов
    rating: 4.9,
    reviewsCount: 27,
    ratingsCount: 115,
  },
  {
    id: 'google',
    name: 'Google Карты',
    shortName: 'Карты и отзывы',
    // TODO: подставить ссылку на профиль клиники в Google Картах
    href: 'https://www.google.com/maps/place/Стоматологический+центр+%2232Дент%22/@53.0811508,30.0518887,17z/data=!4m8!3m7!1s0x46d13481a574ca05:0x646910a9e50222b2!8m2!3d53.0811508!4d30.0518887!9m1!1b1!16s%2Fg%2F11bv30h42d?entry=ttu&g_ep=EgoyMDI2MDgxNi4wIKXMDSoASAFQAw%3D%3D',
    // TODO: подставить реальный рейтинг и количество отзывов
    rating: 4.5,
    reviewsCount: 50,
  },
]