// Примеры работ «до/после». Единый источник для страницы /<город>/primery-rabot/
// и тизера на главной.
//
// ЮРИДИЧЕСКИЕ ПРАВИЛА (Закон РБ «О рекламе», ст. 15; врачебная тайна —
// ст. 46 Закона «О здравоохранении»; Закон «О защите персональных данных»):
//
//   1. Фото — сведения о здоровье пациента: публиковать их можно только с
//      его письменного согласия на размещение на сайте. Согласия собирает и
//      хранит клиника; сайт их не проверяет и не пишет о них под карточками
//      (решение заказчика 24.09.2026).
//   2. Работы подписаны клиникой, а не конкретным врачом (решение заказчика
//      24.09.2026): в карточке только вид работы и техническое описание.
//   3. Подпись — только техническая: что за работа, какая система/материал,
//      сколько единиц. Это описание УСЛУГИ, а не случая.
//   4. Нельзя: диагноз и жалобы пациента («обратилась со сколом», «болел
//      зуб»), сроки и ход лечения («за полтора года», «за один визит»),
//      ощущения («безболезненно», «комфортно»), оценки результата
//      («идеально», «навсегда», «как свои») и любые обещания — это «ссылка на
//      конкретный случай излечения / улучшения состояния» и «гарантия
//      эффекта», запрещённые ст. 15. Тексты постов из Instagram поэтому
//      не переносим — только вид работы.
//   5. Лицо пациента — только если согласие на изображение дано отдельно;
//      безопаснее кадрировать до зубов.
//   6. Кейс привязан к клиникам (`citySlugs`): работа жлобинской клиники не
//      показывается в Минске. Совместную работу клиник можно показать в
//      каждой из них.
//
// Пока у города нет реальных кейсов, его страницы показывают иллюстрации
// (`illustrations` ниже) — схематичные примеры видов работ. Как появится
// хотя бы один реальный кейс города — иллюстрации в этом городе пропадают.
//
// Для не-разработчика: чтобы добавить работу, скопируйте блок в `cases`,
// положите два фото в public/cases/ и заполните все поля. `serviceSlug` — из
// config/services.ts.

import type { City } from '@/config/cities'
import { getServicesForCity } from '@/config/services'

export interface BeforeAfterCase {
  id: string
  /**
   * Клиники, где выполнена работа — кейс показывается только на их страницах.
   * Несколько — если работа совместная или общая для клиник (Жлобин и Рогачёв).
   */
  citySlugs: City['slug'][]
  /** slug услуги из config/services.ts — для фильтра на странице примеров. */
  serviceSlug: string
  /** Вид работы, как в прайсе: «Керамические виниры», «Одиночная имплантация». */
  title: string
  /**
   * Техническая подпись: система, материал, объём работы.
   * Пример: «Имплант Straumann SLA, коронка из диоксида циркония, 1 единица».
   * Без диагноза, сроков, ощущений и оценок результата (см. правила выше).
   */
  work: string
  before: string
  after: string
}

/** Иллюстрация вида работы — не фото пациента клиники. */
export interface BeforeAfterIllustration {
  id: string
  /**
   * Города, где показывается иллюстрация. Наборы у городов разные: раньше
   * Рогачёв и Жлобин показывали одни и те же шесть картинок, и страницы
   * примеров выглядели копией друг друга (заказчик, 25.09.2026).
   */
  citySlugs: City['slug'][]
  serviceSlug: string
  title: string
  work: string
  before: string
  after: string
}

/**
 * Реальные работы клиник. Шаблон записи — скопировать, заполнить, фото
 * положить в public/cases/:
 *
 *   {
 *     id: 'minsk-viniry-01',                     // латиницей, уникальный
 *     citySlugs: ['minsk'],
 *     serviceSlug: 'protezirovanie',             // из config/services.ts
 *     title: 'Керамические виниры',
 *     work: 'Виниры E.max, 8 единиц, верхняя челюсть',
 *     before: '/cases/minsk-viniry-01-before.webp',
 *     after: '/cases/minsk-viniry-01-after.webp',
 *   },
 *
 * Фото: 4:3, webp ≤ 100 КБ, «до» и «после» кадрированы одинаково — слайдер
 * накладывает их друг на друга. Лицо кадрировать, если на него нет
 * отдельного согласия.
 */
