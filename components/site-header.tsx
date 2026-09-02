'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, Phone, MapPin, Send, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { ViberIcon } from '@/components/icons/viber-icon'
import { Sheet, SheetContent, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { useBookingModal } from '@/components/booking-modal-provider'
import { cities, getCityBySlug, type City } from '@/config/cities'
import { siteConfig } from '@/lib/site-config'

function useCurrentCity(): City | null {
  const pathname = usePathname()
  const match = pathname?.match(/^\/([a-z-]+)(\/|$)/)
  if (match) {
    const city = getCityBySlug(match[1])
    if (city) return city
  }
  return null
}

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [cityOpen, setCityOpen] = React.useState(false)
  const cityDropdownRef = React.useRef<HTMLDivElement>(null)
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
  const viberHref = currentCity
    ? `https://viber.com/${currentCity.phone.replace(/[^0-9]/g, '')}`
    : siteConfig.viberHref
  const telegramHref = siteConfig.telegramHref

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setCityOpen(false)
      }
    }
    if (cityOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [cityOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-all duration-300',
        scrolled
          ? 'border-border bg-background/95 shadow-sm backdrop-blur-md'
          : 'border-border/50 bg-background/80 backdrop-blur-sm'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8',
          scrolled ? 'h-16' : 'h-20'
        )}
      >
        {/* Logo */}
        <Link
          href={prefix || '/'}
          className="flex shrink-0 items-center gap-2 font-heading text-xl font-bold text-foreground"
        >
          <span className="flex size-24 items-center justify-center rounded-lg text-primary-foreground">
            <Image src="/images/logo.png" alt="Логотип 32Дент" width={168} height={111} loading="eager" />
          </span>
        </Link>

        {/* City dropdown — lg+ */}
        <div ref={cityDropdownRef} className="relative hidden shrink-0 lg:block">
          <button
            type="button"
            onClick={() => setCityOpen((o) => !o)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted',
              cityOpen && 'bg-muted'
            )}
          >
            <MapPin className="size-3.5 text-primary" />
            {currentCity?.name ?? 'Сеть клиник'}
            <ChevronDown className={cn('size-3.5 transition-transform', cityOpen && 'rotate-180')} />
          </button>
          {cityOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
              <div className="p-1">
                <Link
                  href="/"
                  onClick={() => setCityOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted',
                    !currentCity && 'bg-muted font-medium text-primary'
                  )}
                >
                  <MapPin className="size-3.5" />
                  Сеть клиник (все города)
                </Link>
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    onClick={() => setCityOpen(false)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted',
                      currentCity?.slug === city.slug && 'bg-muted font-medium text-primary'
                    )}
                  >
                    <MapPin className="size-3.5" />
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation — lg+ */}
        <nav className="hidden shrink-0 items-center gap-5 lg:flex xl:gap-6">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative whitespace-nowrap py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isActive &&
                    'text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right actions — lg+ */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {/* Phone: icon-only on lg, full text on xl */}
          <a
            href={phoneHref}
            aria-label={phone}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            <Phone className="size-4 shrink-0" />
            <span className="hidden whitespace-nowrap xl:inline">{phone}</span>
          </a>

          <a
            href={viberHref}
            aria-label="Viber"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ViberIcon className="size-4" />
          </a>
          <a
            href={telegramHref}
            aria-label="Telegram"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Send className="size-4" />
          </a>

          <ThemeToggle />

          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => openBookingModal()}
          >
            Записаться
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <a href={phoneHref} aria-label="Позвонить" className="p-2 text-foreground">
            <Phone className="size-5" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Открыть меню"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="flex w-full max-w-none flex-col gap-0 sm:max-w-none">
          <SheetHeader className="border-b border-border">
            <SheetTitle className="font-heading text-lg">Меню</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
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
                onClick={() => setDrawerOpen(false)}
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
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 border-t border-border p-4">
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
                setDrawerOpen(false)
                openBookingModal()
              }}
            >
              Записаться
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
