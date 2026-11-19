// Города, у которых есть страница «Оплата, рассрочка и кредит»
// (/<город>/oplata/). Отдельно от content/payment.ts по той же причине, что и
// config/medtourism-pages.ts: ссылку показывают клиентские шапка, подвал и
// мобильное меню, и импорт всего контента утянул бы тексты страницы в JS
// каждой страницы. Список держать в синхроне с ключами paymentContents.
export const PAYMENT_PAGE_CITIES: readonly string[] = ['minsk']

/** Адрес страницы оплаты города или undefined, если её там нет. */
export function paymentPageHref(citySlug: string | null | undefined): string | undefined {
  return citySlug && PAYMENT_PAGE_CITIES.includes(citySlug) ? `/${citySlug}/oplata/` : undefined
}
