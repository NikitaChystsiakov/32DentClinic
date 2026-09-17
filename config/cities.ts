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

/** Одно фото интерьера: путь в public/ и подпись для alt (с названием клиники). */
export interface ClinicPhoto {
  src: string
  alt: string
}

/**
 * Фотографии клиники города. Лежат в public/clinic/<slug>/ — у каждого
 * города своя папка, чтобы интерьер одной клиники не выдавался за другую.
 * Свои снимки есть у Рогачёва и Жлобина; Минску, пока он не прислал свои,
 * подставляется набор Рогачёва (rogachevPhotos ниже) — это временно,
 * см. docs/ИЗОБРАЖЕНИЯ-СГЕНЕРИРОВАТЬ.md.
 */
export interface CityPhotos {
  /** Фон первого экрана главной города. Декоративный, лежит под градиентом. */
  hero: string
  /**
   * Плитки галереи «Территория 32Дент» на главной. Первая — крупная 2×2,
   * остальные по одной; сетка из 4 колонок, так что ровно заполняют её
   * 1 + 4 фото.
   */
  gallery: ClinicPhoto[]
}

export interface City {
  slug: string
  name: string
  /** Предложный падеж для фраз «стоматология в …»: «Минске». */
  nameIn: string
  /**
   * Как называется клиника города в заголовках страниц (title, H1).
   * Минская клиника — «32Дент+», остальные — «32Дент». Логотип, футер и
   * хаб используют общее название сети из lib/site-config.ts.
   */
  brandName: string
  phone: string
  phoneHref: string
  address: string
  /**
   * E-mail клиники для пациентов — на странице контактов, в подвале и в
   * мобильном меню. Не указан — строка не показывается. (Ящик для обращений
   * по персональным данным — отдельно, legal.privacyEmail.)
   */
  email?: string
  /**
   * Instagram клиники — полная ссылка: 'https://www.instagram.com/32_dent_plus/'.
   * Не указан — иконка не показывается.
   */
  instagram?: string
  /*
   * Мессенджеры. У каждого города всегда четыре кнопки: Viber, Telegram,
   * WhatsApp, MAX (lib/messengers.ts). Viber — всегда на телефоне города.
   * Поля ниже — переопределения; пустое поле = значение по умолчанию.
   */
  /**
   * Telegram клиники — полная ссылка: 'https://t.me/Dent32plus' или по
   * номеру 'https://t.me/+375291234567'. Пусто — Telegram сети
   * (lib/site-config.ts).
   */
  telegram?: string
  /**
   * Номер WhatsApp в международном формате: '+375291234567'.
   * Пусто — телефон города.
   */
  whatsapp?: string
  /**
   * Ссылка на чат клиники в MAX: 'https://max.ru/…'. Пусто — сайт
   * мессенджера (siteConfig.maxHref), пока заказчик не пришлёт ссылки.
   */
  max?: string
  coordinates: { lat: number; lng: number }
  /** Обложка карточки города на хабе (главная сети). */
  image: string
  photos: CityPhotos
  /**
   * Короткие «плюшки» клиники. Сейчас нигде не выводятся: на хабе вместо
   * них — список услуг города (config/services.ts, availableIn). Оставлены
   * на будущее, можно использовать в карточках или в SEO-текстах.
   */
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

/**
 * Фото интерьера Рогачёва. Минск берёт их же, пока клиника не пришлёт свои:
 * так уже было до раскладки по папкам, менять на этом этапе не стали.
 * Для Минска подпись «лаборатория» неточна — там лаборатория партнёрская.
 */
const rogachevPhotos: CityPhotos = {
  hero: '/clinic/rogachev/reception.jpg',
  gallery: [
    { src: '/clinic/rogachev/reception.jpg', alt: 'Ресепшн клиники 32Дент' },
    { src: '/clinic/rogachev/office.jpg', alt: 'Лечебный кабинет 32Дент' },
    { src: '/clinic/rogachev/equipment.jpg', alt: 'Оборудование клиники 32Дент' },
    { src: '/clinic/rogachev/office2.jpg', alt: 'Холл клиники 32Дент' },
    { src: '/clinic/rogachev/laboratory.jpg', alt: 'Зуботехническая лаборатория 32Дент' },
  ],
}

/**
 * Фото жлобинской клиники — кадры из слайдера заказчика (17.09.2026),
 * обрезаны от элементов интерфейса. Исходники — в assets/clinic/zhlobin-src.
 * Ещё три кадра из того же набора (treatment, office, sign) стоят на
 * странице «О нас» (content/zhlobin.ts → about) — здесь их не дублируем.
 */
const zhlobinPhotos: CityPhotos = {
  hero: '/clinic/zhlobin/reception.webp',
  gallery: [
    { src: '/clinic/zhlobin/reception.webp', alt: 'Ресепшн клиники 32Дент в Жлобине' },
    { src: '/clinic/zhlobin/sign.webp', alt: 'Вывеска 32Дент в холле клиники' },
    { src: '/clinic/zhlobin/hall.webp', alt: 'Холл клиники и коридор к кабинетам' },
    { src: '/clinic/zhlobin/office.webp', alt: 'Лечебный кабинет: врач на приёме' },
    { src: '/clinic/zhlobin/doctor-at-work.webp', alt: 'Врач 32Дент за работой' },
  ],
}

export const cities: City[] = [
  {
    slug: 'minsk',
    name: 'Минск',
    nameIn: 'Минске',
    brandName: '32Дент+',
    phone: '+375 (29) 323-33-88', 
    phoneHref: 'tel:+375293233388', 
    address: 'г. Минск, Пр. Победителей, 41',
    // E-mail — с карточки заказчика от 17.09.2026. Telegram — @Dent32plus
    // («Стоматология 32 Dent+», проверено 17.09.2026); WhatsApp и Viber —
    // на телефоне города.
    email: '32dentplus@gmail.com',
    // [TBD] Instagram (в аудите — @32_dent_plus, заказчик не подтвердил).
    instagram: undefined,
    telegram: 'https://t.me/Dent32plus',
    whatsapp: undefined,
    max: undefined, // [TBD] ссылка чата в MAX
    coordinates: { lat: 53.914870, lng: 27.535996 }, 
    image: '/clinic/minsk/main.webp',
    // Своих фото интерьера пока нет (присланные скрины из Instagram в
    // assets/clinic/minsk-insta для сайта не годятся) — временно Рогачёв.
    photos: rogachevPhotos,
    hasBookingForm: true,
    featureTags: ['Хирургический центр', 'All-on-4 / All-on-6', 'Трансфер'],
    seoTitle: 'Стоматология 32Дент+ Минск — лечение и имплантация',
    // Не «Собственная лаборатория, гарантия 2 года» (как у остальных городов):
    // в Минске лаборатория — сертифицированный партнёр, а гарантия тройная
    // (см. content/minsk.ts).
    seoDescription:
      '32Дент+ Минск: терапия, хирургия, ортодонтия и имплантация зубов. Пожизненная гарантия производителя на импланты, до 15 лет на протезы.',
    // Юрлицо и УНП — из данных заказчика; юрадрес, e-mail и лицензия — [TBD], см. docs/ЗАГЛУШКИ-И-УТОЧНЕНИЯ.md
    legal: {
      entityName: 'ООО «Медита»',
      unp: '100083105',
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
    brandName: '32Дент',
    // Код (44), а не (29): так на карточке контактов заказчика от 17.09.2026
    // (телефон, Viber и Telegram — один номер). Прежний (29) был с [TBD].
    phone: '+375 (44) 744-40-33',
    phoneHref: 'tel:+375447444033',
    address: 'г. Рогачёв, ул. Ленина, 60',
    // E-mail — с карточки заказчика от 17.09.2026. Telegram там — по
    // номеру клиники ([TBD] заказчик уточнит); Viber и WhatsApp — на
    // телефоне города.
    email: '32dent.stoma@gmail.com',
    // [TBD] Instagram — заказчик не прислал.
    instagram: undefined,
    telegram: 'https://t.me/+375447444033',
    whatsapp: undefined,
    max: undefined, // [TBD] ссылка чата в MAX
    // Координаты клиники (ул. Ленина, 60) — с карточки 32Дент на 103.by,
    // сверено 16.09.2026. Раньше стояло округлённое значение центра города.
    coordinates: { lat: 53.0813, lng: 30.0519 },
    image: '/clinic/rogachev/reception.jpg',
    photos: rogachevPhotos,
    // Рогачёв принимает записи только по телефону: администраторы не
    // обрабатывают заявки с сайта, на это жаловались пациенты, и 15.09.2026
    // заказчик попросил закрыть форму. Кнопки «Записаться» на страницах
    // города превращаются в «Позвонить», в общей форме (главная, блог)
    // города нет в списке клиник, калькулятор контакты не собирает.
    hasBookingForm: false,
    featureTags: ['Терапия и Ортопедия', 'ул. Ленина, 60'],
    seoTitle: 'Стоматология 32Дент Рогачёв — терапия и имплантация',
    seoDescription: '32Дент Рогачёв: терапия, хирургия, протезирование и имплантация зубов. Собственная лаборатория, гарантия 2 года.',
    // Юрлицо и УНП — из данных заказчика; юрадрес, e-mail и лицензия — [TBD], см. docs/ЗАГЛУШКИ-И-УТОЧНЕНИЯ.md
    legal: {
      entityName: 'ООО «32Дент»',
      unp: '491240607',
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
    brandName: '32Дент',
    phone: '+375 (44) 559-59-01', 
    phoneHref: 'tel:+375445595901', 
    address: 'г. Жлобин, ул. Петровского, 44',
    // E-mail — с карточки заказчика от 17.09.2026. Viber и WhatsApp — на
    // телефоне города; Telegram — [TBD] заказчик уточнит, пока сети.
    email: 'expert32dent@gmail.com',
    // [TBD] Instagram — заказчик не прислал.
    instagram: undefined,
    telegram: undefined,
    whatsapp: undefined,
    max: undefined, // [TBD] ссылка чата в MAX
    // Координаты дома ул. Петровского, 44 — по OpenStreetMap и карточке
    // 32Дент на 103.by (сверено 16.09.2026). Прежние 52.8928, 30.0228
    // указывали на ул. Красина, 50 — на 900 м мимо клиники, и карта на
    // контактах ставила метку не там. Клиника — в 200 м от ж/д вокзала
    // (ул. Урицкого, 27) и в 300 м от автовокзала (ул. Урицкого, 68): на
    // это опирается страница /svetlogorsk.
    coordinates: { lat: 52.8919, lng: 30.0358 },
    image: '/clinic/zhlobin/reception.webp',
    photos: zhlobinPhotos,
    hasBookingForm: true,
    featureTags: ['Терапия и Эстетика'],
    seoTitle: 'Стоматология 32Дент Жлобин — стоматологическая помощь',
    seoDescription: '32Дент Жлобин: терапия, хирургия и имплантация зубов. Современное оборудование, гарантия 2 года.',
    // Юрлицо и УНП — по карточкам клиники на 103.by и relax.by (16.09.2026), заказчик подтвердил; юрадрес, e-mail и лицензия — [TBD], см. docs/ЗАГЛУШКИ-И-УТОЧНЕНИЯ.md
    legal: {
      entityName: 'ООО «32 Дент-Эксперт»',
      unp: '491502772',
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