export const cases: BeforeAfterCase[] = [
  // Минск — вырезаны из постов и рилс @32_dent_plus (заказчик, 24.09.2026).
  // Исходные скрины — в assets/cases-instagram/ (не в репо).
  {
    id: 'minsk-viniry',
    citySlugs: ['minsk'],
    serviceSlug: 'protezirovanie',
    title: 'Керамические виниры и накладки',
    work: 'Керамические виниры — 6 единиц, накладки — 4 единицы, коррекция десневого контура; верхняя челюсть',
    before: '/cases/minsk-viniry-before.webp',
    after: '/cases/minsk-viniry-after.webp',
  },
  {
    id: 'minsk-koronki-cirkoniy',
    citySlugs: ['minsk'],
    serviceSlug: 'protezirovanie',
    title: 'Коронки из диоксида циркония',
    work: 'Безметалловые коронки из диоксида циркония',
    before: '/cases/minsk-koronki-cirkoniy-before.webp',
    after: '/cases/minsk-koronki-cirkoniy-after.webp',
  },
  {
    id: 'minsk-all-on-6',
    citySlugs: ['minsk'],
    serviceSlug: 'implantaciya',
    title: 'Протезирование на имплантах All-on-6',
    work: 'Несъёмный протез с опорой на 6 имплантов',
    before: '/cases/minsk-all-on-6-before.webp',
    after: '/cases/minsk-all-on-6-after.webp',
  },
  {
    id: 'minsk-implantaciya-6-implantov',
    // Совместная работа клиник @32_dent_plus и @32_dent_stom — показываем
    // и в Жлобине с Рогачёвым.
    citySlugs: ['minsk', 'zhlobin', 'rogachev'],
    serviceSlug: 'implantaciya',
    title: 'Имплантация с немедленной нагрузкой',
    work: 'Импланты Megagen, 6 единиц, несъёмная конструкция с немедленной нагрузкой; верхняя челюсть',
    before: '/cases/minsk-implantaciya-6-implantov-before.webp',
    after: '/cases/minsk-implantaciya-6-implantov-after.webp',
  },
  {
    id: 'minsk-koronki-3d-skaner',
    citySlugs: ['minsk'],
    serviceSlug: 'protezirovanie',
    title: 'Коронки по цифровому слепку',
    work: 'Коронки на верхнюю челюсть, слепок снят 3D-сканером',
    before: '/cases/minsk-koronki-3d-skaner-before.webp',
    after: '/cases/minsk-koronki-3d-skaner-after.webp',
  },
  {
    id: 'minsk-nesemnoe-protezirovanie',
    // Совместная работа клиник @32_dent_plus и @32_dent_stom — показываем
    // и в Жлобине с Рогачёвым.
    citySlugs: ['minsk', 'zhlobin', 'rogachev'],
    serviceSlug: 'protezirovanie',
    title: 'Несъёмное протезирование',
    work: 'Несъёмные ортопедические конструкции',
    before: '/cases/minsk-nesemnoe-protezirovanie-before.webp',
    after: '/cases/minsk-nesemnoe-protezirovanie-after.webp',
  },
  // Три работы из рилс «Имплантация и протезирование» — объём по фото.
  {
    id: 'minsk-implantaciya-01',
    citySlugs: ['minsk'],
    serviceSlug: 'implantaciya',
    title: 'Имплантация и протезирование',
    work: 'Импланты и несъёмные коронки, верхняя челюсть',
    before: '/cases/minsk-implantaciya-01-before.webp',
    after: '/cases/minsk-implantaciya-01-after.webp',
  },
  {
    id: 'minsk-implantaciya-02',
    citySlugs: ['minsk'],
    serviceSlug: 'implantaciya',
    title: 'Имплантация и протезирование',
    work: 'Импланты и несъёмные коронки, верхняя челюсть',
    before: '/cases/minsk-implantaciya-02-before.webp',
    after: '/cases/minsk-implantaciya-02-after.webp',
  },
  {
    id: 'minsk-implantaciya-03',
    citySlugs: ['minsk'],
    serviceSlug: 'implantaciya',
    title: 'Имплантация и протезирование',
    work: 'Импланты и несъёмные коронки, верхняя челюсть',
    before: '/cases/minsk-implantaciya-03-before.webp',
    after: '/cases/minsk-implantaciya-03-after.webp',
  },
  // Жлобин и Рогачёв — общие работы, вырезаны из постов @32_dent_stom
  // (заказчик, 26.09.2026). Исходные скрины — в assets/cases-instagram/zhlobin-rogachev/
  // (не в репо).
  {
    id: 'regiony-restavraciya-rezcov',
    citySlugs: ['zhlobin', 'rogachev'],
    serviceSlug: 'terapevticheskaya-stomatologiya',
    title: 'Художественная реставрация',
    work: 'Восстановление формы двух центральных резцов, закрытие промежутка между ними; верхняя челюсть',
    before: '/cases/regiony-restavraciya-rezcov-before.webp',
    after: '/cases/regiony-restavraciya-rezcov-after.webp',
  },
  {
    id: 'regiony-restavraciya-frontalnoy-gruppy',
    citySlugs: ['zhlobin', 'rogachev'],
    serviceSlug: 'terapevticheskaya-stomatologiya',
    title: 'Художественная реставрация передних зубов',
    work: 'Восстановление формы передних зубов, закрытие промежутков между ними; верхняя челюсть',
    before: '/cases/regiony-restavraciya-frontalnoy-gruppy-before.webp',
    after: '/cases/regiony-restavraciya-frontalnoy-gruppy-after.webp',
  },
  {
    id: 'regiony-vosstanovlenie-perednih-zubov',
    citySlugs: ['zhlobin', 'rogachev'],
    serviceSlug: 'terapevticheskaya-stomatologiya',
    title: 'Эстетическое восстановление резцов',
    work: 'Восстановление формы и цвета резцов, закрытие промежутков между ними; верхняя челюсть',
    before: '/cases/regiony-vosstanovlenie-perednih-zubov-before.webp',
    after: '/cases/regiony-vosstanovlenie-perednih-zubov-after.webp',
  },
]

