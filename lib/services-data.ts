// Единый источник данных об услугах, ценах, врачах направлений и FAQ.
// Прайс-лист (/ceny/) и каталог услуг (/uslugi/) собираются из этого файла.

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
  title: string
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
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: 'terapevticheskaya-stomatologiya',
    image: '/images/services/terapiya.png',
    shortName: 'Терапия',
    title: 'Терапевтическая стоматология в Рогачёве',
    metaTitle: 'Лечение зубов и дёсен | 32Дент, Рогачёв',
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
  },
  {
    slug: 'khirurgiya',
    image: '/images/services/khirurgiya.png',
    shortName: 'Хирургия',
    title: 'Хирургическая стоматология в Рогачёве',
    metaTitle: 'Удаление зубов и хирургия | 32Дент, Рогачёв',
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
  },
  {
    slug: 'ortodontiya',
    image: '/images/services/ortodontiya.png',
    shortName: 'Ортодонтия',
    title: 'Ортодонтия — исправление прикуса в Рогачёве',
    metaTitle: 'Брекеты и исправление прикуса | 32Дент, Рогачёв',
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
  },
  {
    slug: 'protezirovanie',
    image: '/images/services/protezirovanie.png',
    shortName: 'Протезирование',
    title: 'Протезирование зубов в Рогачёве',
    metaTitle: 'Коронки и протезы | 32Дент, Рогачёв',
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
  },
  {
    slug: 'implantaciya',
    image: '/images/services/implantaciya.png',
    shortName: 'Имплантация',
    title: 'Имплантация зубов в Рогачёве',
    metaTitle: 'Имплантация зубов | 32Дент, Рогачёв',
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
  },
  {
    slug: 'prof-gigiena-i-otbelivanie',
    image: '/images/services/gigiena.png',
    shortName: 'Проф.гигиена и отбеливание',
    title: 'Профессиональная чистка и отбеливание зубов в Рогачёве',
    metaTitle: 'Чистка и отбеливание зубов | 32Дент, Рогачёв',
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
  },
  {
    slug: 'diagnostika',
    image: '/images/services/diagnostika.png',
    shortName: 'Диагностика',
    title: 'Диагностика и рентген зубов в Рогачёве',
    metaTitle: 'Рентген и диагностика зубов | 32Дент, Рогачёв',
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
  },
]

export function getServiceBySlug(slug: string) {
  return serviceCategories.find((s) => s.slug === slug)
}

export const serviceSelectOptions = serviceCategories.map((s) => ({ value: s.slug, label: s.shortName }))
