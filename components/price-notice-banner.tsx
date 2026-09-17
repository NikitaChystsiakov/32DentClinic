'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

import { siteConfig } from '@/lib/site-config'

/*
 * Плашка «цены ориентировочные» слева внизу. Идея подсмотрена у Ю-Клиник:
 * та же подпись, что и под прайсом (siteConfig.priceNotice), но пользователь
 * её точно видел, а не пролистал мелкий серый текст в конце страницы —
 * это важно для позиции «на сайте не публичная оферта» (ст. 407 ГК).
 *
 * Показывается только там, где есть цифры: /ceny, /kalkulyator, /uslugi.
 * На всём сайте не нужна — раздражает и заслоняет контент. Закрытие
 * запоминается в localStorage на 30 дней: кто уже прочитал, не должен
 * видеть её при каждом заходе.
 */
const STORAGE_KEY = 'price-notice-dismissed'
const DISMISS_DAYS = 30

function hasPrices(pathname: string) {
  return /\/(ceny|kalkulyator|uslugi)(\/|$)/.test(pathname)
}

function readDismissed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    return Date.now() - Number(raw) < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export function PriceNoticeBanner() {
  const pathname = usePathname()
  // null — ещё не читали localStorage (на сервере и в первый рендер),
  // чтобы плашка не мигала у тех, кто её уже закрыл.
  const [visible, setVisible] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    setVisible(!readDismissed())
  }, [])

  if (!visible || !hasPrices(pathname)) return null

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    } catch {
      // приватный режим — просто закрываем до перезагрузки
    }
  }

  return (
    // Снизу на телефоне — над MobileBottomNav (bottom-0, ~64px), поэтому
    // bottom-20; с lg панели нет, а справа висят мессенджеры — плашка слева.
    <aside
      role="note"
      aria-label="Уточнение о ценах"
      className="fixed inset-x-4 bottom-20 z-40 mx-auto max-w-sm rounded-xl border border-border bg-background/97 p-4 pr-10 text-sm leading-relaxed text-muted-foreground shadow-lg shadow-black/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300 lg:inset-x-auto lg:left-6 lg:bottom-6 lg:mx-0 lg:max-w-xs"
    >
      <p className="mb-1 font-medium text-foreground">Уважаемые пациенты</p>
      <p>{siteConfig.priceNotice}</p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Закрыть"
        className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <X className="size-4" />
      </button>
    </aside>
  )
}
