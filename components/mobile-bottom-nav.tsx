'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Tag, Percent, MapPin, CalendarCheck, Phone } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useBookingModal } from '@/components/booking-modal-provider'
import { useCurrentCity } from '@/lib/hooks/use-current-city'
import { getCityContent } from '@/content'
import { cities } from '@/config/cities'
import { siteConfig } from '@/lib/site-config'

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

function TabButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: IconType
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-accent transition-transform active:scale-95"
    >
      <Icon className="size-5" />
      {label}
    </button>
  )
}

/**
 * Нижняя мобильная навигация: бургер поднят над полосой, по краям — четыре
 * самых частых действия. Полное меню (города, все разделы) живёт в Sheet,
 * который открывает бургер — это единственное мобильное меню на сайте.
 */
export function MobileBottomNav() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const { openBookingModal } = useBookingModal()
  const currentCity = useCurrentCity()
  const citySlug = currentCity?.slug
  const prefix = citySlug ? `/${citySlug}` : ''

  const navLinks = [
    { label: 'Услуги', href: `${prefix}/uslugi/` },
    { label: 'Врачи', href: `${prefix}/vrachi/` },
    { label: 'Цены', href: `${prefix}/ceny/` },
    { label: 'Примеры работ', href: `${prefix}/primery-rabot/` },
    { label: 'О нас', href: `${prefix}/o-nas/` },
    { label: 'Контакты', href: `${prefix}/kontakty/` },
  ]

  const address = currentCity?.address ?? siteConfig.address
  const phone = currentCity?.phone ?? siteConfig.phoneDisplay
  const phoneHref = currentCity?.phoneHref ?? siteConfig.phoneHref
  const promo = citySlug ? getCityContent(citySlug)?.promo : undefined
  const pricesHref = `${prefix}/ceny/`
  const contactsHref = `${prefix}/kontakty/`

  function isActive(href: string) {
    return pathname === href || (pathname?.startsWith(href) ?? false)
  }

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-md [box-shadow:0_-8px_28px_-10px_rgb(15_23_42_/_0.18)] lg:hidden"
        aria-label="Мобильная навигация"
      >
        <div className="relative mx-auto grid h-16 max-w-md grid-cols-[1fr_1fr_4.5rem_1fr_1fr] items-center px-2">
          <TabLink href={pricesHref} label="Цены" icon={Tag} active={isActive(pricesHref)} />
          <TabLink href={promo?.href ?? pricesHref} label="Акции" icon={Percent} />
          <span aria-hidden />
          <TabButton label="Записаться" icon={CalendarCheck} onClick={() => openBookingModal()} />
          <TabLink href={contactsHref} label="Контакты" icon={MapPin} active={isActive(contactsHref)} />

          <button
            type="button"
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="absolute left-1/2 -top-7 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/35 ring-4 ring-background transition-transform active:scale-95"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="flex w-full max-w-none flex-col gap-0 sm:max-w-none">
          <SheetHeader className="border-b border-border">
            <SheetTitle className="font-heading text-lg">Меню</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={cn(
                'flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-foreground hover:bg-muted',
                !currentCity && 'bg-muted text-primary'
              )}
            >
              <MapPin className="mr-2 size-4" />
              Сеть клиник
            </Link>
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-foreground hover:bg-muted',
                  currentCity?.slug === city.slug && 'bg-muted text-primary'
                )}
              >
                <MapPin className="mr-2 size-4" />
                {city.name}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-2 text-base font-semibold text-foreground"
            >
              <Phone className="size-4" />
              {phone}
            </a>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {address}
            </div>
            <Button
              size="lg"
              className="w-full cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => {
                setMenuOpen(false)
                openBookingModal()
              }}
            >
              Записаться
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
