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
const DAY_ABBR: Record<string, string> = {
  понедельник: 'Пн',
  вторник: 'Вт',
  среда: 'Ср',
  четверг: 'Чт',
  пятница: 'Пт',
  суббота: 'Сб',
  воскресенье: 'Вс',
}

/**
 * «Пн–Пт 8:00–20:00, Сб 10:00–17:00» — для description, где полная строка
 * («Понедельник — Пятница 8:00 – 20:00, Суббота — Воскресенье выходной»)
 * съедала весь лимит. Выходные дни пропускаются; если часы не подтверждены — ''.
 */
export function formatCityHoursShort(hours: CityHours[]): string {
  if (hours.some((h) => h.time.includes('TODO') || h.days.includes('TODO'))) return ''
  return hours
    .filter((h) => /\d/.test(h.time))
    .map((h) => {
      const days = h.days
        .toLowerCase()
        .split(/\s*[–—-]\s*/)
        .map((d) => DAY_ABBR[d.trim()] ?? d.trim())
        .join('–')
      return `${days} ${h.time.replace(/\s*[–—-]\s*/, '–')}`
    })
    .join(', ')
}

export function formatCityHours(hours: CityHours[]): string {
  const isPlaceholder = hours.some((h) => h.time.includes('TODO') || h.days.includes('TODO'))
  if (isPlaceholder) return PLACEHOLDER_FALLBACK
  return hours.map((h) => `${h.days}: ${h.time}`).join(' · ')
}
