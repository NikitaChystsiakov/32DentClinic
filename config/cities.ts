// Справочник клиник сети. Одна запись = один город. Всё, что зависит от
// города (телефон, адрес, координаты карты, SEO-заголовки, реквизиты
// юрлица), правится здесь — компоненты подставляют значения сами.
//
// Для не-разработчика: меняйте только текст в кавычках и числа, не трогая
// названия полей слева от двоеточия. Строки с [TBD] — то, что клиника ещё
// не прислала; до публикации их нужно заменить настоящими данными.

/**
 * Реквизиты юридического лица, от имени которого работает клиника города.
 * Выводятся в подвале сайта (требование Закона «О защите прав потребителей»
 * и ст. 10 Закона «О рекламе») и в юридических документах. Если у всех
 * городов одно юрлицо — просто скопируйте один и тот же блок во все три.
 */
export interface CityLegal {
  /** Полное наименование: «ООО «Медита»» или «ИП Иванов Иван Иванович». */
  entityName: string
  /** Учётный номер плательщика, 9 цифр. */
  unp: string
  /** Юридический адрес — может отличаться от адреса клиники. */
  legalAddress: string
  /**
   * E-mail для обращений по персональным данным (отзыв согласия, запрос
   * информации). Лучше корпоративный ящик на своём домене, а не gmail:
   * почта Google — это передача данных в США.
   */
  privacyEmail: string
  /** Лицензия Минздрава на медицинскую деятельность. */
  license: {
    number: string
    /** Дата выдачи в формате ДД.ММ.ГГГГ. */
    issuedAt: string
    issuedBy: string
    /** Срок действия; если лицензия бессрочная — оставьте пустую строку. */
    validUntil: string
  }
}

export interface City {
  slug: string
  name: string
  /** Предложный падеж для фраз «стоматология в …»: «Минске». */
  nameIn: string
  phone: string
  phoneHref: string
  address: string
  coordinates: { lat: number; lng: number }
  image: string
  featureTags: string[]
  /**
   * Принимает ли клиника заявки через форму на сайте. Если false — все
   * кнопки «Записаться» на страницах города превращаются в ссылку
   * «Позвонить» на phoneHref (см. components/booking-button.tsx), а сам
   * город не предлагается в форме на страницах сети.
   */
  hasBookingForm: boolean
  seoTitle: string
  seoDescription: string
  legal: CityLegal
}

export const cities: City[] = [
  {
    slug: 'minsk',
    name: 'Минск',
    nameIn: 'Минске',
    phone: '+375 (29) 323-33-88', 
    phoneHref: 'tel:+375293233388', 
    address: 'г. Минск, Пр. Победителей, 41', 
    coordinates: { lat: 53.914870, lng: 27.535996 }, 
    image: '/clinic/minskMain.webp',
    hasBookingForm: true,
    featureTags: ['Хирургический центр', 'All-on-4 / All-on-6', 'Рассрочка 0%', 'Трансфер'],
    seoTitle: 'Стоматология 32Дент Минск — лечение и имплантация',
    // Не «Собственная лаборатория, гарантия 2 года» (как у остальных городов):
    // в Минске лаборатория — сертифицированный партнёр, а гарантия тройная
    // (см. content/minsk.ts).
    seoDescription:
      '32Дент Минск: терапия, хирургия, ортодонтия и имплантация зубов. Пожизненная гарантия производителя на импланты, до 15 лет на протезы.',
    // [TBD] — реквизиты уточняются у клиники, см. docs/ГДЕ-ЧТО-МЕНЯТЬ.md
    legal: {
      entityName: '[TBD] ООО «…»',
      unp: '[TBD]',
      legalAddress: '[TBD]',
      privacyEmail: '[TBD]',
      license: {
        number: '[TBD]',
        issuedAt: '[TBD]',
        issuedBy: 'Министерство здравоохранения Республики Беларусь',
        validUntil: '',
      },
    },
  },

  {
    slug: 'rogachev',
    name: 'Рогачёв',
    nameIn: 'Рогачёве',
    phone: '+375 (29) 744-40-33',
    phoneHref: 'tel:+375297444033',
    address: 'г. Рогачёв, ул. Ленина, 60',
    coordinates: { lat: 53.0833, lng: 30.05 },
    image: '/clinic/reception.jpg',
    // Рогачёв принимает записи только по телефону — по просьбе клиники.
    hasBookingForm: false,
    featureTags: ['Терапия и Ортопедия', 'Рассрочка 0%', 'ул. Ленина, 60'],
    seoTitle: 'Стоматология 32Дент Рогачёв — терапия и имплантация',
    seoDescription: '32Дент Рогачёв: терапия, хирургия, ортодонтия и имплантация зубов. Собственная лаборатория, гарантия 2 года.',
    // [TBD] — реквизиты уточняются у клиники, см. docs/ГДЕ-ЧТО-МЕНЯТЬ.md
    legal: {
      entityName: '[TBD] ООО «…»',
      unp: '[TBD]',
      legalAddress: '[TBD]',
      privacyEmail: '[TBD]',
      license: {
        number: '[TBD]',
        issuedAt: '[TBD]',
        issuedBy: 'Министерство здравоохранения Республики Беларусь',
        validUntil: '',
      },
    },
  },

  {
    slug: 'zhlobin',
    name: 'Жлобин',
    nameIn: 'Жлобине',
    phone: '+375 (44) 559-59-01', 
    phoneHref: 'tel:+375445595901', 
    address: 'г. Жлобин, ул. Петровского, 44', 
    coordinates: { lat: 52.8928, lng: 30.0228 },
    image: '/images/services/terapiya.webp',
    hasBookingForm: true,
    featureTags: ['Терапия и Эстетика', 'Рассрочка 0%'],
    seoTitle: 'Стоматология 32Дент Жлобин — стоматологическая помощь',
    seoDescription: '32Дент Жлобин: терапия, хирургия и имплантация зубов. Современное оборудование, гарантия 2 года.',
    // [TBD] — реквизиты уточняются у клиники, см. docs/ГДЕ-ЧТО-МЕНЯТЬ.md
    legal: {
      entityName: '[TBD] ООО «…»',
      unp: '[TBD]',
      legalAddress: '[TBD]',
      privacyEmail: '[TBD]',
      license: {
        number: '[TBD]',
        issuedAt: '[TBD]',
        issuedBy: 'Министерство здравоохранения Республики Беларусь',
        validUntil: '',
      },
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
