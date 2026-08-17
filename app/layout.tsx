import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'

import { ThemeProvider } from '@/components/theme-provider'
import { BookingModalProvider } from '@/components/booking-modal-provider'
import { BookingModal } from '@/components/booking-modal'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FloatingMessengers } from '@/components/floating-messengers'
import { siteConfig } from '@/lib/site-config'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope' })

export const metadata: Metadata = {
  title: {
    default: `Стоматология Dent32 в Рогачёве — лечение, имплантация, протезирование`,
    template: `%s | Dent32, Рогачёв`,
  },
  description:
    'Dent32 — стоматология в Рогачёве. Терапия, хирургия, ортодонтия, протезирование и имплантация в одном месте. Гарантия 2 года на все виды работ.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  name: siteConfig.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.address,
    addressLocality: siteConfig.city,
    addressCountry: 'BY',
  },
  telephone: siteConfig.phoneDisplay,
  openingHours: 'Mo-Sa 08:00-19:00',
  priceRange: '$$',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="bg-background" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        <ThemeProvider>
          <BookingModalProvider>
            <div className="flex min-h-dvh flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <FloatingMessengers />
              <SiteFooter />
            </div>
            <BookingModal />
          </BookingModalProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
