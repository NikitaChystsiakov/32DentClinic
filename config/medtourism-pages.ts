// Города, у которых есть страница для пациентов из России
// (/<город>/medturizm/). Отдельно от content/medtourism.ts, потому что ссылку
// в меню показывают клиентские компоненты: импорт полного контента утянул бы
// все тексты страницы в JS каждой страницы. Список держать в синхроне с
// ключами medTourismContents.
export const MEDTOURISM_PAGE_CITIES: readonly string[] = ['minsk']

/** Адрес страницы медтуризма города или undefined, если её там нет. */
export function medTourismPageHref(citySlug: string | null | undefined): string | undefined {
  return citySlug && MEDTOURISM_PAGE_CITIES.includes(citySlug) ? `/${citySlug}/medturizm/` : undefined
}
