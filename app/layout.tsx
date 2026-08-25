import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'

import { ThemeProvider } from '@/components/theme-provider'
import { BookingModalProvider } from '@/components/booking-modal-provider'
import { BookingModalLoader } from '@/components/booking-modal-loader'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FloatingMessengers } from '@/components/floating-messengers'
import { GeoBanner } from '@/components/geo-banner'
import { siteConfig } from '@/lib/site-config'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope' })

export const metadata: Metadata = {
  title: {
    default: `Сеть стоматологий 32Дент — Минск, Рогачёв, Жлобин`,
    template: `%s | 32Дент`,
  },
  description:
    '32Дент — сеть стоматологий в Беларуси. Лечение, имплантация, протезирование в Минске, Рогачёве и Жлобине. Современное оборудование, гарантия 2 года.',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const hdrs = await headers()
  const suggestedCitySlug = hdrs.get('x-suggested-city')
  const suggestedCityName = hdrs.get('x-suggested-city-name')
  const suggestedCity = suggestedCitySlug && suggestedCityName
    ? { slug: suggestedCitySlug, name: suggestedCityName }
    : null

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
              <GeoBanner suggestedCity={suggestedCity} />
              <main className="flex-1">{children}</main>
              <FloatingMessengers />
              <SiteFooter />
            </div>
            <BookingModalLoader />
          </BookingModalProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
