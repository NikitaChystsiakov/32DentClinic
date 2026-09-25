import type { Metadata } from 'next'
import type { City } from '@/config/cities'
import { getNearbyTownsForCity } from '@/config/nearby-towns'
import type { CityHours } from '@/lib/format-hours'
import { siteConfig } from '@/lib/site-config'

/*
 * Единая сборка метаданных страницы: title, description, canonical и
 * Open Graph за один вызов. Зачем это нужно, а не просто `return { title }`:
 *
 *   • canonical в Next наследуется вниз по layout'ам. Раньше он был задан в
 *     app/[city]/layout.tsx, и у всех подстраниц города canonical указывал
 *     на главную города — для поисковика это «всё остальное дубли».
 *     Поэтому canonical задаёт каждая страница сама, абсолютным адресом.
 *   • Адреса — со слешем на конце, как их отдаёт хостинг (trailingSlash в
 *     next.config.mjs). Относительный путь через metadataBase Next
 *     нормализует без слеша, поэтому собираем строку руками.
 *   • openGraph из title не наследуется: если страница задала свой
 *     openGraph, поля из layout затираются целиком. Хелпер заполняет всё.
 *
 * Для не-разработчика: тексты title/description здесь не лежат — они в
 * config/cities.ts, config/services.ts, config/implantation.ts и т. д.
 */

interface BuildMetadataOptions {
  /** Собственная часть title. Шаблон « | 32Дент, Рогачёв» добавит layout города. */
  title: string
  description: string
  /** Путь страницы от корня сайта, со слешем на конце: '/minsk/uslugi/'. */
  path: string
  /**
   * Город страницы — для суффикса в og:title. У страниц без города (хаб,
   * блог) суффикс — название сети.
   */
  city?: City
  /** true — title выводится как есть, без шаблона layout (главные городов, хаб). */
  absoluteTitle?: boolean
  /** true — страница не индексируется (заглушки, черновики). */
  noindex?: boolean
}

/**
 * Картинка для превью ссылки. Файл app/opengraph-image.png Next сам
 * подхватывает только для страниц, которые не задают openGraph; страница,
 * задавшая свой openGraph, теряет её (объект заменяется целиком) — поэтому
 * картинка подставляется явно в каждый набор метаданных.
 */
export const OG_IMAGE = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: 'Сеть стоматологий 32Дент — Минск, Рогачёв, Жлобин',
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${siteConfig.siteUrl}${normalized}`
}

export function buildMetadata({
  title,
  description,
  path,
  city,
  absoluteTitle = false,
  noindex = false,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path)
  const suffix = city ? `${city.brandName}, ${city.name}` : siteConfig.name
  const fullTitle = absoluteTitle ? title : `${title} | ${suffix}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'ru_BY',
      type: 'website',
      images: [OG_IMAGE],
    },
  }
}

/**
 * Обрезка description по границе слова. Раньше было `intro.slice(0, 155)`
 * — в выдаче получалось «…3D-снимок (КЛКТ) показывает» с оборванным
 * словом. Google показывает ~155–160 знаков, Яндекс — до ~200.
 */
export function truncateDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut
  return `${base.replace(/[,;:—\-–\s]+$/, '')}…`
}

/** Элемент хлебных крошек для schema.org BreadcrumbList. */
export interface BreadcrumbEntry {
  name: string
  /** Путь от корня со слешем на конце; у последнего элемента можно не указывать. */
  path?: string
}

export function breadcrumbJsonLd(items: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  }
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/**
 * Часы работы из content.contacts.hours → schema.org OpeningHoursSpecification.
 * Понимает «Понедельник — Пятница», «Суббота», «выходной» и время вида
 * «8:00 – 19:00». Строки, которые разобрать не удалось (например,
 * «[TODO: заполнить]»), пропускаются — лучше без часов, чем с неверными.
 */
const DAY_NAMES: Record<string, string> = {
  понедельник: 'Monday',
  вторник: 'Tuesday',
  среда: 'Wednesday',
  четверг: 'Thursday',
  пятница: 'Friday',
  суббота: 'Saturday',
  воскресенье: 'Sunday',
}
const DAY_ORDER = Object.values(DAY_NAMES)

export function openingHoursJsonLd(hours: { days: string; time: string }[]) {
  const result: { '@type': string; dayOfWeek: string[]; opens: string; closes: string }[] = []

  for (const row of hours) {
    const time = row.time.match(/(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})/)
    if (!time) continue

    const names = row.days
      .toLowerCase()
      .split(/\s*[–—-]\s*/)
      .map((d) => DAY_NAMES[d.trim()])
      .filter(Boolean)
    if (names.length === 0) continue

    const days =
      names.length === 2
        ? DAY_ORDER.slice(DAY_ORDER.indexOf(names[0]), DAY_ORDER.indexOf(names[1]) + 1)
        : names

    const pad = (t: string) => t.padStart(5, '0')
    result.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens: pad(time[1]), closes: pad(time[2]) })
  }

  return result
}

/**
 * Схема клиники города (schema.org/Dentist) для локального поиска. Её
 * выводит layout города на всех его страницах и посадочная «соседнего»
 * города — для каждой клиники, куда она ведёт (см. components/town).
 * areaServed — соседние города, откуда клиника принимает пациентов: так
 * поисковик связывает жлобинскую клинику с запросами из Светлогорска без
 * выдуманного адреса в самом Светлогорске. aggregateRating намеренно нет и
 * не будет: оценки в lib/data/aggregators.ts собраны на 103.by, Яндексе,
 * Google и 2ГИС, а Google запрещает размечать рейтинг с чужих площадок и
 * отзывы организации о себе — за это ручные санкции, а не звёзды в выдаче.
 */
export function clinicJsonLd(city: City, hours: CityHours[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${absoluteUrl(`/${city.slug}/`)}#clinic`,
    name: `${city.brandName} ${city.name}`,
    url: absoluteUrl(`/${city.slug}/`),
    image: absoluteUrl(city.image),
    telephone: city.phoneHref.replace(/^tel:/, ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: city.address.replace(/^г\.\s*[^,]+,\s*/, ''),
      addressLocality: city.name,
      addressCountry: 'BY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
    },
    openingHoursSpecification: openingHoursJsonLd(hours),
    priceRange: 'BYN',
    currenciesAccepted: 'BYN',
    medicalSpecialty: 'Dentistry',
    parentOrganization: { '@type': 'MedicalOrganization', name: siteConfig.name, url: siteConfig.siteUrl },
    areaServed: [
      { '@type': 'City', name: city.name },
      ...getNearbyTownsForCity(city.slug).map((t) => ({
        '@type': 'City',
        name: t.name,
        containedInPlace: { '@type': 'AdministrativeArea', name: t.region },
      })),
    ],
  }
}
