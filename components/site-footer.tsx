'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Send } from 'lucide-react'

import { siteConfig } from '@/lib/site-config'
import { getServicesForCity } from '@/config/services'
import { getCityBySlug } from '@/config/cities'
import { usePathname } from 'next/navigation'

function useCurrentCitySlug(): string | null {
  const pathname = usePathname()
  const match = pathname?.match(/^\/([a-z-]+)(\/|$)/)
  if (match) {
    const city = getCityBySlug(match[1])
    if (city) return city.slug
  }
  return null
}

export function SiteFooter() {
  const citySlug = useCurrentCitySlug()
  const prefix = citySlug ? `/${citySlug}` : ''
  const city = citySlug ? getCityBySlug(citySlug) : null
  const services = citySlug ? getServicesForCity(citySlug) : []

  const address = city?.address ?? siteConfig.address
  const phone = city?.phone ?? siteConfig.phoneDisplay
  const phoneHref = city?.phoneHref ?? siteConfig.phoneHref
  const viberHref = city ? `https://viber.com/${city.phone.replace(/[^0-9]/g, '')}` : siteConfig.viberHref
  const telegramHref = siteConfig.telegramHref

  const navLinks = [
    { label: 'Услуги', href: `${prefix}/uslugi/` },
    { label: 'Врачи', href: `${prefix}/vrachi/` },
    { label: 'Цены', href: `${prefix}/ceny/` },
    { label: 'Примеры работ', href: `${prefix}/primery-rabot/` },
    { label: 'О нас', href: `${prefix}/o-nas/` },
    { label: 'Контакты', href: `${prefix}/kontakty/` },
  ]

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href={prefix || '/'} className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <Image src="/images/logo.png" alt="Логотип 32Дент" width={168} height={111} loading="eager" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Стоматология {city?.name ? `в ${city.name}` : ''}. Гарантия 2 года на все виды работ.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-semibold text-foreground">Навигация</h3>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-semibold text-foreground">Услуги</h3>
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`${prefix}/uslugi/${s.slug}/`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {s.shortName}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-semibold text-foreground">Контакты</h3>
            <p className="text-sm text-muted-foreground">{address}</p>
            <a href={phoneHref} className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Phone className="size-4" /> {phone}
            </a>
            <p className="text-sm text-muted-foreground">
              Пн–Сб: 8:00–19:00 · Вс: выходной
            </p>
            <div className="flex items-center gap-3">
              <a
                href={viberHref}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
              >
                <Send className="size-4" /> Viber
              </a>
              <a
                href={telegramHref}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
              >
                <Send className="size-4" /> Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            УНП {siteConfig.unp} · Лицензия № {siteConfig.license}
          </p>
          <p>{siteConfig.disclaimer}</p>
          <p>© 32Дент, 2026. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
