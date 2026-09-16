import type { Metadata } from 'next'
import Link from 'next/link'

import { cities } from '@/config/cities'

// Общая 404 сайта: раньше её не было, и статический экспорт отдавал
// стандартную английскую страницу Next («404: This page could not be
// found»). Apache показывает out/404.html по ErrorDocument из public/.htaccess.
export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="font-heading text-6xl font-bold text-primary/30">404</p>
      <h1 className="mt-4 mb-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Такой страницы нет
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Возможно, ссылка устарела или в адресе опечатка. Выберите клинику — там есть услуги, цены и
        врачи вашего города.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/${city.slug}/`}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {city.name}
          </Link>
        ))}
        <Link
          href="/"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Все клиники сети
        </Link>
      </div>
    </div>
  )
}
