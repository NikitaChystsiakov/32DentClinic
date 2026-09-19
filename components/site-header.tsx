'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, MapPin, ChevronDown, Star, Percent, Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { MessengerIcon } from '@/components/icons/messenger-icon'
import { BookingButton } from '@/components/booking-button'
import { getCityChrome } from '@/content/chrome'
import { cities } from '@/config/cities'
import { HEADER_LAYOUT, type HeaderLayout } from '@/config/header'
import { formatAddressWithoutCity } from '@/lib/format-address'
import { useMobileMenu } from '@/components/mobile-menu-provider'
import { getMainRatingForCity } from '@/lib/data/aggregators'
import { getMessengerLinks } from '@/lib/messengers'
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
  const headerRef = React.useRef<HTMLElement>(null)
  const pathname = usePathname()
  const { openMenu } = useMobileMenu()
  const currentCity = useCurrentCity()
  const citySlug = currentCity?.slug
  const prefix = citySlug ? `/${citySlug}` : ''
  const styles = layoutStyles[HEADER_LAYOUT]

  // На страницах сети (/blog, /dokumenty, 404) городских разделов нет:
  // раньше пункты вели на /uslugi/, /ceny/ без города, а .htaccess
  // редиректил их в Рогачёв — человек из Минска попадал в чужую клинику.
  const navLinks = citySlug
    ? [
        // Имплантация — главное направление сети, поэтому первой и отдельно от
        // общего списка услуг: ведёт на хаб раздела с протоколами и ценами.
        { label: 'Имплантация', href: `${prefix}/uslugi/implantaciya/` },
        { label: 'Услуги', href: `${prefix}/uslugi/` },
        { label: 'Врачи', href: `${prefix}/vrachi/` },
        { label: 'Цены', href: `${prefix}/ceny/` },
        { label: 'Примеры работ', href: `${prefix}/primery-rabot/` },
        { label: 'О нас', href: `${prefix}/o-nas/` },
        { label: 'Контакты', href: `${prefix}/kontakty/` },
        // Блог общий для сети — без префикса города.
        { label: 'Блог', href: '/blog/' },
      ]
    : [
        { label: 'Города и клиники', href: '/#city-cards' },
        { label: 'Блог', href: '/blog/' },
      ]

  // Активен самый длинный подходящий адрес: на /minsk/uslugi/implantaciya/
  // подсвечивается «Имплантация», а не «Услуги» вместе с ней.
  const activeHref = navLinks
    .map((link) => link.href)
    .filter((href) => pathname === href || pathname?.startsWith(href))
    .sort((a, b) => b.length - a.length)[0]

  // Контакты в шапке — только у страниц города. Раньше на страницах сети
  // (/blog, /dokumenty, 404) сюда подставлялись рогачёвские телефон и адрес
  // из siteConfig, как будто сеть — это Рогачёв.
  const shortAddress = currentCity ? formatAddressWithoutCity(currentCity.address) : null
  const phone = currentCity?.phone
  const phoneHref = currentCity?.phoneHref
  // Мессенджеры города (без Instagram — это не «написать»); на страницах
  // сети — Telegram сети.
  const messengers = getMessengerLinks(currentCity).filter((m) => m.id !== 'instagram')
  // Рейтинг — площадки своего города; у города без профилей метки нет.
  const rating = citySlug ? getMainRatingForCity(citySlug) : undefined
  // Шапка живёт вне CityProvider (в корневом layout), поэтому акцию берём
  // по слагу города из URL, а на общих страницах сети не показываем. Из
  // content/chrome.ts, а не getCityContent: тот тянул бы в клиентский JS
  // контент всех городов целиком.
  const promo = citySlug ? getCityChrome(citySlug)?.promo : undefined

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /*
   * Реальная высота шапки уезжает в --header-h: от неё считается высота
   * первого экрана (см. hero-split.tsx и hero-section.tsx). Меряем, а не
   * берём из констант: полосы шапки разной высоты в разных HEADER_LAYOUT, а
   * нижняя на телефоне ещё и растёт на вторую строку, когда в ней длинный
   * анонс акции — из-за этого hero не дотягивал ровно до края экрана.
   * Пока страница прокручена, шапка сжата (и на телефоне нижняя полоса
   * спрятана) — в этом состоянии значение не трогаем, иначе hero менял бы
   * высоту вместе с шапкой прямо во время прокрутки.
   */
  React.useEffect(() => {
    const el = headerRef.current
    if (!el || scrolled) return
    const write = () => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    }
    write()
    const observer = new ResizeObserver(write)
    observer.observe(el)
    return () => observer.disconnect()
  }, [scrolled])

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
      ref={headerRef}
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
              src="/images/logo.webp"
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
            {shortAddress && (
              <span className="hidden items-center gap-2 text-base text-muted-foreground lg:flex">
                <MapPin className="size-5 shrink-0 text-primary" />
                <span className="whitespace-nowrap">{shortAddress}</span>
              </span>
            )}
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
              {/* Телефон чуть плотнее окружения (medium против normal у адреса
                  и рейтинга), но не полужирный: раньше text-lg/semibold делал
                  его самым тяжёлым элементом строки и перебивал кнопку «Записаться». */}
              {phoneHref && (
                <a
                  href={phoneHref}
                  aria-label={phone}
                  className="flex items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-primary"
                >
                  <Phone className="size-5 shrink-0" />
                  <span className="hidden whitespace-nowrap xl:inline">{phone}</span>
                </a>
              )}
              {/* Viber, Telegram и тема — своя группа с почти нулевым зазором:
                  у .icon-action бокс 40px при иконке 20px, и на общем gap-3
                  между самими знаками получалось больше 30px — они читались
                  как три отдельных элемента, а не как один блок. Класс на всех
                  трёх один, поэтому и наведение у них одинаковое. */}
              <div className="flex items-center gap-0.5">
                {messengers.map((m) => (
                  <a
                    key={m.id}
                    href={m.href}
                    {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={`Написать в ${m.label}`}
                    title={`Написать в ${m.label}`}
                    className="icon-action"
                  >
                    <MessengerIcon id={m.id} className="size-5" />
                  </a>
                ))}
                <ThemeToggle />
              </div>
              <BookingButton size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Записаться
              </BookingButton>
            </div>

            {/* Мобильные действия: звонок и бургер. Меню общее с нижней
                панелью (MobileMenuProvider) — в шапке его ищут по привычке,
                нижняя панель остаётся быстрым доступом к частым действиям. */}
            <div className="flex items-center gap-1 lg:hidden">
              {/* Тот же размер и форма, что у соседних кнопок ряда: базовые
                  40px .icon-action для тач-цели в шапке маловато. */}
              <ThemeToggle className="size-11 rounded-full" />
              {phoneHref && (
                <a
                  href={phoneHref}
                  aria-label="Позвонить"
                  className="flex size-11 items-center justify-center rounded-full text-foreground active:bg-muted"
                >
                  <Phone className="size-5" />
                </a>
              )}
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
          экрана, постоянно. На lg+ полоса содержит навигацию и остаётся всегда.
          Если у города нет анонса (Жлобин), на телефоне полоса не нужна вовсе —
          иначе под шапкой оставалась пустая рамка. */}
      <div
        className={cn(
          'border-b border-border bg-card lg:block',
          (scrolled || !promo) && 'hidden'
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
              const isActive = link.href === activeHref
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
