'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useClientGeo } from '@/lib/use-client-geo'

const COOKIE_NAME = 'geo-dismissed'
const COOKIE_DAYS = 30

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

/**
 * Город определяется только на клиенте. Раньше сюда приходила ещё серверная
 * подсказка из заголовков, которые ставил middleware, но она давно не
 * работала: NextRequest.geo убрали в Next 15, поэтому заголовки не ставились
 * никогда. Зато ради чтения этих заголовков корневой layout вызывал headers()
 * и лишал статики весь сайт. Серверный путь удалён — работает то же, что и
 * работало.
 */
export function GeoBanner() {
  const pathname = usePathname()
  const detectedCity = useClientGeo()
  const [dismissed, setDismissed] = React.useState(true)

  React.useEffect(() => {
    if (pathname === '/' && detectedCity && !getCookie(COOKIE_NAME)) {
      setDismissed(false)
    }
  }, [detectedCity, pathname])

  function dismiss() {
    setDismissed(true)
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS)
  }

  if (pathname !== '/' || !detectedCity || dismissed) return null

  return (
    <div
      className={cn(
        'relative z-50 flex items-center justify-center gap-3 border-b border-primary/20 bg-primary/5 px-4 py-2.5 text-sm backdrop-blur-sm'
      )}
    >
      <MapPin className="size-4 shrink-0 text-primary" />
      <span className="text-foreground/80">
        Вы из <strong className="font-semibold text-foreground">{detectedCity.name}</strong>? Перейти на локальный сайт
      </span>
      <Link
        href={`/${detectedCity.slug}`}
        className="ml-1 inline-flex items-center rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Перейти
      </Link>
      <button
        type="button"
        onClick={dismiss}
        className="ml-1 inline-flex items-center rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
      >
        Остаться здесь
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Закрыть"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
