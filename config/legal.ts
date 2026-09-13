// Юридические документы сайта: политика обработки персональных данных,
// условия согласия и политика cookie. Сами тексты готовит клиника (или её
// юрист) — сайт только показывает готовые PDF и даёт на них ссылки из форм
// и подвала.
//
// Как подключить документ (для не-разработчика):
//   1. Положите PDF в папку public/docs/, например public/docs/politika-minsk.pdf.
//   2. Ниже в поле `files` укажите путь к файлу без «public»:
//        files: { minsk: '/docs/politika-minsk.pdf' }
//      Если документ один на все клиники (одно юрлицо) — используйте ключ all:
//        files: { all: '/docs/politika.pdf' }
//      Если у городов разные юрлица — по ключу на город: minsk, rogachev, zhlobin.
//   3. Пока файла нет, страница документа показывает заглушку «документ
//      готовится», а ссылки из форм продолжают на неё вести — ничего не ломается.
//
// Slug документа — это его адрес: /minsk/dokumenty/<slug>/. Не переименовывайте
// slug после публикации: на него могут ссылаться из чекбокса согласия.

import type { City } from './cities'

export type LegalDocSlug = 'politika-konfidencialnosti' | 'soglasie' | 'politika-cookie'

export interface LegalDocument {
  slug: LegalDocSlug
  title: string
  /** Короткое название для ссылок в подвале и формах. */
  shortTitle: string
  /**
   * Что это за документ и зачем он нужен — показывается в заглушке, пока
   * файл не загружен, чтобы владелец клиники видел, чего не хватает.
   */
  description: string
  /** Пути к PDF: общий `all` или по slug города. Пустой объект — документа пока нет. */
  files: { all?: string } & Partial<Record<City['slug'], string>>
}

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'politika-konfidencialnosti',
    title: 'Политика в отношении обработки персональных данных',
    shortTitle: 'Политика обработки персональных данных',
    description:
      'Обязательный документ по ст. 17 Закона РБ «О защите персональных данных»: кто оператор (наименование, адрес, УНП), какие данные и с какой целью обрабатываются, кому передаются, сколько хранятся, какие права есть у пациента и как их реализовать. Должен быть опубликован до того, как форма записи начнёт принимать заявки.',
    files: {},
  },
  {
    slug: 'soglasie',
    title: 'Условия согласия на обработку персональных данных и разъяснение прав',
    shortTitle: 'Условия согласия',
    description:
      'Текст, который пациент принимает галочкой в форме записи: перечень данных (имя, телефон, содержание заявки, в том числе сведения о состоянии здоровья), цели, срок согласия, перечень действий, уполномоченные лица. Отдельным блоком — разъяснение прав простым языком и последствия отказа (ст. 5 п. 5 Закона). Если пациенту нет 16 лет, согласие даёт родитель.',
    files: {},
  },
  {
    slug: 'politika-cookie',
    title: 'Политика в отношении файлов cookie',
    shortTitle: 'Политика cookie',
    description:
      'Какие cookie использует сайт, зачем, сколько хранятся, куда передаются. Сейчас сайт ставит только одну техническую cookie (запоминает, что подсказку о городе закрыли), которая согласия не требует. Если подключите аналитику или рекламные пиксели — понадобится баннер согласия, см. docs/ГДЕ-ЧТО-МЕНЯТЬ.md.',
    files: {},
  },
]

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((d) => d.slug === slug)
}

/** Файл документа для города: сначала городской, затем общий `all`. */
export function getLegalDocumentFile(doc: LegalDocument, citySlug?: string): string | undefined {
  if (citySlug && doc.files[citySlug as City['slug']]) return doc.files[citySlug as City['slug']]
  return doc.files.all
}

/**
 * Адрес страницы документа. С городом — /minsk/dokumenty/<slug>/, без города
 * (страницы сети) — /dokumenty/<slug>/.
 */
export function legalDocHref(slug: LegalDocSlug, citySlug?: string | null): string {
  return citySlug ? `/${citySlug}/dokumenty/${slug}/` : `/dokumenty/${slug}/`
}
