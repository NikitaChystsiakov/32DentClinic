export type DoctorCategory = 'terapevt' | 'ortoped' | 'hirurg'

export interface Doctor {
  slug: string
  name: string
  specialization: string
  experienceYears: number
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
    photo: '/images/doctors/rogachev/ilyushchenko-natalya.png',
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
    photo: '/images/doctors/rogachev/alekseychik-yuliya.png',
    cities: ['rogachev'],
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
    photo: '/images/doctors/rogachev/pavlovich-sergey.png',
    cities: ['rogachev'],
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
    photo: '/images/doctors/rogachev/saykovskaya-tatyana.png',
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
    photo: '/images/doctors/rogachev/bychkov-ivan.png',
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
    photo: '/images/doctors/rogachev/kireev-vladislav.png',
    cities: ['rogachev'],
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
    photo: '/images/doctors/rogachev/kovalchuk-igor.png',
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
    photo: '/images/doctors/rogachev/alekseychuk-vyacheslav.png',
    cities: ['rogachev'],
  },
  {
    slug: 'belousova-tatyana',
    name: 'Татьяна Белousova',
    specialization: 'Врач-стоматолог-ортопед',
    experienceYears: 10,
    categories: ['ortoped'],
    bio: 'Татьяна — врач-ортопед с опытом протезирования зубов.',
    directions: [{ label: 'Протезирование', href: '/uslugi/protezirovanie/' }],
    hasCertificates: false,
    photo: '/images/doctors/rogachev/belousova-tatyana.png',
    cities: ['rogachev'],
  },
  {
    slug: 'makhonko-pavel',
    name: 'Павел Махонько',
    specialization: 'Врач-стоматолог-хирург-имплантолог, ортопед',
    experienceYears: 12,
    categories: ['hirurg', 'ortoped'],
    bio: 'Павел — единственный в клинике врач хирургического профиля, также занимается имплантацией и протезированием.',
    directions: [
      { label: 'Хирургия', href: '/uslugi/khirurgiya/' },
      { label: 'Имплантация', href: '/uslugi/implantaciya/' },
      { label: 'Протезирование', href: '/uslugi/protezirovanie/' },
    ],
    hasCertificates: false,
    photo: '/images/doctors/rogachev/makhonko-pavel.png',
    cities: ['rogachev'],
  },

  // --- Минск (заглушки — заменить на реальных врачей) ---
  {
    slug: 'minsk-terapevt-1',
    name: 'Анна Иванова',
    specialization: 'Врач-терапевт-стоматолог',
    experienceYears: 14,
    categories: ['terapevt'],
    bio: 'Анна — врач-терапевт с 14-летним опытом, специализируется на лечении кариеса и эндодонтии.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/ilyushchenko-natalya.png',
    cities: ['minsk'],
    isPlaceholder: true,
  },
  {
    slug: 'minsk-terapevt-2',
    name: 'Мария Петрова',
    specialization: 'Врач-терапевт-стоматолог',
    experienceYears: 9,
    categories: ['terapevt'],
    bio: 'Мария — врач-терапевт, принимает взрослых и детей.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/alekseychik-yuliya.png',
    cities: ['minsk'],
    isPlaceholder: true,
  },
  {
    slug: 'minsk-ortoped-1',
    name: 'Дмитрий Козлов',
    specialization: 'Врач-стоматолог-ортопед',
    experienceYears: 8,
    categories: ['ortoped'],
    bio: 'Дмитрий — врач-ортопед, специализируется на коронках и мостовидных протезах.',
    directions: [{ label: 'Протезирование', href: '/uslugi/protezirovanie/' }],
    hasCertificates: false,
    photo: '/images/doctors/kireev-vladislav.png',
    cities: ['minsk'],
    isPlaceholder: true,
  },

  // --- Жлобин (заглушки — заменить на реальных врачей) ---
  {
    slug: 'zhlobin-terapevt-1',
    name: 'Елена Сидорова',
    specialization: 'Врач-терапевт-стоматолог',
    experienceYears: 16,
    categories: ['terapevt'],
    bio: 'Елена — врач-терапевт с 16-летним стажем, принимает взрослых и детей.',
    directions: [{ label: 'Терапия', href: '/uslugi/terapevticheskaya-stomatologiya/' }],
    hasCertificates: false,
    photo: '/images/doctors/saykovskaya-tatyana.png',
    cities: ['zhlobin'],
    isPlaceholder: true,
  },
  {
    slug: 'zhlobin-hirurg-1',
    name: 'Алексей Новиков',
    specialization: 'Врач-стоматолог-хирург',
    experienceYears: 10,
    categories: ['hirurg'],
    bio: 'Алексей — врач-хирург, специализируется на удалении зубов и имплантации.',
    directions: [
      { label: 'Хирургия', href: '/uslugi/khirurgiya/' },
      { label: 'Имплантация', href: '/uslugi/implantaciya/' },
    ],
    hasCertificates: false,
    photo: '/images/doctors/makhonko-pavel.png',
    cities: ['zhlobin'],
    isPlaceholder: true,
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
