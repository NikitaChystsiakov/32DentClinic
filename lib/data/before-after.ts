// Единый источник данных «до/после».
// Редактировать примеры работ можно здесь, не трогая код компонентов.
// Для реальных фотографий достаточно заменить пути before/after на файлы в /public.

export interface BeforeAfterCase {
  id: string
  // slug услуги из lib/services-data.ts (используется для фильтра на странице примеров)
  serviceSlug: string
  // Название услуги/процедуры, выводится в карточке
  title: string
  description: string
  before: string
  after: string
  // Врач, который вёл случай, и почему было выбрано именно это решение
  doctorName: string
  doctorSpecialization: string
  doctorPhoto: string
  reasoning: string
}

export const beforeAfterCases: BeforeAfterCase[] = [
  {
    id: 'restavraciya-zuba',
    serviceSlug: 'terapevticheskaya-stomatologiya',
    title: 'Реставрация зуба',
    description: 'Восстановили форму и цвет зуба после скола, сохранив естественный вид.',
    before: '/cases/case-1-before.png',
    after: '/cases/case-1-after.png',
    doctorName: 'Наталья Ильющенко',
    doctorSpecialization: 'Врач-терапевт-стоматолог',
    doctorPhoto: '/images/doctors/rogachev/ilyushchenko-natalya.png',
    reasoning:
      'Скол не задел нерв, поэтому вместо коронки выбрали прямую реставрацию — она сохраняет больше собственной ткани зуба и делается за один визит.',
  },
  {
    id: 'ispravlenie-prikusa',
    serviceSlug: 'ortodontiya',
    title: 'Исправление прикуса брекетами',
    description: 'Выровняли зубной ряд и нормализовали прикус за полтора года.',
    before: '/cases/case-2-before.png',
    after: '/cases/case-2-after.png',
    doctorName: 'Владислав Киреев',
    doctorSpecialization: 'Врач-стоматолог-ортопед',
    doctorPhoto: '/images/doctors/rogachev/kireev-vladislav.png',
    reasoning:
      'Скученность зубов была выраженной — брекет-система дала более предсказуемый результат за фиксированный срок, чем съёмные элайнеры.',
  },
  {
    id: 'odinochnaya-implantaciya',
    serviceSlug: 'implantaciya',
    title: 'Одиночная имплантация',
    description: 'Имплант и коронка вместо утраченного зуба — несъёмное решение.',
    before: '/cases/case-3-before.png',
    after: '/cases/case-3-after.png',
    doctorName: 'Павел Махонько',
    doctorSpecialization: 'Врач-стоматолог-хирург-имплантолог',
    doctorPhoto: '/images/doctors/rogachev/makhonko-pavel.png',
    reasoning:
      'Соседние зубы были полностью здоровы — имплант позволил восстановить ряд, не обтачивая их под мост.',
  },
  {
    id: 'protezirovanie-na-implantah',
    serviceSlug: 'protezirovanie',
    title: 'Протезирование на имплантах',
    description: 'Несъёмная конструкция на имплантах восстановила весь зубной ряд.',
    before: '/cases/case-4-before.png',
    after: '/cases/case-4-after.png',
    doctorName: 'Игорь Ковальчук',
    doctorSpecialization: 'Врач-стоматолог-ортопед',
    doctorPhoto: '/images/doctors/rogachev/kovalchuk-igor.png',
    reasoning:
      'Пациент хотел ощущения собственных зубов без необходимости их снимать — выбрали несъёмный протез на имплантах вместо съёмного.',
  },
  {
    id: 'otbelivanie',
    serviceSlug: 'prof-gigiena-i-otbelivanie',
    title: 'Отбеливание зубов',
    description: 'Осветлили эмаль на несколько тонов за один визит.',
    before: '/cases/case-5-before.png',
    after: '/cases/case-5-after.png',
    doctorName: 'Юлия Алексейчик',
    doctorSpecialization: 'Врач-терапевт-стоматолог',
    doctorPhoto: '/images/doctors/rogachev/alekseychik-yuliya.png',
    reasoning:
      'Перед отбеливанием провели профгигиену — без неё результат вышел бы неравномерным из-за налёта на эмали.',
  },
  {
    id: 'udalenie-zuba',
    serviceSlug: 'khirurgiya',
    title: 'Удаление зуба мудрости',
    description: 'Атравматичное удаление с быстрым и комфортным восстановлением.',
    before: '/cases/case-6-before.png',
    after: '/cases/case-6-after.png',
    doctorName: 'Павел Махонько',
    doctorSpecialization: 'Врач-стоматолог-хирург-имплантолог',
    doctorPhoto: '/images/doctors/rogachev/makhonko-pavel.png',
    reasoning:
      'Зуб мудрости рос горизонтально и давил на соседний — решили удалить, не дожидаясь осложнений и смещения ряда.',
  },
]

// Услуги, для которых есть примеры работ — используются как фильтры на странице /primery-rabot/
export function getBeforeAfterServiceSlugs(): string[] {
  return Array.from(new Set(beforeAfterCases.map((c) => c.serviceSlug)))
}