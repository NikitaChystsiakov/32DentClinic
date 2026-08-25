'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Send, MapPin } from 'lucide-react'

import { siteConfig } from '@/lib/site-config'
import { getServicesForCity } from '@/config/services'
import { cities, getCityBySlug } from '@/config/cities'
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
  const isHub = !citySlug

  const navLinks = isHub
    ? cities.map((c) => ({ label: c.name, href: `/${c.slug}` }))
    : [
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
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href={prefix || '/'} className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <Image src="/images/logo.png" alt="Логотип 32Дент" width={168} height={111} loading="eager" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isHub
                ? 'Сеть стоматологий 32Дент. Гарантия 2 года на все виды работ.'
                : `Стоматология в ${city!.name}. Гарантия 2 года на все виды работ.`}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-semibold text-foreground">
              {isHub ? 'Наши клиники' : 'Навигация'}
            </h3>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Services (city only) or all cities contacts (hub) */}
          {isHub ? (
            <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-2">
              <h3 className="font-heading text-sm font-semibold text-foreground">Контакты клиник</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cities.map((c) => (
                  <div key={c.slug} className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                    <span className="text-xs text-muted-foreground">
                      <MapPin className="mr-1 inline size-3" />
                      {c.address}
                    </span>
                    <a href={c.phoneHref} className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary">
                      <Phone className="size-3" /> {c.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
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
                <p className="text-sm text-muted-foreground">{city!.address}</p>
                <a href={city!.phoneHref} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                  <Phone className="size-4" /> {city!.phone}
                </a>
                <p className="text-sm text-muted-foreground">
                  Пн–Сб: 8:00–19:00 · Вс: выходной
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://viber.com/${city!.phone.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Send className="size-4" /> Viber
                  </a>
                  <a
                    href={siteConfig.telegramHref}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Send className="size-4" /> Telegram
                  </a>
                </div>
              </div>
            </>
          )}
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
