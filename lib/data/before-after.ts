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
}

export const beforeAfterCases: BeforeAfterCase[] = [
  {
    id: 'restavraciya-zuba',
    serviceSlug: 'terapevticheskaya-stomatologiya',
    title: 'Реставрация зуба',
    description: 'Восстановили форму и цвет зуба после скола, сохранив естественный вид.',
    before: '/cases/case-1-before.png',
    after: '/cases/case-1-after.png',
  },
  {
    id: 'ispravlenie-prikusa',
    serviceSlug: 'ortodontiya',
    title: 'Исправление прикуса брекетами',
    description: 'Выровняли зубной ряд и нормализовали прикус за полтора года.',
    before: '/cases/case-2-before.png',
    after: '/cases/case-2-after.png',
  },
  {
    id: 'odinochnaya-implantaciya',
    serviceSlug: 'implantaciya',
    title: 'Одиночная имплантация',
    description: 'Имплант и коронка вместо утраченного зуба — несъёмное решение.',
    before: '/cases/case-3-before.png',
    after: '/cases/case-3-after.png',
  },
  {
    id: 'protezirovanie-na-implantah',
    serviceSlug: 'protezirovanie',
    title: 'Протезирование на имплантах',
    description: 'Несъёмная конструкция на имплантах восстановила весь зубной ряд.',
    before: '/cases/case-4-before.png',
    after: '/cases/case-4-after.png',
  },
  {
    id: 'otbelivanie',
    serviceSlug: 'prof-gigiena-i-otbelivanie',
    title: 'Отбеливание зубов',
    description: 'Осветлили эмаль на несколько тонов за один визит.',
    before: '/cases/case-5-before.png',
    after: '/cases/case-5-after.png',
  },
  {
    id: 'udalenie-zuba',
    serviceSlug: 'khirurgiya',
    title: 'Удаление зуба мудрости',
    description: 'Атравматичное удаление с быстрым и комфортным восстановлением.',
    before: '/cases/case-6-before.png',
    after: '/cases/case-6-after.png',
  },
]

// Услуги, для которых есть примеры работ — используются как фильтры на странице /primery-rabot/
export function getBeforeAfterServiceSlugs(): string[] {
  return Array.from(new Set(beforeAfterCases.map((c) => c.serviceSlug)))
}