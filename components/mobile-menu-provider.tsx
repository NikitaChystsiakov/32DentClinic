'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarCheck,
  ChevronRight,
  Images,
  MapPin,
  Phone,
  Send,
  Stethoscope,
  Tag,
  Users,
  Building2,
  Info,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ViberIcon } from '@/components/icons/viber-icon'
import { useBookingModal } from '@/components/booking-modal-provider'
import { useCurrentCity } from '@/lib/hooks/use-current-city'
import { cities } from '@/config/cities'
import { siteConfig } from '@/lib/site-config'

interface MobileMenuContextValue {
  openMenu: () => void
  closeMenu: () => void
  isOpen: boolean
}

const MobileMenuContext = React.createContext<MobileMenuContextValue | null>(null)

/**
 * Мобильное меню одно на весь сайт, но открывают его из двух мест: бургер в
 * шапке (там его ищут по привычке) и кнопка в нижней панели. Поэтому состояние
 * живёт в провайдере, а сам Sheet рендерится один раз в layout — иначе на
 * странице оказалось бы два разных меню со своим состоянием.
 */
export function useMobileMenu() {
  const ctx = React.useContext(MobileMenuContext)
  if (!ctx) throw new Error('useMobileMenu должен вызываться внутри MobileMenuProvider')
  return ctx
}

const NAV_ICONS = {
  uslugi: Stethoscope,
  vrachi: Users,
  ceny: Tag,
  'primery-rabot': Images,
  'o-nas': Info,
  kontakty: MapPin,
} as const

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const { openBookingModal } = useBookingModal()
  const currentCity = useCurrentCity()
  const citySlug = currentCity?.slug
  const prefix = citySlug ? `/${citySlug}` : ''

  const openMenu = React.useCallback(() => setIsOpen(true), [])
  const closeMenu = React.useCallback(() => setIsOpen(false), [])
  const value = React.useMemo(() => ({ openMenu, closeMenu, isOpen }), [openMenu, closeMenu, isOpen])

  // Меню закрывается само при переходе: без этого после клика по ссылке
  // страница менялась, а шторка оставалась открытой поверх неё.
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navLinks = [
    { key: 'uslugi', label: 'Услуги', href: `${prefix}/uslugi/` },
    { key: 'vrachi', label: 'Врачи', href: `${prefix}/vrachi/` },
    { key: 'ceny', label: 'Цены', href: `${prefix}/ceny/` },
    { key: 'primery-rabot', label: 'Примеры работ', href: `${prefix}/primery-rabot/` },
    { key: 'o-nas', label: 'О нас', href: `${prefix}/o-nas/` },
    { key: 'kontakty', label: 'Контакты', href: `${prefix}/kontakty/` },
  ] as const

  const phone = currentCity?.phone ?? siteConfig.phoneDisplay
  const phoneHref = currentCity?.phoneHref ?? siteConfig.phoneHref
  const address = currentCity?.address ?? siteConfig.address
  const viberHref = currentCity
    ? `https://viber.com/${currentCity.phone.replace(/[^0-9]/g, '')}`
    : siteConfig.viberHref

  return (
    <MobileMenuContext.Provider value={value}>
      {children}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="flex w-full max-w-none flex-col gap-0 p-0 sm:max-w-none">
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle className="font-heading text-lg">Меню</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Город наверху: на сети три клиники с разными ценами и врачами,
                поэтому первый вопрос на телефоне — «а это какой город». */}
            <div className="px-4 pt-4">
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Город
              </p>
              <div className="grid grid-cols-3 gap-2">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className={cn(
                      'flex min-h-11 items-center justify-center rounded-xl px-2 text-sm font-medium ring-1 transition-colors',
                      currentCity?.slug === city.slug
                        ? 'bg-accent text-accent-foreground ring-accent'
                        : 'bg-card text-foreground ring-silver/30 active:bg-muted'
                    )}
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/"
                className="mt-2 flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-muted-foreground ring-1 ring-silver/25 active:bg-muted"
              >
                <Building2 className="size-4" />
                Все клиники сети
              </Link>
            </div>

            <div className="mt-5 px-4">
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Разделы
              </p>
              <nav className="flex flex-col overflow-hidden rounded-2xl ring-1 ring-silver/25">
                {navLinks.map((link, i) => {
                  const Icon = NAV_ICONS[link.key]
                  const active = pathname === link.href || pathname?.startsWith(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex min-h-13 items-center gap-3 bg-card px-4 text-base font-medium transition-colors active:bg-muted',
                        i > 0 && 'border-t border-silver/20',
                        active ? 'text-accent' : 'text-foreground'
                      )}
                    >
                      <Icon className={cn('size-5 shrink-0', active ? 'text-accent' : 'text-primary')} />
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Мессенджеры переехали сюда с плавающих кнопок: на телефоне они
                висели поверх контента рядом с нижней панелью и загромождали угол. */}
            <div className="mt-5 px-4 pb-4">
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Связаться
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={phoneHref}
                  className="flex min-h-13 items-center gap-3 rounded-2xl bg-card px-4 ring-1 ring-silver/25 active:bg-muted"
                >
                  <Phone className="size-5 shrink-0 text-primary" />
                  {/* whitespace-nowrap: длинный номер переносился на две строки
                      и «+375 (29) 323-33-» / «88» читалось как ошибка вёрстки. */}
                  <span className="font-heading text-base font-bold whitespace-nowrap text-foreground">
                    {phone}
                  </span>
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={viberHref}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-card text-sm font-medium text-foreground ring-1 ring-silver/25 active:bg-muted"
                  >
                    <ViberIcon className="size-4 text-primary" />
                    Viber
                  </a>
                  <a
                    href={siteConfig.telegramHref}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-card text-sm font-medium text-foreground ring-1 ring-silver/25 active:bg-muted"
                  >
                    <Send className="size-4 text-primary" />
                    Telegram
                  </a>
                </div>
                <p className="flex items-start gap-2 px-1 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  {address}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Button
              size="lg"
              className="w-full cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => {
                closeMenu()
                openBookingModal()
              }}
            >
              <CalendarCheck data-icon="inline-start" />
              Записаться на приём
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </MobileMenuContext.Provider>
  )
}
