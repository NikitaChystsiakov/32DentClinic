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
}

export const aggregatorRatings: AggregatorRating[] = [
  {
    id: '103by',
    name: '103.by',
    shortName: 'Каталог медицинских услуг',
    // TODO: подставить ссылку на профиль клиники на 103.by
    href: '#',
    rating: 4.9,
    reviewsCount: 89,
  },
  {
    id: 'yandex',
    name: 'Яндекс Карты',
    shortName: 'Карты и отзывы',
    // TODO: подставить ссылку на профиль клиники в Яндекс.Картах
    href: '#',
    // TODO: подставить реальный рейтинг и количество отзывов
    rating: null,
    reviewsCount: null,
  },
  {
    id: 'google',
    name: 'Google Карты',
    shortName: 'Карты и отзывы',
    // TODO: подставить ссылку на профиль клиники в Google Картах
    href: '#',
    // TODO: подставить реальный рейтинг и количество отзывов
    rating: null,
    reviewsCount: null,
  },
]