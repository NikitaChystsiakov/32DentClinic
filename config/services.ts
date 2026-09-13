// Услуги и цены для страниц городов: /<город>/uslugi/ и /<город>/uslugi/<slug>/.
// Каждая запись — одно направление (терапия, хирургия…), внутри — список
// процедур с ценой «от» в белорусских рублях.
//
// Для не-разработчика:
//   • Цену меняйте в `priceFrom` (число без «BYN»). Цена направления —
//     обычно самая низкая из его процедур.
//   • `availableIn` — в каких городах услуга есть: ['minsk', 'rogachev', 'zhlobin'].
//     Уберите город из списка, и услуга пропадёт с его страниц.
//   • `doctorSlugs` — врачи направления, по `slug` из config/doctors.ts.
//   • Тексты не должны обещать результат («100 %», «без боли», «навсегда»)
//     и сравнивать клинику с другими — ст. 15 Закона «О рекламе».
//
// Прайс (/ceny/), калькулятор, форма записи и каталог сети (/uslugi/) читают
// этот же файл через lib/services-data.ts — править нужно только здесь.

export interface Procedure {
  name: string
  priceFrom: number
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ServiceCategory {
  slug: string
  shortName: string
  /** Заголовок H1 без города — страница сама добавит «в Минске» и т.п. */
  title: string
  /** Title для поисковиков без названия клиники — его добавляет layout города. */
  metaTitle: string
  cardDescription: string
  intro: string
  priceFrom: number
  icon: string
  image: string
  procedures: Procedure[]
  whenToVisit: string[]
  steps: string[]
  doctorSlugs: string[]
  faq: FaqItem[]
  availableIn: string[] // список slug городов, где услуга доступна
}

export const serviceCategories: ServiceCategory[] = [
  // Имплантация стоит первой намеренно: это главное направление клиники,
  // и порядок массива задаёт порядок во всех списках услуг (главная города,
  // каталог, прайс, чипы на хабе). Не сортируйте по алфавиту.
  {
    slug: 'implantaciya',
    image: '/images/services/implantaciya.webp',
    shortName: 'Имплантация',
    title: 'Имплантация зубов',
    metaTitle: 'Имплантация зубов',
    cardDescription: 'Установка имплантов вместо утраченных зубов на современном оборудовании.',
    intro: 'Устанавливаем импланты вместо утраченных зубов на современном оборудовании — с гарантией на выполненные работы.',
    priceFrom: 700,
    icon: 'Zap',
    procedures: [
      { name: 'Установка импланта (первый этап)', priceFrom: 700 },
      { name: 'Протезирование на имплантах', priceFrom: 600 },
    ],
    whenToVisit: ['Отсутствует один или несколько зубов, съёмный протез неудобен', 'Хочется несъёмное решение'],
    steps: ['Диагностика и планирование', 'Установка импланта', 'Период приживления', 'Протезирование'],
    doctorSlugs: ['makhonko-pavel'],
    faq: [],
    availableIn: ['rogachev', 'minsk'],
  },
  {
    slug: 'terapevticheskaya-stomatologiya',
    image: '/images/services/terapiya.webp',
    shortName: 'Терапия',
    title: 'Терапевтическая стоматология',
    metaTitle: 'Лечение зубов и дёсен',
    cardDescription:
      'Лечение кариеса, пульпита и других заболеваний зубов, включая приём детей, с сохранением естественного вида зуба.',
    intro:
      'Лечим кариес, пульпит и заболевания дёсен с сохранением естественного вида зуба. Принимаем как взрослых, так и детей — подход к маленьким пациентам у наших врачей отработан отдельно.',
    priceFrom: 90,
    icon: 'Stethoscope',
    procedures: [
      { name: 'Консультация терапевта', priceFrom: 20 },
      { name: 'Лечение кариеса', priceFrom: 90 },
      { name: 'Пульпит 1 канал', priceFrom: 140 },
      { name: 'Пульпит 2 канала', priceFrom: 220 },
      { name: 'Пульпит 3 канала', priceFrom: 300 },
      { name: 'Пульпит 4 канала', priceFrom: 400 },
      { name: 'Лечение пародонтоза/пародонтита', priceFrom: 100 },
      { name: 'Реставрация зуба', priceFrom: 150 },
      { name: 'Шинирование', priceFrom: 120 },
      { name: 'Приём детей', priceFrom: 70 },
    ],
    whenToVisit: [
      'Боль при накусывании или от горячего/холодного',
      'Потемнение эмали или видимая полость',
      'Кровоточивость дёсен',
      'Плановый осмотр раз в полгода',
    ],
    steps: ['Осмотр и диагностика', 'Обезболивание при необходимости', 'Лечение', 'Рекомендации по уходу'],
    doctorSlugs: [
      'ilyushchenko-natalya',
      'alekseychik-yuliya',
      'pavlovich-sergey',
      'saykovskaya-tatyana',
      'bychkov-ivan',
    ],
    faq: [
      {
        question: 'Это больно?',
        answer: 'Лечение проводится с местной анестезией, дискомфорт минимален.',
      },
      {
        question: 'Можно записать ребёнка?',
        answer: 'Да, врачи клиники принимают детей.',
      },
    ],
    availableIn: ['rogachev', 'minsk', 'zhlobin'],
  },
  {
    slug: 'khirurgiya',
    image: '/images/services/khirurgiya.webp',
    shortName: 'Хирургия',
    title: 'Хирургическая стоматология',
    metaTitle: 'Удаление зубов и хирургия',
    cardDescription: 'Удаление зубов любой сложности, операции при заболеваниях дёсен и челюсти.',
    intro:
      'Удаление зубов любой сложности, включая зубы мудрости, и операции при заболеваниях дёсен и челюсти — с контролем боли на всех этапах.',
    priceFrom: 80,
    icon: 'Scissors',
    procedures: [
      { name: 'Удаление зуба', priceFrom: 80 },
      { name: 'Удаление зуба мудрости', priceFrom: 150 },
      { name: 'Гемисекция корня', priceFrom: 200 },
      { name: 'Иссечение уздечки', priceFrom: 150 },
      { name: 'Лечение ВНЧС (консультация)', priceFrom: 100 },
      { name: 'Наращивание костной ткани', priceFrom: 400 },
      { name: 'Резекция верхушки корня', priceFrom: 250 },
      { name: 'Удаление доброкачественных образований', priceFrom: 200 },
      { name: 'Эндодонтическая хирургия', priceFrom: 250 },
    ],
    whenToVisit: [
      'Сильная боль, которую нельзя вылечить терапевтически',
      'Разрушенный зуб, не подлежащий восстановлению',
      'Затруднённое прорезывание зуба мудрости',
      'Направление от терапевта клиники',
    ],
    steps: ['Консультация и снимок', 'Анестезия', 'Операция', 'Рекомендации по восстановлению'],
    doctorSlugs: ['makhonko-pavel'],
    faq: [
      {
        question: 'Сколько заживает лунка после удаления?',
        answer: 'Зависит от сложности, врач даст точный прогноз на приёме.',
      },
    ],
    availableIn: ['rogachev', 'minsk'],
  },
  {
    slug: 'ortodontiya',
    image: '/images/services/ortodontiya.webp',
    shortName: 'Ортодонтия',
    title: 'Ортодонтия — исправление прикуса',
    metaTitle: 'Брекеты и исправление прикуса',
    cardDescription: 'Исправление прикуса и выравнивание зубов брекет-системами для детей и взрослых.',
    intro: 'Исправляем прикус и выравниваем зубы с помощью брекет-систем — подходит и детям, и взрослым.',
    priceFrom: 1800,
    icon: 'Smile',
    procedures: [
      { name: 'Консультация ортодонта', priceFrom: 30 },
      { name: 'Установка брекет-системы', priceFrom: 1800 },
      { name: 'Исправление прикуса (полный курс)', priceFrom: 2500 },
    ],
    whenToVisit: [
      'Видимая кривизна зубов',
      'Проблемы прикуса, влияющие на жевание или речь',
      'Рекомендация терапевта или профилактический осмотр у ребёнка',
    ],
    steps: [
      'Консультация и диагностика прикуса',
      'План лечения',
      'Установка системы',
      'Регулярные корректирующие визиты',
    ],
    doctorSlugs: [],
    faq: [],
    availableIn: ['rogachev'],
  },
  {
    slug: 'protezirovanie',
    image: '/images/services/protezirovanie.webp',
    shortName: 'Протезирование',
    title: 'Протезирование зубов',
    metaTitle: 'Коронки и протезы',
    cardDescription: 'Коронки, съёмные и несъёмные протезы — восстановим зубной ряд надёжно и красиво.',
    intro:
      'Восстанавливаем зубной ряд надёжно и красиво — от одиночной коронки до полного протезирования. Собственная зуботехническая лаборатория ускоряет изготовление и позволяет контролировать качество на месте.',
    priceFrom: 180,
    icon: 'Crown',
    procedures: [
      { name: 'Консультация ортопеда', priceFrom: 20 },
      { name: 'Металлокерамическая коронка', priceFrom: 180 },
      { name: 'Коронка из прессованной керамики', priceFrom: 450 },
      { name: 'Цельнолитая коронка', priceFrom: 120 },
      { name: 'Съёмный протез', priceFrom: 500 },
      { name: 'Протезирование на имплантах', priceFrom: 600 },
      { name: 'Виниры/люминиры', priceFrom: 500 },
    ],
    whenToVisit: [
      'Отсутствует один или несколько зубов',
      'Старые коронки/протезы требуют замены',
      'Хочется улучшить эстетику улыбки',
    ],
    steps: [
      'Консультация и снятие слепков',
      'Изготовление в собственной лаборатории',
      'Примерка',
      'Установка',
    ],
    doctorSlugs: [
      'alekseychuk-vyacheslav',
      'kireev-vladislav',
      'kovalchuk-igor',
      'belousova-tatyana',
      'makhonko-pavel',
    ],
    faq: [],
    availableIn: ['rogachev', 'minsk'],
  },
  {
    slug: 'prof-gigiena-i-otbelivanie',
    image: '/images/services/gigiena.webp',
    shortName: 'Проф.гигиена и отбеливание',
    title: 'Профессиональная чистка и отбеливание зубов',
    metaTitle: 'Чистка и отбеливание зубов',
    cardDescription: 'Профессиональная чистка и безопасное отбеливание для белоснежной улыбки.',
    intro:
      'Профессиональная чистка убирает налёт и зубной камень, которые невозможно снять обычной щёткой, и служит профилактикой кариеса и болезней дёсен.',
    priceFrom: 70,
    icon: 'Sparkles',
    procedures: [
      { name: 'Профессиональная чистка зубов', priceFrom: 70 },
      { name: 'Удаление зубного камня', priceFrom: 60 },
      { name: 'Отбеливание', priceFrom: 200 },
    ],
    whenToVisit: [
      'Профилактика раз в полгода',
      'Потемнение эмали от кофе/курения',
      'Перед протезированием или брекетами (обязательный этап)',
    ],
    steps: [],
    doctorSlugs: [],
    faq: [],
    availableIn: ['rogachev', 'minsk', 'zhlobin'],
  },
  {
    slug: 'diagnostika',
    image: '/images/services/diagnostika.webp',
    shortName: 'Диагностика',
    title: 'Диагностика и рентген зубов',
    metaTitle: 'Рентген и диагностика зубов',
    cardDescription: 'Панорамные и прицельные снимки на современном рентген-оборудовании.',
    intro:
      'Собственное щадящее рентген-оборудование позволяет провести точную диагностику прямо в клинике, без направления в другое место.',
    priceFrom: 20,
    icon: 'ScanLine',
    procedures: [
      { name: 'Панорамный снимок зубов', priceFrom: 35 },
      { name: 'Прицельный рентгеновский снимок зуба', priceFrom: 20 },
    ],
    whenToVisit: ['Перед началом любого сложного лечения', 'Плановый контроль состояния зубов и челюсти'],
    steps: [],
    doctorSlugs: [],
    faq: [],
    availableIn: ['rogachev', 'minsk', 'zhlobin'],
  },
]

/** Главное направление клиники — выделяется бейджем в карточках городов на хабе. */
export const FEATURED_SERVICE_SLUG = 'implantaciya'

export function getServiceBySlug(slug: string) {
  return serviceCategories.find((s) => s.slug === slug)
}

export function getServicesForCity(citySlug: string) {
  return serviceCategories.filter((s) => s.availableIn.includes(citySlug))
}

export const serviceSelectOptions = serviceCategories.map((s) => ({ value: s.slug, label: s.shortName }))
