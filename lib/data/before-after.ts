// Примеры работ «до/после». Единый источник для страницы /<город>/primery-rabot/
// и тизера на главной.
//
// ЮРИДИЧЕСКИЕ ПРАВИЛА (Закон РБ «О рекламе», ст. 15; врачебная тайна —
// ст. 46 Закона «О здравоохранении»; Закон «О защите персональных данных»):
//
//   1. Публикуем только работы, на которые есть ПИСЬМЕННОЕ согласие пациента
//      на публикацию именно этих фото на сайте. Оригинал хранится в клинике,
//      здесь — дата и номер (`consent`), чтобы при проверке найти за минуту.
//      Без заполненного `consent` кейс на сайт не попадает — это проверяет
//      тип: поле обязательное.
//   2. Подпись — только техническая: что за работа, какая система/материал,
//      сколько единиц, кто выполнил. Это описание УСЛУГИ, а не случая.
//   3. Нельзя: диагноз и жалобы пациента («обратилась со сколом», «болел
//      зуб»), сроки и ход лечения («за полтора года», «за один визит»),
//      ощущения («безболезненно», «комфортно»), оценки результата
//      («идеально», «навсегда», «как свои») и любые обещания — это «ссылка на
//      конкретный случай излечения / улучшения состояния» и «гарантия
//      эффекта», запрещённые ст. 15. Для таких полей в структуре просто нет места.
//   4. Лицо пациента — только если согласие на изображение дано отдельно;
//      безопаснее кадрировать до зубов.
//   5. Кейс привязан к клинике (`citySlug`) и врачу (`doctorSlug`): работа
//      жлобинского врача не показывается в Минске.
//
// Пока реальных кейсов с согласиями нет, страницы показывают иллюстрации
// (`illustrations` ниже) — схематичные примеры видов работ без привязки к
// врачу и пациенту и без блока о согласии. Как появится хотя бы один
// реальный кейс города — иллюстрации в этом городе перестают показываться.
//
// Для не-разработчика: чтобы добавить работу, скопируйте блок в `cases`,
// положите два фото в public/cases/ и заполните все поля. `doctorSlug` — из
// config/doctors.ts, `serviceSlug` — из config/services.ts.

import type { City } from '@/config/cities'
import { getDoctorBySlug, type Doctor } from '@/config/doctors'
import { getServicesForCity } from '@/config/services'

export interface BeforeAfterCase {
  id: string
  /** Клиника, где выполнена работа — кейс показывается только на её страницах. */
  citySlug: City['slug']
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
  /** slug врача из config/doctors.ts — имя, специализация и фото подтянутся сами. */
  doctorSlug: string
  /** Письменное согласие пациента на публикацию этих фото: дата и номер/имя файла в клинике. */
  consent: { date: string; ref: string }
}

/** Иллюстрация вида работы — не фото пациента клиники. Без врача и согласия. */
export interface BeforeAfterIllustration {
  id: string
  serviceSlug: string
  title: string
  work: string
  before: string
  after: string
}

/**
 * Реальные работы с согласиями. У клиники они уже есть в Instagram — но
 * публикация в Instagram не равна согласию на публикацию на сайте: перед
 * переносом у пациента берётся отдельное письменное согласие (или проверяется,
 * что в уже подписанном согласии сайт клиники указан как место публикации).
 *
 * Шаблон записи — скопировать, заполнить, фото положить в public/cases/:
 *
 *   {
 *     id: 'minsk-viniry-01',                     // латиницей, уникальный
 *     citySlug: 'minsk',
 *     serviceSlug: 'protezirovanie',             // из config/services.ts
 *     title: 'Керамические виниры',
 *     work: 'Виниры E.max, 8 единиц, верхняя челюсть',
 *     before: '/cases/minsk-viniry-01-before.webp',
 *     after: '/cases/minsk-viniry-01-after.webp',
 *     doctorSlug: 'belousova-tatyana',           // из config/doctors.ts
 *     consent: { date: '12.09.2026', ref: 'согласие № 14/2026' },
 *   },
 *
 * Фото: 1600×1200 (4:3), webp ≤ 100 КБ — `pnpm optimize-images`; лицо
 * кадрировать, если на него нет отдельного согласия.
 */
