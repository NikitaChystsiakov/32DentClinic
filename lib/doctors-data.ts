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
    photo: '/images/doctors/makhonko-pavel.webp',
  },
]

export function getDoctorBySlug(slug: string) {
  return doctors.find((d) => d.slug === slug)
}
