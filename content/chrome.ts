import type { CityPromo } from './types'

/*
 * То, что нужно шапке и футеру от каждого города: анонс в полосе под меню,
 * тег гарантии и часы работы. Вынесено из content/<город>.ts отдельно,
 * потому что шапка и футер — клиентские компоненты корневого layout: пока
 * они импортировали getCityContent, контент всех трёх городов (53 КБ)
 * целиком попадал в клиентский JS каждой страницы, включая хаб. Этот файл —
 * единственный источник этих трёх полей: content/<город>.ts берёт их отсюда,
 * так что редактировать нужно только здесь.
 */
export interface CityHours {
  days: string
  time: string
}

export interface CityChrome {
  /** Анонс в нижней полосе шапки. Нет анонса — undefined, полоса скроется. */
  promo?: CityPromo
  /** Короткий тег гарантии для футера. */
  guaranteeSummary: string
  hours: CityHours[]
}

export const cityChrome: Record<string, CityChrome> = {
  minsk: {
    promo: {
      text: 'Консультация имплантолога — 11 р., КТ сегмента — 24 р.',
      href: '/minsk/uslugi/implantaciya/',
    },
    // У Минска не «2 года на всё», а своя гарантия (см. content/minsk.ts).
    guaranteeSummary: 'Пожизненная гарантия производителя на импланты и до 15 лет на протезы.',
    hours: [
      { days: 'Понедельник — Пятница', time: '09:00 – 21:00' },
      { days: 'Суббота', time: '10:00 – 17:00' },
      { days: 'Воскресенье', time: 'выходной' },
    ],
  },
  rogachev: {
    promo: {
      text: 'Профессиональная гигиена с Air Flow — от 11 р. за зуб',
      href: '/rogachev/ceny/',
    },
    guaranteeSummary: 'Гарантия 2 года на все виды работ.',
    hours: [
      { days: 'Понедельник — Пятница', time: '8:00 – 20:00' },
      { days: 'Суббота — Воскресенье', time: 'выходной' },
    ],
  },
  zhlobin: {
    // Анонса нет: строку «Лечение кариеса от 100 р.» заказчик попросил убрать
    // (16.09.2026). Чтобы вернуть — promo: { text: '…', href: '/zhlobin/ceny/' }.
    promo: undefined,
    // Непроверенная копия с Рогачёва (см. TODO в шапке content/zhlobin.ts).
    guaranteeSummary: 'Гарантия 2 года на все виды работ.',
    hours: [
      { days: 'Понедельник — Пятница', time: '8:00 – 20:00' },
      { days: 'Суббота — Воскресенье', time: 'выходной' },
    ],
  },
}

export function getCityChrome(citySlug: string): CityChrome | undefined {
  return cityChrome[citySlug]
}
