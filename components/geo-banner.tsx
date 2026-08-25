'use client'

import * as React from 'react'
import Link from 'next/link'
import { X, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface GeoBannerProps {
  suggestedCity: { slug: string; name: string } | null
}

export function GeoBanner({ suggestedCity }: GeoBannerProps) {
  const [dismissed, setDismissed] = React.useState(true)

  React.useEffect(() => {
    if (suggestedCity && !getCookie(COOKIE_NAME)) {
      setDismissed(false)
    }
  }, [suggestedCity])

  function dismiss() {
    setDismissed(true)
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS)
  }

  if (!suggestedCity || dismissed) return null

  return (
    <div
      className={cn(
        'relative z-50 flex items-center justify-center gap-3 border-b border-primary/20 bg-primary/5 px-4 py-2.5 text-sm backdrop-blur-sm'
      )}
    >
      <MapPin className="size-4 shrink-0 text-primary" />
      <span className="text-foreground/80">
        Вы из <strong className="font-semibold text-foreground">{suggestedCity.name}</strong>? Перейти на локальный сайт
      </span>
      <Link
        href={`/${suggestedCity.slug}`}
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
