export interface CityHours {
  days: string
  time: string
}

const PLACEHOLDER_FALLBACK = 'Часы работы уточняйте по телефону'

/**
 * Строка вида «Понедельник — Пятница: 09:00 – 21:00 · Суббота: 10:00 – 17:00»
 * для текущего города — или плейсхолдер, если часы ещё не подтверждены
 * (в content/*.ts дни/время помечены [TODO: ...]). Города не должны молча
 * наследовать чужие часы работы, поэтому единственный fallback здесь —
 * этот плейсхолдер, а не хардкод часов другого города.
 */
export function formatCityHours(hours: CityHours[]): string {
  const isPlaceholder = hours.some((h) => h.time.includes('TODO') || h.days.includes('TODO'))
  if (isPlaceholder) return PLACEHOLDER_FALLBACK
  return hours.map((h) => `${h.days}: ${h.time}`).join(' · ')
}
