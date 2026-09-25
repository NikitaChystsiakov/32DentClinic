'use client'

import * as React from 'react'
import { MapPin } from 'lucide-react'

import { MessengerIcon } from '@/components/icons/messenger-icon'
import { cities } from '@/config/cities'
import { cityMessengerHref, type MessengerId } from '@/lib/messengers'
import { cn } from '@/lib/utils'

/*
 * Мессенджеры на страницах сети (хаб, блог, документы), где город не выбран.
 * У каждой клиники свой номер, поэтому кнопка не ведёт в один общий чат, а
 * открывает список клиник: «Минск», «Рогачёв», «Жлобин» — каждый пункт ведёт
 * в чат своего города. В список попадают только города со своей ссылкой
 * (cityMessengerHref): Telegram без канала города или MAX без ссылки чата не
 * подменяются общими. Мессенджер, которого нет ни у одного города, не
 * показывается вовсе.
 */

const MESSENGERS: { id: MessengerId; label: string }[] = [
  { id: 'viber', label: 'Viber' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'max', label: 'MAX' },
]

interface CityLink {
  slug: string
  name: string
  href: string
  external: boolean
}

function linksFor(id: MessengerId): CityLink[] {
  return cities.flatMap((city) => {
    const href = cityMessengerHref(city, id)
    // Viber — deep link viber://, открывается приложением в той же вкладке.
    return href ? [{ slug: city.slug, name: city.name, href, external: id !== 'viber' }] : []
  })
}

/** Мессенджеры, у которых есть хотя бы один город со своей ссылкой. */
export const networkMessengers = MESSENGERS.map((m) => ({ ...m, links: linksFor(m.id) })).filter(
  (m) => m.links.length > 0
)

export function MessengerCityPicker({
  id,
  label,
  links,
  side,
  buttonClassName,
  iconClassName,
}: {
  id: MessengerId
  label: string
  links: CityLink[]
  /** Куда раскрывается список: вниз (шапка) или влево (боковая плашка). */
  side: 'bottom' | 'left'
  buttonClassName: string
  iconClassName: string
}) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const menuId = React.useId()

  React.useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Написать в ${label}: выбрать клинику`}
        aria-expanded={open}
        aria-controls={menuId}
        title={`Написать в ${label}`}
        className={buttonClassName}
      >
        <MessengerIcon id={id} className={iconClassName} />
      </button>
      {open && (
        <div
          id={menuId}
          className={cn(
            'absolute z-50 w-60 overflow-hidden rounded-xl border border-border bg-background p-1 shadow-lg',
            side === 'bottom' ? 'top-full right-0 mt-1' : 'right-full bottom-0 mr-3'
          )}
        >
          <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground">{label} — какая клиника?</p>
          {links.map((link) => (
            <a
              key={link.slug}
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <MapPin className="size-3.5 text-muted-foreground" />
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
