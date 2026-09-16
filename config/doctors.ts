// Врачи сети. Карточки на страницах /<город>/vrachi/ и в карусели на главной.
//
// Для не-разработчика:
//   • `cities` — в каких клиниках врач принимает: ['minsk'], ['rogachev'] и т. д.
//   • `photo` — путь к портрету в папке public, например
//     '/images/doctors/familiya-imya.webp'.
//   • `experienceYears` — стаж числом; подпись «лет» добавится сама. Если
//     стаж неизвестен — уберите поле целиком, подпись не покажется.
//   • Имя, фото, специализация и образование врача — его персональные данные.
//     Перед публикацией у каждого врача должно быть письменное согласие на
//     размещение этих сведений на сайте (Закон «О защите персональных данных»).
//   • `isPlaceholder: true` — карточка-заглушка с выдуманным именем; такие не
//     показываются как реальные люди. Снимите флаг, когда данные настоящие.

export type DoctorCategory = 'terapevt' | 'ortoped' | 'hirurg'

export interface Doctor {
  slug: string
  name: string
  specialization: string
  /** Стаж в годах; если клиника ещё не прислала — не указывайте, подпись скроется. */
  experienceYears?: number
  categories: DoctorCategory[]
  bio: string
  directions: { label: string; href: string }[]
  hasCertificates: boolean
  photo: string
  cities: string[] // список slug городов, где работает врач
  /**
   * Карточка-заглушка: имя выдумано, а фото взято у врача из Рогачёва.
   * Такие записи нельзя показывать как реальных людей — страница «О нас»
   * их отфильтровывает (см. getRealDoctorsForCity). Снимите флаг, когда
   * клиника пришлёт настоящие имена и портреты.
   */
  isPlaceholder?: boolean
}

export const doctorCategoryLabels: Record<DoctorCategory, string> = {
  terapevt: 'Терапевты',
  ortoped: 'Ортопеды',
  hirurg: 'Хирурги',
}