export const cases: BeforeAfterCase[] = []

/*
 * Иллюстрации на время, пока реальные работы не перенесены из Instagram.
 * Картинки public/cases/*.png — не фотографии пациентов 32Дент, поэтому к
 * врачам они не привязаны и без блока «опубликовано с согласия». Как только в
 * `cases` появится хотя бы одна работа города, иллюстрации там пропадают.
 */
export const illustrations: BeforeAfterIllustration[] = [
  {
    id: 'restavraciya-zuba',
    serviceSlug: 'terapevticheskaya-stomatologiya',
    title: 'Художественная реставрация',
    work: 'Прямая реставрация композитом светового отверждения, 1 единица',
    before: '/cases/case-1-before.png',
    after: '/cases/case-1-after.png',
  },
  {
    id: 'ispravlenie-prikusa',
    serviceSlug: 'ortodontiya',
    title: 'Ортодонтическое лечение',
    work: 'Брекет-система на обе челюсти',
    before: '/cases/case-2-before.png',
    after: '/cases/case-2-after.png',
  },
  {
    id: 'odinochnaya-implantaciya',
    serviceSlug: 'implantaciya',
    title: 'Одиночная имплантация',
    work: 'Имплант с коронкой из диоксида циркония, 1 единица',
    before: '/cases/case-3-before.png',
    after: '/cases/case-3-after.png',
  },
  {
    id: 'protezirovanie-na-implantah',
    serviceSlug: 'protezirovanie',
    title: 'Протезирование на имплантах',
    work: 'Несъёмная конструкция на имплантах, полная челюсть',
    before: '/cases/case-4-before.png',
    after: '/cases/case-4-after.png',
  },
  {
    id: 'otbelivanie',
    serviceSlug: 'prof-gigiena-i-otbelivanie',
    title: 'Профессиональная гигиена и отбеливание',
    work: 'Снятие налёта и камня, полировка, кабинетное отбеливание',
    before: '/cases/case-5-before.png',
    after: '/cases/case-5-after.png',
  },
  {
    id: 'udalenie-zuba',
    serviceSlug: 'khirurgiya',
    title: 'Удаление зуба мудрости',
    work: 'Удаление ретинированного третьего моляра',
    before: '/cases/case-6-before.png',
    after: '/cases/case-6-after.png',
  },
]

/** Карточка для рендера: либо реальный кейс с врачом, либо иллюстрация. */
export type GalleryItem =
  | { kind: 'case'; item: BeforeAfterCase; doctor: Doctor }
  | { kind: 'illustration'; item: BeforeAfterIllustration }

/**
 * Что показывать в городе: реальные работы этой клиники, у которых есть
 * согласие и существующий врач; если таких нет — иллюстрации.
 */
export function getGalleryItemsForCity(citySlug: string): GalleryItem[] {
  const real: GalleryItem[] = []
  for (const item of cases) {
    if (item.citySlug !== citySlug) continue
    if (!item.consent?.date || !item.consent?.ref) continue
    const doctor = getDoctorBySlug(item.doctorSlug)
    if (!doctor || doctor.isPlaceholder) continue
    real.push({ kind: 'case', item, doctor })
  }
  if (real.length > 0) return real
  // Иллюстрации — только по направлениям, которые есть в этом городе:
  // ортодонтия только в Минске, и в Рогачёве карточка «Ортодонтическое
  // лечение» вела бы в услугу, которой там нет.
  const available = new Set(getServicesForCity(citySlug).map((s) => s.slug))
  return illustrations
    .filter((item) => available.has(item.serviceSlug))
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
