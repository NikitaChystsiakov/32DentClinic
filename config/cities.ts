export interface City {
  slug: string
  name: string
  phone: string
  phoneHref: string
  address: string
  coordinates: { lat: number; lng: number }
  image: string
  featureTags: string[]
  seoTitle: string
  seoDescription: string
}

export const cities: City[] = [
  {
    slug: 'minsk',
    name: 'Минск',
    phone: '+375 (29) 323-33-88', 
    phoneHref: 'tel:+375293233388', 
    address: 'г. Минск, Пр. Победителей, 41', 
    coordinates: { lat: 53.914870, lng: 27.535996 }, 
    image: '/clinic/minskMain.webp',
    featureTags: ['Хирургический центр', 'All-on-4 / All-on-6', 'Рассрочка 0%', 'Трансфер'],
    seoTitle: 'Стоматология 32Дент Минск — лечение и имплантация',
    // Не «Собственная лаборатория, гарантия 2 года» (как у остальных городов):
    // в Минске лаборатория — сертифицированный партнёр, а гарантия тройная
    // (см. content/minsk.ts).
    seoDescription:
      '32Дент Минск: терапия, хирургия, ортодонтия и имплантация зубов. Пожизненная гарантия на импланты, до 15 лет на протезы.',
  },
  {
    slug: 'rogachev',
    name: 'Рогачёв',
    phone: '+375 (29) 744-40-33',
    phoneHref: 'tel:+375297444033',
    address: 'г. Рогачёв, ул. Ленина, 60',
    coordinates: { lat: 53.0833, lng: 30.05 },
    image: '/clinic/reception.jpg',
    featureTags: ['Терапия и Ортопедия', 'Рассрочка 0%', 'ул. Ленина, 60'],
    seoTitle: 'Стоматология 32Дент Рогачёв — терапия и имплантация',
    seoDescription: '32Дент Рогачёв: терапия, хирургия, ортодонтия и имплантация зубов. Собственная лаборатория, гарантия 2 года.',
  },
  {
    slug: 'zhlobin',
    name: 'Жлобин',
    phone: '+375 (44) 559-59-01', 
    phoneHref: 'tel:+375445595901', 
    address: 'г. Жлобин, ул. Петровского, 44', 
    coordinates: { lat: 52.8928, lng: 30.0228 },
    image: '/images/services/terapiya.png',
    featureTags: ['Терапия и Эстетика', 'Рассрочка 0%'],
    seoTitle: 'Стоматология 32Дент Жлобин — стоматологическая помощь',
    seoDescription: '32Дент Жлобин: терапия, хирургия и имплантация зубов. Современное оборудование, гарантия 2 года.',
  },
]

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}

export function isValidCitySlug(slug: string): boolean {
  return cities.some((c) => c.slug === slug)
}

export const VALID_CITY_SLUGS = cities.map((c) => c.slug)
