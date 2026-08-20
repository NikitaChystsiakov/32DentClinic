// Единый источник правды для всех данных клиники, которые могут измениться
// или уточняются позже ([TBD]). Меняйте значения здесь — они используются
// во всех компонентах сайта (шапка, подвал, контакты, JSON-LD и т.д.).

export const siteConfig = {
  name: '32Дент',
  city: 'Рогачёв',
  address: 'г. Рогачёв, ул. Ленина, 60',
  hoursShort: 'Пн–Сб 8:00–19:00',
  hoursFull: [
    { days: 'Понедельник — Суббота', time: '8:00 – 19:00' },
    { days: 'Воскресенье', time: 'выходной' },
  ],
  // [TBD] — телефон клиники уточняется, использовать плейсхолдер
  phoneDisplay: '+375 (29) 744-40-33',
  phoneHref: 'tel:+375297444033',
  whatsappHref: 'https://wa.me/375297444033',
  viberHref: 'https://viber.com/375297444033',
  telegramHref: 'https://telegram.me/32Дентplus',
  // [TBD] — реквизиты уточняются
  unp: '[TBD]',
  license: '[TBD]',
  // [TBD] — координаты клиники на карте уточняются
  mapCoordinates: { lat: 53.0833, lng: 30.05 },
  // [TBD] — год основания клиники уточняется
  foundedYear: '[TBD]',
  // [TBD] — количество пациентов уточняется
  patientsCount: '[TBD]',
  doctorsCount: 10,
  rating: 4.9,
  reviewsCount: 384,
  reviewsSource: '103.by',
  insurancePartner: 'Белэксимгарант',
  disclaimer: 'Есть противопоказания, необходима консультация специалиста.',
  privacyPolicyHref: '#',
}

export const CONTACTS = {
  phone: "+7 (495) 120-45-67",
  phoneHref: "tel:+74951204567",
  email: "info@32dent.ru",
  emailHref: "mailto:info@32dent.ru",
  whatsapp: "https://wa.me/375297444033",
  telegram: "https://telegram.me/32Дентplus",
  address: "г. Москва, Комсомольский проспект, 24, 7 мин от м. Фрунзенская",
  hours: "Пн–Сб: 9:00–21:00 · Вс: 10:00–18:00",
}

export const navLinks = [
  { label: 'Услуги', href: '/uslugi/' },
  { label: 'Врачи', href: '/vrachi/' },
  { label: 'Цены', href: '/ceny/' },
  { label: 'Примеры работ', href: '/primery-rabot/' },
  { label: 'О нас', href: '/o-nas/' },
  { label: 'Контакты', href: '/kontakty/' },
]
