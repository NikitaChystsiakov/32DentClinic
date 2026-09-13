'use client'

import * as React from 'react'
import { MapPin, Navigation } from 'lucide-react'

/*
 * Карта Яндекса, которая загружается только по клику. Встроенный iframe
 * Яндекс.Карт ставит свои cookie сразу при открытии страницы — по позиции
 * НЦЗПД это «целевые» cookie третьего лица, на которые нужно согласие и
 * cookie-баннер. Пока карта не загружена, ни одного запроса к Яндексу нет,
 * поэтому баннер не нужен: человек сам нажимает «Показать карту», и это
 * и есть его действие. Ссылка «Проложить маршрут» просто открывает
 * Яндекс.Карты в новой вкладке.
 */
export function LazyMap({
  embedSrc,
  externalHref,
  title,
  address,
}: {
  embedSrc: string
  externalHref: string
  title: string
  address: string
}) {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-sm sm:aspect-4/3">
        {loaded ? (
          <iframe src={embedSrc} className="absolute inset-0 size-full border-0" title={title} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <MapPin className="size-8 text-primary" />
            <p className="max-w-xs text-sm text-muted-foreground">{address}</p>
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Показать карту
            </button>
            <p className="max-w-xs text-xs text-muted-foreground">
              Карта загружается с сервиса Яндекс.Карты, который использует свои файлы cookie.
            </p>
          </div>
        )}
      </div>

      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Navigation className="size-4" />
        Проложить маршрут
      </a>
    </div>
  )
}
