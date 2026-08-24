export interface City {
  slug: string
  name: string
  phone: string
  phoneHref: string
  address: string
  coordinates: { lat: number; lng: number }
  features: {
    hasSurgery: boolean
    hasQuiz: boolean
    hasTransfer: boolean
  }
}

export const cities: City[] = [
  {
    slug: 'minsk',
    name: 'Минск',
    phone: '+375 (XX) XXX-XX-XX', // TODO: заполнить позже
    phoneHref: 'tel:+375000000000', // TODO: заполнить позже
    address: 'г. Минск, ул. [TODO], XX', // TODO: заполнить позже
    coordinates: { lat: 53.9, lng: 27.5667 }, // TODO: заполнить позже
    features: {
      hasSurgery: true,
      hasQuiz: true,
      hasTransfer: true,
    },
  },
  {
    slug: 'rogachev',
    name: 'Рогачёв',
    phone: '+375 (29) 744-40-33',
    phoneHref: 'tel:+375297444033',
    address: 'г. Рогачёв, ул. Ленина, 60',
    coordinates: { lat: 53.0833, lng: 30.05 },
    features: {
      hasSurgery: true,
      hasQuiz: true,
      hasTransfer: false,
    },
  },
  {
    slug: 'zhlobin',
    name: 'Жлобин',
    phone: '+375 (XX) XXX-XX-XX', // TODO: заполнить позже
    phoneHref: 'tel:+375000000000', // TODO: заполнить позже
    address: 'г. Жлобин, ул. [TODO], XX', // TODO: заполнить позже
    coordinates: { lat: 52.8928, lng: 30.0228 }, // TODO: заполнить позже
    features: {
      hasSurgery: true,
      hasQuiz: false,
      hasTransfer: false,
    },
  },
]

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}

export function isValidCitySlug(slug: string): boolean {
  return cities.some((c) => c.slug === slug)
}

export const VALID_CITY_SLUGS = cities.map((c) => c.slug)
