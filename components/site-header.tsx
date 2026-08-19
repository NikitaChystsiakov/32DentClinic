'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Phone, MapPin, Clock, Send } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Sheet, SheetContent, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { useBookingModal } from '@/components/booking-modal-provider'
import { navLinks, siteConfig } from '@/lib/site-config'

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const pathname = usePathname()
  const { openBookingModal } = useBookingModal()

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-transparent transition-all duration-300',
        scrolled
          ? 'border-border bg-background/90 shadow-sm backdrop-blur-md'
          : 'bg-background/60'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8',
          scrolled ? 'h-16' : 'h-20'
        )}
      >
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
          <span className="flex size-24 items-center justify-center rounded-lg text-primary-foreground">
            <img src="images/logo.png" alt="Логотип 32Dent" />
          </span>
        </Link>

        <div className="hidden flex-col gap-0.5 text-xs text-muted-foreground xl:flex">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {siteConfig.address}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" /> {siteConfig.hoursShort}
          </span>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground',
                  isActive && 'text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={siteConfig.phoneHref}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary"
          >
            <Phone className="size-4" />
            {siteConfig.phoneDisplay}
          </a>
          <a
            href={siteConfig.viberHref}
            aria-label="Viber"
            className="text-muted-foreground hover:text-primary"
          >
            <img src="images/viber.png" alt="viber" className='size-4'/>
          </a>
          <a
            href={siteConfig.telegramHref}
            aria-label="Telegram"
            className="text-muted-foreground hover:text-primary "
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

        <div className="flex items-center gap-1 lg:hidden">
          <a href={siteConfig.phoneHref} aria-label="Позвонить" className="p-2 text-foreground">
            <Phone className="size-5" />
          </a>
          <Button variant="ghost" size="icon" aria-label="Открыть меню" onClick={() => setDrawerOpen(true)}>
            <Menu />
          </Button>
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="flex w-full max-w-none flex-col gap-0 sm:max-w-none">
          <SheetHeader className="border-b border-border">
            <SheetTitle className="font-heading text-lg">Меню</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
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
              href={siteConfig.phoneHref}
              className="flex items-center justify-center gap-2 text-base font-semibold text-foreground"
            >
              <Phone className="size-4" />
              {siteConfig.phoneDisplay}
            </a>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {siteConfig.address}
            </div>
            <Button
              size="lg"
              className="w-full bg-accent text-accent-foreground cursor-pointer hover:bg-accent/90"
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
