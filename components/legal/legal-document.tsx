import Link from 'next/link'
import { Download, FileText } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cities, type City } from '@/config/cities'
import { getLegalDocumentFile, legalDocHref, type LegalDocument } from '@/config/legal'

/*
 * Страница юридического документа. Сам текст живёт в PDF (см. config/legal.ts):
 * так документ, который утвердил юрист клиники, попадает на сайт один в один,
 * без переноса в разметку. Пока файла нет — заглушка с описанием, что это за
 * документ, чтобы ссылки из форм и подвала уже работали.
 */
export function LegalDocumentPage({ doc, city }: { doc: LegalDocument; city?: City }) {
  const file = getLegalDocumentFile(doc, city?.slug)
  const prefix = city ? `/${city.slug}` : ''
  // На странице сети (без города) при разных документах по городам
  // показываем ссылки на городские версии вместо одного файла.
  const cityFiles = !city
    ? cities.map((c) => ({ city: c, file: getLegalDocumentFile(doc, c.slug) })).filter((x) => x.file)
    : []

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={prefix || '/'} />}>Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{doc.shortTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {doc.title}
      </h1>
      {city && (
        <p className="mt-3 text-muted-foreground">
          Оператор персональных данных: {city.legal.entityName}, УНП {city.legal.unp},{' '}
          {city.legal.legalAddress}.
        </p>
      )}

      {file ? (
        <div className="mt-8 flex flex-col gap-4">
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Download className="size-4" />
            Открыть PDF
          </a>
          <div className="overflow-hidden rounded-2xl border border-border bg-muted/40">
            <iframe src={file} title={doc.title} className="h-[70vh] w-full border-0" />
          </div>
        </div>
      ) : cityFiles.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-3">
          {cityFiles.map(({ city: c }) => (
            <li key={c.slug}>
              <Link
                href={legalDocHref(doc.slug, c.slug)}
                className="inline-flex items-center gap-2 text-foreground underline underline-offset-4 hover:text-primary"
              >
                <FileText className="size-4" />
                {doc.shortTitle} — {c.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/30 p-6">
          <p className="font-medium text-foreground">Документ готовится к публикации.</p>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{doc.description}</p>
          {city && (
            <p className="mt-4 text-sm text-muted-foreground">
              По вопросам обработки персональных данных пишите на {city.legal.privacyEmail} или звоните{' '}
              <a href={city.phoneHref} className="font-medium text-foreground underline underline-offset-2">
                {city.phone}
              </a>
              .
            </p>
          )}
        </div>
      )}
    </section>
  )
}
