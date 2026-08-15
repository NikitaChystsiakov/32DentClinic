// Единый источник правды для всех данных клиники, которые могут измениться
// или уточняются позже ([TBD]). Меняйте значения здесь — они используются
// во всех компонентах сайта (шапка, подвал, контакты, JSON-LD и т.д.).

export const siteConfig = {
  name: 'Dent32',
  city: 'Рогачёв',
  address: 'г. Рогачёв, ул. Ленина, 60',
  hoursShort: 'Пн–Сб 8:00–19:00',
  hoursFull: [
    { days: 'Понедельник — Суббота', time: '8:00 – 19:00' },
    { days: 'Воскресенье', time: 'выходной' },
  ],
  // [TBD] — телефон клиники уточняется, использовать плейсхолдер
  phoneDisplay: '+375 (29) 000-00-00',
  phoneHref: 'tel:+375290000000',
  viberHref: 'https://viber.com/#',
  telegramHref: 'https://t.me/#',
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

export const navLinks = [
  { label: 'Услуги', href: '/uslugi/' },
  { label: 'Врачи', href: '/vrachi/' },
  { label: 'Цены', href: '/ceny/' },
  { label: 'Примеры работ', href: '/primery-rabot/' },
  { label: 'О нас', href: '/o-nas/' },
  { label: 'Контакты', href: '/kontakty/' },
]
