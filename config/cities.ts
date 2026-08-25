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
    phone: '+375 (XX) XXX-XX-XX', // TODO: заполнить позже
    phoneHref: 'tel:+375000000000', // TODO: заполнить позже
    address: 'г. Минск, ул. [TODO], XX', // TODO: заполнить позже
    coordinates: { lat: 53.9, lng: 27.5667 }, // TODO: заполнить позже
    // TODO: заменить на реальное фото клиники в Минске (интерьер, приёмная, фасад)
    image: '/images/services/implantaciya.png',
    featureTags: ['Хирургический центр', 'All-on-4 / All-on-6', 'Рассрочка 0%', 'Трансфер'],
    seoTitle: 'Стоматология 32Дент Минск — лечение и имплантация',
    seoDescription: '32Дент Минск: терапия, хирургия, ортодонтия и имплантация зубов. Собственная лаборатория, гарантия 2 года.',
  },
  {
    slug: 'rogachev',
    name: 'Рогачёв',
    phone: '+375 (29) 744-40-33',
    phoneHref: 'tel:+375297444033',
    address: 'г. Рогачёв, ул. Ленина, 60',
    coordinates: { lat: 53.0833, lng: 30.05 },
    // TODO: заменить на реальное фото клиники в Рогачёве (если hero-clinic.png — это не Рогачёв)
    image: '/images/hero-clinic.png',
    featureTags: ['Терапия и Ортопедия', 'Рассрочка 0%', 'ул. Ленина, 60'],
    seoTitle: 'Стоматология 32Дент Рогачёв — терапия и имплантация',
    seoDescription: '32Дент Рогачёв: терапия, хирургия, ортодонтия и имплантация зубов. Собственная лаборатория, гарантия 2 года.',
  },
  {
    slug: 'zhlobin',
    name: 'Жлобин',
    phone: '+375 (XX) XXX-XX-XX', // TODO: заполнить позже
    phoneHref: 'tel:+375000000000', // TODO: заполнить позже
    address: 'г. Жлобин, ул. [TODO], XX', // TODO: заполнить позже
    coordinates: { lat: 52.8928, lng: 30.0228 }, // TODO: заполнить позже
    // TODO: заменить на реальное фото клиники в Жлобине (интерьер, приёмная, фасад)
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