/*
 * Иллюстрации для городов, где реальных работ ещё нет (сейчас таких нет: с
 * 26.09.2026 у Рогачёва и Жлобина свои работы — набор оставлен на случай
 * новой клиники). У каждого города свой набор (`citySlugs`), чтобы страницы
 * примеров не повторяли друг друга. Картинки public/cases/*.png — не фотографии пациентов 32Дент. Как
 * только в `cases` появится хотя бы одна работа города, иллюстрации там пропадают.
 */
export const illustrations: BeforeAfterIllustration[] = [
  {
    id: 'restavraciya-zuba',
    citySlugs: ['rogachev'],
    serviceSlug: 'terapevticheskaya-stomatologiya',
    title: 'Художественная реставрация',
    work: 'Прямая реставрация композитом светового отверждения, 1 единица',
    before: '/cases/case-1-before.png',
    after: '/cases/case-1-after.png',
  },
  {
    id: 'ispravlenie-prikusa',
    // Ортодонтия есть только в Минске, а там показываются реальные работы.
    citySlugs: [],
    serviceSlug: 'ortodontiya',
    title: 'Ортодонтическое лечение',
    work: 'Брекет-система на обе челюсти',
    before: '/cases/case-2-before.png',
    after: '/cases/case-2-after.png',
  },
  {
    id: 'odinochnaya-implantaciya',
    citySlugs: ['rogachev'],
    serviceSlug: 'implantaciya',
    title: 'Одиночная имплантация',
    work: 'Имплант с коронкой из диоксида циркония, 1 единица',
    before: '/cases/case-3-before.png',
    after: '/cases/case-3-after.png',
  },
  {
    id: 'protezirovanie-na-implantah',
    citySlugs: ['zhlobin'],
    serviceSlug: 'protezirovanie',
    title: 'Протезирование на имплантах',
    work: 'Несъёмная конструкция на имплантах, полная челюсть',
    before: '/cases/case-4-before.png',
    after: '/cases/case-4-after.png',
  },
  {
    id: 'otbelivanie',
    citySlugs: ['rogachev'],
    serviceSlug: 'prof-gigiena-i-otbelivanie',
    title: 'Профессиональная гигиена и отбеливание',
    work: 'Снятие налёта и камня, полировка, кабинетное отбеливание',
    before: '/cases/case-5-before.png',
    after: '/cases/case-5-after.png',
  },
  {
    id: 'udalenie-zuba',
    citySlugs: ['zhlobin'],
    serviceSlug: 'khirurgiya',
    title: 'Удаление зуба мудрости',
    work: 'Удаление ретинированного третьего моляра',
    before: '/cases/case-6-before.png',
    after: '/cases/case-6-after.png',
  },
]

/** Карточка для рендера: либо реальная работа клиники, либо иллюстрация. */
export type GalleryItem =
  | { kind: 'case'; item: BeforeAfterCase }
  | { kind: 'illustration'; item: BeforeAfterIllustration }

/**
 * Что показывать в городе: реальные работы этой клиники; если таких нет —
 * иллюстрации.
 */
export function getGalleryItemsForCity(citySlug: string): GalleryItem[] {
  const real: GalleryItem[] = cases
    .filter((item) => item.citySlugs.includes(citySlug))
    .map((item) => ({ kind: 'case', item }))
  if (real.length > 0) return real
  // Иллюстрации — только по направлениям, которые есть в этом городе:
  // ортодонтия только в Минске, и в Рогачёве карточка «Ортодонтическое
  // лечение» вела бы в услугу, которой там нет.
  const available = new Set(getServicesForCity(citySlug).map((s) => s.slug))
  return illustrations
    .filter((item) => item.citySlugs.includes(citySlug) && available.has(item.serviceSlug))
    .map((item) => ({ kind: 'illustration', item }))
}

/** Есть ли у города хотя бы одна реальная работа (иначе показываются иллюстрации). */
export function hasRealCasesForCity(citySlug: string): boolean {
  return getGalleryItemsForCity(citySlug).some((g) => g.kind === 'case')
}

/** Услуги, по которым есть карточки в городе — фильтры на странице примеров. */
export function getGalleryServiceSlugs(citySlug: string): string[] {
  return Array.from(new Set(getGalleryItemsForCity(citySlug).map((g) => g.item.serviceSlug)))
}
