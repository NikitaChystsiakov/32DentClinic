import Link from 'next/link'
import { VALID_CITY_SLUGS } from '@/config/cities'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-foreground">
        Город не найден
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        К сожалению, мы пока не работаем в этом городе. 
        Выберите один из доступных городов:
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {VALID_CITY_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/${slug}/`}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {slug === 'minsk' && 'Минск'}
            {slug === 'rogachev' && 'Рогачёв'}
            {slug === 'zhlobin' && 'Жлобин'}
          </Link>
        ))}
      </div>
    </div>
  )
}
