'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, MapPin, Send, ChevronDown, Star, Percent, Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { ViberIcon } from '@/components/icons/viber-icon'
import { useBookingModal } from '@/components/booking-modal-provider'
import { getCityContent } from '@/content'
import { cities } from '@/config/cities'
import { HEADER_LAYOUT, type HeaderLayout } from '@/config/header'
import { formatAddressWithoutCity } from '@/lib/format-address'
import { useMobileMenu } from '@/components/mobile-menu-provider'
import { siteConfig } from '@/lib/site-config'
import { aggregatorRatings } from '@/lib/data/aggregators'
import { useCurrentCity } from '@/lib/hooks/use-current-city'

// Логотип 258×171 — ширина каждого варианта посчитана от высоты по этим пропорциям,
// чтобы не менять размер картинки через CSS.
const LOGO_RATIO = 258 / 171

const layoutStyles: Record<
  HeaderLayout,
  {
    topBar: string
    topBarScrolled: string
    bottomBar: string
    logoHeight: number
    logoClass: string
    navOffset: string
  }
> = {
  compact: {
    topBar: 'h-16',
    topBarScrolled: 'h-14',
    bottomBar: 'lg:h-12',
    logoHeight: 40,
    logoClass: '',
    navOffset: '',
  },
  balanced: {
    topBar: 'h-20',
    topBarScrolled: 'h-16',
    bottomBar: 'lg:h-13',
    logoHeight: 56,
    logoClass: '',
    navOffset: '',
  },
  anchored: {
    topBar: 'h-17',
    topBarScrolled: 'h-17',
    bottomBar: 'lg:h-13',
    logoHeight: 88,
    logoClass: 'translate-y-4',
    navOffset: 'lg:pl-34',
  },
}

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false)
  const [cityOpen, setCityOpen] = React.useState(false)
  const cityDropdownRef = React.useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { openBookingModal } = useBookingModal()
  const { openMenu } = useMobileMenu()
  const currentCity = useCurrentCity()
  const citySlug = currentCity?.slug
  const prefix = citySlug ? `/${citySlug}` : ''
  const styles = layoutStyles[HEADER_LAYOUT]

  const navLinks = [
    { label: 'Услуги', href: `${prefix}/uslugi/` },
    { label: 'Врачи', href: `${prefix}/vrachi/` },
    { label: 'Цены', href: `${prefix}/ceny/` },
    { label: 'Примеры работ', href: `${prefix}/primery-rabot/` },
    { label: 'О нас', href: `${prefix}/o-nas/` },
    { label: 'Контакты', href: `${prefix}/kontakty/` },
    // Блог общий для сети — без префикса города.
    { label: 'Блог', href: '/blog/' },
  ]

  const address = currentCity?.address ?? siteConfig.address
  const shortAddress = formatAddressWithoutCity(address)
  const phone = currentCity?.phone ?? siteConfig.phoneDisplay
  const phoneHref = currentCity?.phoneHref ?? siteConfig.phoneHref
  const viberHref = currentCity
    ? `https://viber.com/${currentCity.phone.replace(/[^0-9]/g, '')}`
    : siteConfig.viberHref
  const telegramHref = siteConfig.telegramHref
  const rating = aggregatorRatings.find((a) => a.id === '103by')
  // Шапка живёт вне CityProvider (в корневом layout), поэтому акцию берём
  // по слагу города из URL, а на общих страницах сети не показываем.
  const promo = citySlug ? getCityContent(citySlug)?.promo : undefined

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
        'sticky top-0 z-40 w-full transition-shadow duration-300',
        scrolled ? 'bg-background/95 shadow-sm backdrop-blur-md' : 'bg-background/90 backdrop-blur-sm'
      )}
    >
      {/* Верхняя полоса: логотип, доверительные метки, контакты, CTA */}
      <div className="border-b border-border/60">
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8',
            scrolled ? styles.topBarScrolled : styles.topBar
          )}
        >
          <Link href={prefix || '/'} className="relative z-10 flex shrink-0 items-center">
            <Image
              src="/images/logo.png"
              alt="Логотип 32Дент"
              width={Math.round(styles.logoHeight * LOGO_RATIO)}
              height={styles.logoHeight}
              preload
              className={styles.logoClass}
            />
          </Link>

          {/* Доверительные метки — от md */}
          <div className="hidden items-center gap-4 md:flex">
            {rating?.rating && (
              <a
                href={rating.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
              >
                <Star className="size-5 shrink-0 fill-rating text-rating" />
                <span className="font-semibold text-foreground">{rating.rating}</span>
                <span className="hidden whitespace-nowrap xl:inline">
                  · {rating.reviewsCount} отзывов на {rating.name}
                </span>
              </a>
            )}
            {/* Адрес без города: город показывает переключатель справа, а
                дублирующее «г. Минск, » раньше не влезало в строку и адрес
                обрезался многоточием. Без max-w и truncate — улица с домом
                короче прежнего лимита, поэтому помещается целиком. */}
            <span className="hidden items-center gap-2 text-base text-muted-foreground lg:flex">
              <MapPin className="size-5 shrink-0 text-primary" />
              <span className="whitespace-nowrap">{shortAddress}</span>
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Выбор города — lg+ */}
            <div ref={cityDropdownRef} className="relative hidden shrink-0 lg:block">
              <button
                type="button"
                onClick={() => setCityOpen((o) => !o)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-muted',
                  cityOpen && 'bg-muted'
                )}
              >
                {currentCity?.name ?? 'Сеть клиник'}
                <ChevronDown className={cn('size-3.5 transition-transform', cityOpen && 'rotate-180')} />
              </button>
              {cityOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
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

            {/* Контакты и CTA — lg+ */}
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <a
                href={phoneHref}
                aria-label={phone}
                className="flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-primary"
              >
                <Phone className="size-5 shrink-0" />
                <span className="hidden whitespace-nowrap xl:inline">{phone}</span>
              </a>
              <a
                href={viberHref}
                aria-label="Viber"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <ViberIcon className="size-5" />
              </a>
              <a
                href={telegramHref}
                aria-label="Telegram"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Send className="size-5" />
              </a>
              <ThemeToggle />
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => openBookingModal()}
              >
                Записаться
              </Button>
            </div>

            {/* Мобильные действия: звонок и бургер. Меню общее с нижней
                панелью (MobileMenuProvider) — в шапке его ищут по привычке,
                нижняя панель остаётся быстрым доступом к частым действиям. */}
            <div className="flex items-center gap-1 lg:hidden">
              {/* Тот же размер и форма, что у соседних кнопок ряда: у самого
                  ThemeToggle размер icon (36px), для тач-цели в шапке мало. */}
              <ThemeToggle className="size-11 rounded-full active:bg-muted" />
              <a
                href={phoneHref}
                aria-label="Позвонить"
                className="flex size-11 items-center justify-center rounded-full text-foreground active:bg-muted"
              >
                <Phone className="size-5" />
              </a>
              <button
                type="button"
                aria-label="Открыть меню"
                onClick={openMenu}
                className="flex size-11 items-center justify-center rounded-full text-foreground active:bg-muted"
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя полоса: навигация и анонс акции.
          На телефоне после прокрутки полоса скрывается: там в ней только анонс
          акции, а вместе с верхней полосой шапка занимала ~240px — почти треть
          экрана, постоянно. На lg+ полоса содержит навигацию и остаётся всегда. */}
      <div
        className={cn(
          'border-b border-border bg-card lg:block',
          scrolled && 'hidden'
        )}
      >
        {/* Высота полосы фиксирована только с lg: на телефоне здесь остаётся
            один анонс акции, и в одну строку он обрывался посреди слова
            («…и КТ бесплатн…»). Теперь строка переносится на две, а высоту
            задаёт содержимое. */}
        <div
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6 lg:px-8 lg:py-0',
            styles.bottomBar
          )}
        >
          <nav className={cn('hidden shrink-0 items-center gap-6 lg:flex xl:gap-7', styles.navOffset)}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative whitespace-nowrap text-base font-medium text-muted-foreground transition-colors hover:text-foreground',
                    isActive && 'text-primary'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {promo && (
            <Link
              href={promo.href}
              className="group flex min-w-0 items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:ml-auto lg:items-center"
            >
              <Percent className="mt-0.5 size-4 shrink-0 text-accent lg:mt-0" />
              <span className="line-clamp-2 lg:truncate">{promo.text}</span>
              <span className="hidden shrink-0 font-medium text-primary underline-offset-4 group-hover:underline sm:inline">
                Подробнее
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
