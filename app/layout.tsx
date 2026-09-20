import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

import { ThemeProvider } from '@/components/theme-provider'
import { BookingModalProvider } from '@/components/booking-modal-provider'
import { BookingModalLoader } from '@/components/booking-modal-loader'
import { HeaderSwitcher } from '@/components/header-switcher'
import { SiteFooter } from '@/components/site-footer'
import { FloatingMessengers } from '@/components/floating-messengers'
import { PriceNoticeBanner } from '@/components/price-notice-banner'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { MobileMenuProvider } from '@/components/mobile-menu-provider'
import { siteConfig } from '@/lib/site-config'

// Golos Text — основной текст, UI, кнопки, навигация. Unbounded — заголовки
// и крупные цифры. Оба — вариативные, но не из next/font/google, а свои
// урезанные копии (app/fonts, собираются scripts/subset-fonts.sh):
//
// - Google-версия шла четырьмя файлами (latin + cyrillic на каждый шрифт) на
//   полном диапазоне весов, 142 КБ, и все четыре preload'ились с высоким
//   приоритетом — на мобильном они шли впереди CSS и учитывались в LCP.
// - Здесь один файл на шрифт: кириллица + базовая латиница + типографика
//   («», —, №, ×), ось wght обрезана до реально используемых весов
//   (Golos 400–700, Unbounded 500–700) — вместе 75 КБ.
//
// Вес по-прежнему не фиксируем: конкретные font-weight задаются в
// компонентах через Tailwind. Если появится вес вне диапазона (например,
// font-black), файл нужно пересобрать, иначе браузер тихо возьмёт крайний.
const golosText = localFont({
  src: './fonts/golos-text-400-700.woff2',
  weight: '400 700',
  variable: '--font-golos-text',
})
const unbounded = localFont({
  src: './fonts/unbounded-500-700.woff2',
  weight: '500 700',
  variable: '--font-unbounded',
})

export const metadata: Metadata = {
  // Базовый адрес для og:image и прочих URL-полей. canonical здесь намеренно
  // нет: он наследуется всеми страницами без своего, и они стали бы
  // «копиями» главной — каждая страница задаёт его сама через
  // buildMetadata() из lib/seo.ts.
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `Сеть стоматологий 32Дент — Минск, Рогачёв, Жлобин`,
    template: `%s | 32Дент`,
  },
  description:
    '32Дент — сеть стоматологий в Беларуси. Лечение, имплантация, протезирование в Минске, Рогачёве и Жлобине. Современное оборудование, гарантия 2 года.',
  // Превью при отправке ссылки в Viber/Telegram/соцсети. Картинка —
  // app/opengraph-image.png (Next подхватывает файл по имени), заголовок и
  // описание каждая страница задаёт сама (они не наследуются из title).
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'ru_BY',
    url: siteConfig.siteUrl,
    title: 'Сеть стоматологий 32Дент — Минск, Рогачёв, Жлобин',
    description:
      '32Дент — сеть стоматологий в Беларуси. Лечение, имплантация, протезирование в Минске, Рогачёве и Жлобине.',
  },
  twitter: { card: 'summary_large_image' },
  // Знак «32» на фирменном индиго, файлы генерирует scripts/make-favicon.mjs.
  icons: {
    icon: [
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
}

/*
 * Сторонней аналитики (Vercel Analytics, Метрика, GA) здесь намеренно нет:
 * любой такой скрипт — это передача данных посетителя третьему лицу, а для
 * сервисов за пределами РБ/ЕАЭС ещё и трансграничная передача (ст. 9 Закона
 * «О защите персональных данных»). Подключать только вместе с баннером
 * согласия на cookie, см. docs/ГДЕ-ЧТО-МЕНЯТЬ.md.
 *
 * Никаких headers()/cookies() в корневом layout: любое чтение запроса здесь
 * отключает статическую генерацию сразу для всего сайта — раньше из 98
 * страниц статикой оставалась одна, остальные рендерились на сервере при
 * каждом запросе.
 *
 * Подсказки «Вы из Минска?» (GeoBanner) больше нет: она определяла город
 * запросом к ipwho.is с каждой страницы — IP посетителя уходил иностранному
 * сервису без согласия, что противоречит и Закону «О защите персональных
 * данных», и абзацу выше. Город человек выбирает сам: карточки на хабе и
 * переключатель в шапке.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Схемы schema.org здесь нет намеренно: раньше тут лежал Dentist с
  // рогачёвским адресом и телефоном, и он попадал на страницы Минска и
  // Жлобина рядом с их собственной схемой — два противоречащих адреса одной
  // организации. Сеть описана на хабе (app/page.tsx), клиника города — в
  // app/[city]/layout.tsx.
  return (
    <html lang="ru" className="bg-(--page-surface)" suppressHydrationWarning>
      <body className={`${golosText.variable} ${unbounded.variable} font-sans antialiased`}>
        <ThemeProvider>
          <BookingModalProvider>
            <MobileMenuProvider>
            <div className="flex min-h-dvh flex-col">
              <HeaderSwitcher />
              <main className="flex-1">{children}</main>
              <FloatingMessengers />
              <PriceNoticeBanner />
              <SiteFooter />
              <MobileBottomNav />
            </div>
            </MobileMenuProvider>
            <BookingModalLoader />
          </BookingModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
