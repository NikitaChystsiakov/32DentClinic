'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Tag, Percent, MapPin, CalendarCheck, Phone } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useBookingAction } from '@/components/booking-button'
import { useMobileMenu } from '@/components/mobile-menu-provider'
import { useCurrentCity } from '@/lib/hooks/use-current-city'
import { getCityContent } from '@/content'

type IconType = React.ComponentType<{ className?: string }>

function TabLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: IconType
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
        active ? 'text-primary' : 'text-muted-foreground active:text-foreground'
      )}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  )
}

/**
 * Вкладка «Записаться»: открывает форму, а для города без формы
 * (hasBookingForm: false) становится ссылкой «Позвонить» — см. useBookingAction.
 */
function BookingTab() {
  const { callOnly, phoneHref, open } = useBookingAction()
  const className =
    'flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground transition-transform active:scale-95 active:text-foreground'

  if (callOnly) {
    return (
      <a href={phoneHref} className={className}>
        <Phone className="size-5" />
        Позвонить
      </a>
    )
  }

  return (
    <button type="button" onClick={open} className={className}>
      <CalendarCheck className="size-5" />
      Записаться
    </button>
  )
}

/**
 * Нижняя мобильная навигация: бургер поднят над полосой, по краям — четыре
 * самых частых действия. Само меню живёт в MobileMenuProvider и общее с
 * бургером в шапке — здесь только кнопка, которая его открывает.
 */
export function MobileBottomNav() {
  const pathname = usePathname()
  const { openMenu } = useMobileMenu()
  const currentCity = useCurrentCity()
  const citySlug = currentCity?.slug
  const prefix = citySlug ? `/${citySlug}` : ''

  const promo = citySlug ? getCityContent(citySlug)?.promo : undefined
  const pricesHref = `${prefix}/ceny/`
  const contactsHref = `${prefix}/kontakty/`

  function isActive(href: string) {
    return pathname === href || (pathname?.startsWith(href) ?? false)
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-md [box-shadow:0_-8px_28px_-10px_rgb(15_23_42_/_0.18)] lg:hidden"
      aria-label="Мобильная навигация"
    >
      <div className="relative mx-auto grid h-16 max-w-md grid-cols-[1fr_1fr_4.5rem_1fr_1fr] items-center px-2">
        <TabLink href={pricesHref} label="Цены" icon={Tag} active={isActive(pricesHref)} />
        <TabLink href={promo?.href ?? pricesHref} label="Акции" icon={Percent} />
        <span aria-hidden />
        <BookingTab />
        <TabLink href={contactsHref} label="Контакты" icon={MapPin} active={isActive(contactsHref)} />

        <button
          type="button"
          aria-label="Открыть меню"
          onClick={openMenu}
          className="absolute left-1/2 -top-7 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/35 ring-4 ring-background transition-transform active:scale-95"
        >
          <Menu className="size-6" />
        </button>
      </div>
    </nav>
  )
}
