/*
 * Структурированные данные schema.org на странице. Один компонент на один
 * объект; данные собирают хелперы из lib/seo.ts (breadcrumbJsonLd,
 * faqJsonLd) или страница сама. Экранируем «<», чтобы содержимое не могло
 * закрыть тег script — стандартная мера для JSON внутри HTML.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
