// Города, у которых опубликована страница «Гарантии» (/<город>/garantii/).
// Отдельно от config/guarantees.ts, потому что ссылку показывает клиентский
// подвал: импорт полного конфига утянул бы всю выжимку положения в JS каждой
// страницы.
//
// Город попадает сюда только после того, как положение утверждено приказом
// и его PDF лежит в public/docs/<город>/. Пока список пуст, страница не
// открывается (404), а ссылки на неё с главной, «Документов» и подвала
// не показываются.
//
// Жлобин: выжимка уже готова (config/guarantees.ts), ждём утверждённый
// приказ — проект от 09.09.2026 без номера лежит в docs/drafts/. Когда
// придёт финальный PDF: положить в public/docs/zhlobin/polozhenie-o-garantiyah.pdf,
// сверить сроки с приложениями и вписать сюда 'zhlobin'.
export const GUARANTEE_PAGE_CITIES: readonly string[] = []

export function hasGuaranteePage(citySlug: string | null | undefined): citySlug is string {
  return !!citySlug && GUARANTEE_PAGE_CITIES.includes(citySlug)
}

/** Адрес страницы гарантий города или undefined, если положения ещё нет. */
export function guaranteePageHref(citySlug: string | null | undefined): string | undefined {
  return hasGuaranteePage(citySlug) ? `/${citySlug}/garantii/` : undefined
}