export const doctors: Doctor[] = [
  {
    slug: 'ilyushchenko-natalya',
    name: 'Ильющенко Наталья Николаевна',
    specialization: 'Врач-терапевт-стоматолог (в т.ч. приём детей)',
    experienceYears: 20,
    categories: ['terapevt'],
    bio: 'Наталья Николаевна — врач-терапевт с 20-летним опытом работы, принимает как взрослых, так и детей.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/ilyushchenko-natalya.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['rogachev'],
  },
  {
    slug: 'alekseychik-yuliya',
    name: 'Юлия Алексейчик',
    specialization: 'Врач-терапевт-стоматолог',
    experienceYears: 17,
    categories: ['terapevt'],
    bio: 'Юлия — врач-терапевт с 17-летним опытом, специализируется на лечении кариеса и заболеваний дёсен.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/alekseychik-yuliya.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['minsk'],
  },
  {
    slug: 'pavlovich-sergey',
    name: 'Павлович Сергей Степанович',
    specialization: 'Врач-терапевт-стоматолог',
    experienceYears: 15,
    categories: ['terapevt'],
    bio: 'Сергей Степанович — врач-терапевт с 15-летним стажем.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/pavlovich-sergey.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['zhlobin'],
  },
  {
    slug: 'saykovskaya-tatyana',
    name: 'Татьяна Сайковская',
    specialization: 'Врач-терапевт-стоматолог',
    experienceYears: 12,
    categories: ['terapevt'],
    bio: 'Татьяна — врач-терапевт с 12-летним опытом работы.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/saykovskaya-tatyana.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['rogachev'],
  },
  {
    slug: 'bychkov-ivan',
    name: 'Иван Бычков',
    specialization: 'Врач-терапевт-стоматолог',
    experienceYears: 11,
    categories: ['terapevt'],
    bio: 'Иван — врач-терапевт с 11-летним опытом работы.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/bychkov-ivan.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['rogachev'],
  },
  {
    slug: 'kireev-vladislav',
    name: 'Владислав Киреев',
    specialization: 'Врач-стоматолог-ортопед',
    experienceYears: 12,
    categories: ['ortoped'],
    bio: 'Владислав — врач-ортопед с 12-летним опытом протезирования зубов.',
    directions: [{ label: 'Протезирование', href: '/uslugi/protezirovanie/' }],
    hasCertificates: false,
    photo: '/images/doctors/kireev-vladislav.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['zhlobin'],
  },
  {
    slug: 'kovalchuk-igor',
    name: 'Игорь Ковальчук',
    specialization: 'Врач-стоматолог-ортопед',
    experienceYears: 7,
    categories: ['ortoped'],
    bio: 'Игорь — врач-ортопед, специализируется на коронках и протезировании.',
    directions: [{ label: 'Протезирование', href: '/uslugi/protezirovanie/' }],
    hasCertificates: false,
    photo: '/images/doctors/kovalchuk-igor.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['rogachev'],
  },
  {
    slug: 'alekseychuk-vyacheslav',
    name: 'Вячеслав Алексейчук',
    specialization: 'Врач-стоматолог-ортопед',
    experienceYears: 6,
    categories: ['ortoped'],
    bio: 'Вячеслав — врач-ортопед, специализируется на протезировании зубов.',
    directions: [{ label: 'Протезирование', href: '/uslugi/protezirovanie/' }],
    hasCertificates: false,
    photo: '/images/doctors/alekseychuk-vyacheslav.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['zhlobin'],
  },
  {
    slug: 'belousova-tatyana',
    name: 'Татьяна Белоусова',
    specialization: 'Врач-стоматолог-ортопед',
    experienceYears: 10,
    categories: ['ortoped'],
    bio: 'Татьяна — врач-ортопед с 10-летним опытом: комплексное планирование и протезирование, в том числе на имплантах по протоколам All-on-4 и All-on-6.',
    directions: [
      { label: 'Протезирование', href: '/uslugi/protezirovanie/' },
      { label: 'Имплантация', href: '/uslugi/implantaciya/' },
    ],
    hasCertificates: false,
    photo: '/images/doctors/belousova-tatyana.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['minsk'],
  },
  {
    slug: 'makhonko-pavel',
    name: 'Павел Махонько',
    specialization: 'Врач-стоматолог-хирург-имплантолог, ортопед',
    experienceYears: 12,
    categories: ['hirurg', 'ortoped'],
    bio: 'Павел — хирург-имплантолог и ортопед: ведёт пациента от установки импланта до протезирования, поэтому план лечения не «собирается» из решений разных врачей.',
    directions: [
      { label: 'Хирургия', href: '/uslugi/khirurgiya/' },
      { label: 'Имплантация', href: '/uslugi/implantaciya/' },
      { label: 'Протезирование', href: '/uslugi/protezirovanie/' },
    ],
    hasCertificates: false,
    photo: '/images/doctors/makhonko-pavel.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['zhlobin'],
  },

  // --- Минск. Имена, специализации и стаж — с 32dentminsk.by и 103.by;
  // фото прислал заказчик. Согласия врачей на публикацию — [TBD].
  // Кто в каком городе — по списку заказчика от 15.09.2026. ---
  {
    slug: 'zhilevich-vladimir',
    name: 'Жилевич Владимир Александрович',
    specialization: 'Врач-стоматолог-хирург-имплантолог, первая категория',
    experienceYears: 21,
    categories: ['hirurg'],
    bio: 'Владимир Александрович — хирург-имплантолог минского центра: классическая и одномоментная имплантация, протоколы All-on-4 и All-on-6, синус-лифтинг, навигационная хирургия по шаблону.',
    directions: [
      { label: 'Имплантация', href: '/uslugi/implantaciya/' },
      { label: 'Хирургия', href: '/uslugi/khirurgiya/' },
    ],
    hasCertificates: false,
    photo: '/images/doctors/zhilevich-vladimir.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['minsk'],
  },
  {
    slug: 'molchan-aleksandr',
    name: 'Молчан Александр Александрович',
    specialization: 'Врач-стоматолог-хирург, первая категория',
    experienceYears: 21,
    categories: ['hirurg'],
    bio: 'Александр Александрович — стоматолог-хирург: удаление зубов любой сложности и пластика мягких тканей. Проходил обучение в Швейцарии и Израиле.',
    directions: [
      { label: 'Хирургия', href: '/uslugi/khirurgiya/' },
      { label: 'Имплантация', href: '/uslugi/implantaciya/' },
    ],
    hasCertificates: false,
    photo: '/images/doctors/molchan-aleksandr.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['minsk'],
  },
  // [TBD] Гутырчик и Ухватова: заказчик прислал только имена и фото.
  // Специализация, стаж и профиль — уточняются; пока «врач-стоматолог»
  // в группе терапевтов, без стажа. Ухватова — Минск (список 15.09),
  // Гутырчик — город не назван.
  {
    slug: 'gutyrchik-mariya',
    name: 'Гутырчик Мария',
    specialization: 'Врач-стоматолог',
    categories: ['terapevt'],
    bio: 'Мария — врач-стоматолог минского центра 32Дент+.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/gutyrchik-mariya.webp',
    // [TBD] Заказчик не назвал город (список от 15.09) — врач нигде не показывается, пока не уточним.
    cities: [],
  },
  {
    slug: 'ukhvatova-ekaterina',
    name: 'Ухватова Екатерина',
    specialization: 'Врач-стоматолог',
    categories: ['terapevt'],
    bio: 'Екатерина — врач-стоматолог минского центра 32Дент+.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/ukhvatova-ekaterina.webp',
    // Распределение по городам — от заказчика 15.09.2026.
    cities: ['minsk'],
  },

  // --- Жлобин, дополнение от заказчика 15.09.2026 (ФИО и профиль; стаж
  // и образование — [TBD]). ---
  {
    slug: 'fedorova-natalya',
    name: 'Федорова Наталья Васильевна',
    specialization: 'Врач-стоматолог-хирург',
    categories: ['hirurg'],
    bio: 'Наталья Васильевна — стоматолог-хирург жлобинской клиники: удаление зубов, в том числе сложное, и хирургическая подготовка к имплантации.',
    directions: [{ label: 'Хирургия', href: '/uslugi/khirurgiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/fedorova-natalya.webp',
    cities: ['zhlobin'],
  },
  {
    slug: 'volosova-natalya',
    name: 'Волосова Наталья Александровна',
    specialization: 'Врач-стоматолог-терапевт',
    categories: ['terapevt'],
    bio: 'Наталья Александровна — врач-терапевт: лечение кариеса, пульпита и заболеваний дёсен.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/volosova-natalya.webp',
    cities: ['zhlobin'],
  },
  {
    slug: 'mikhalenko-olga',
    name: 'Михаленко Ольга Валерьевна',
    specialization: 'Врач-стоматолог-терапевт',
    categories: ['terapevt'],
    bio: 'Ольга Валерьевна — врач-терапевт: лечение кариеса, пульпита и заболеваний дёсен.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/mikhalenko-olga.webp',
    cities: ['zhlobin'],
  },
  {
    slug: 'kuznetsova-marina',
    name: 'Кузнецова Марина Александровна',
    specialization: 'Врач-стоматолог-терапевт',
    categories: ['terapevt'],
    bio: 'Марина Александровна — врач-терапевт: лечение кариеса, пульпита и заболеваний дёсен.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/kuznetsova-marina.webp',
    cities: ['zhlobin'],
  },
]

export function getDoctorBySlug(slug: string) {
  return doctors.find((d) => d.slug === slug)
}

export function getDoctorsForCity(citySlug: string) {
  return doctors.filter((d) => d.cities.includes(citySlug))
}

/**
 * Врачи города без карточек-заглушек. Используйте там, где врача показывают
 * как реального человека (фото + имя), — например на странице «О нас».
 */
export function getRealDoctorsForCity(citySlug: string) {
  return getDoctorsForCity(citySlug).filter((d) => !d.isPlaceholder)
}

export function getDoctorsBySlugAndCity(doctorSlug: string, citySlug: string) {
  return doctors.find((d) => d.slug === doctorSlug && d.cities.includes(citySlug))
}

/**
 * Врачи, которые ведут имплантацию в городе, — по направлению «Имплантация»
 * в карточке. Только реальные (без isPlaceholder): блок «Кто ставит импланты»
 * показывает человека крупно, с именем и стажем, и заглушка там была бы
 * прямым обманом пациента.
 */
export function getImplantologistsForCity(citySlug: string) {
  const rank = (doctor: Doctor) =>
    // Сначала хирурги (они ставят импланты), потом ортопеды; среди равных —
    // врачи, для которых этот город основной (первый в cities).
    (doctor.categories.includes('hirurg') ? 0 : 2) + (doctor.cities[0] === citySlug ? 0 : 1)
  return getRealDoctorsForCity(citySlug)
    .filter((doctor) => doctor.directions.some((direction) => direction.href.includes('/implantaciya/')))
    .sort((a, b) => rank(a) - rank(b))
}

/** Сколько реальных врачей принимают хотя бы в одной клинике сети — для хаба. */
export function getRealDoctorsCount() {
  return doctors.filter((d) => !d.isPlaceholder && d.cities.length > 0).length
}
