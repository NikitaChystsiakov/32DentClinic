'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'

import { MessengerIcon } from '@/components/icons/messenger-icon'
import { siteConfig } from '@/lib/site-config'
import { getMessengerLinks } from '@/lib/messengers'
import { getServicesForCity } from '@/config/services'
import { cities, getCityBySlug, type City } from '@/config/cities'
import { getNearbyTownsForCity, nearbyTowns } from '@/config/nearby-towns'
import { legalDocuments, legalDocHref } from '@/config/legal'
import { getCityChrome } from '@/content/chrome'
import { formatCityHours } from '@/lib/format-hours'
import { useCurrentCity } from '@/lib/hooks/use-current-city'

/*
 * Реквизиты юрлица клиники: наименование, УНП, юридический адрес, лицензия.
 * Закон «О защите прав потребителей» (ст. 8) и ст. 10 Закона «О рекламе»
 * требуют показывать их на сайте; номер лицензии, кем и когда выдана —
 * для лицензируемой медицинской деятельности. Данные — в config/cities.ts.
 */
function LegalRequisites({ city, className }: { city: City; className?: string }) {
  const { legal } = city
  const licenseTerm = legal.license.validUntil ? `, действует до ${legal.license.validUntil}` : ''
  return (
    <div className={className}>
      <p>
        {legal.entityName} · УНП {legal.unp} · {legal.legalAddress}
      </p>
      <p>
        Лицензия № {legal.license.number} от {legal.license.issuedAt}, выдана {legal.license.issuedBy}
        {licenseTerm}
      </p>
    </div>
  )
}

export function SiteFooter() {
  const citySlug = useCurrentCity()?.slug ?? null
  const prefix = citySlug ? `/${citySlug}` : ''
  const city = citySlug ? getCityBySlug(citySlug) : null
  // Часы и тег гарантии — из content/chrome.ts, а не getCityContent: футер
  // клиентский, и полный контент всех городов ушёл бы в JS каждой страницы.
  const chrome = citySlug ? getCityChrome(citySlug) : null
  const services = citySlug ? getServicesForCity(citySlug) : []
  const isHub = !citySlug
  // Соседние города без клиники (config/nearby-towns.ts): ссылки на их
  // посадочные страницы — единственный способ передать им вес с остальных
  // страниц сайта, без внутренних ссылок поисковик их почти не увидит.
  const towns = isHub ? nearbyTowns : getNearbyTownsForCity(citySlug!)

  const navLinks = isHub
    ? [
        ...cities.map((c) => ({ label: c.name, href: `/${c.slug}` })),
        ...towns.map((t) => ({ label: `Для жителей ${t.nameFrom}`, href: `/${t.slug}` })),
      ]
    : [
        { label: 'Услуги', href: `${prefix}/uslugi/` },
        { label: 'Врачи', href: `${prefix}/vrachi/` },
        { label: 'Цены', href: `${prefix}/ceny/` },
        { label: 'Примеры работ', href: `${prefix}/primery-rabot/` },
        { label: 'О нас', href: `${prefix}/o-nas/` },
        { label: 'Контакты', href: `${prefix}/kontakty/` },
        // Блог общий для сети — без префикса города (см. app/blog).
        { label: 'Блог', href: '/blog/' },
      ]

  return (
    // Футер собран той же панелью, что и секции страницы, чтобы низ сайта
    // не выпадал из общей сетки скруглённых контейнеров. Поля, максимальная
    // ширина и внутренние отступы взяты один в один из SectionPanel: раньше
    // здесь стоял max-w-7xl против max-w-6xl у секций, и футер торчал по
    // 64px с каждой стороны — на широком экране это было заметно.
    // Нижний отступ больше обычного: на телефоне под футером висит
    // фиксированная панель навигации, с lg она пропадает.
    <footer className="px-3 pt-4 pb-[calc(4rem+env(safe-area-inset-bottom)+1.5rem)] sm:px-6 sm:pt-6 lg:px-8 lg:pb-6">
      <div className="mx-auto max-w-6xl rounded-3xl bg-card px-5 py-12 ring-1 ring-border sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href={prefix || '/'} className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <Image src="/images/logo.webp" alt="Логотип 32Дент" width={168} height={111} />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {isHub
                ? // Условия гарантии различаются по городам (см. content/minsk.ts),
                  // поэтому хаб-страница не называет конкретный срок.
                  'Сеть стоматологий 32Дент в Минске, Рогачёве и Жлобине. Гарантия на все виды работ.'
                : `Стоматология в ${city!.nameIn}. ${chrome!.guaranteeSummary}`}
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
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
                        <Mail className="size-3" /> {c.email}
                      </a>
                    )}
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
                {city!.email && (
                  <a href={`mailto:${city!.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Mail className="size-4" /> {city!.email}
                  </a>
                )}
                <p className="text-sm text-muted-foreground">{formatCityHours(chrome!.hours)}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  {getMessengerLinks(city).map((m) => (
                    <a
                      key={m.id}
                      href={m.href}
                      {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                    >
                      <MessengerIcon id={m.id} className="size-4" /> {m.label}
                    </a>
                  ))}
                </div>
                {towns.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Принимаем пациентов из{' '}
                    {towns.map((t, i) => (
                      <span key={t.slug}>
                        {i > 0 && ', '}
                        <Link href={`/${t.slug}`} className="underline underline-offset-2 hover:text-primary">
                          {t.nameFrom}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          {isHub ? (
            // На странице сети — реквизиты каждой клиники: у городов могут
            // быть разные юрлица.
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((c) => (
                <LegalRequisites key={c.slug} city={c} className="flex flex-col gap-1" />
              ))}
            </div>
          ) : (
            <LegalRequisites city={city!} className="flex flex-col gap-1" />
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {legalDocuments.map((doc) => (
              <Link
                key={doc.slug}
                href={legalDocHref(doc.slug, citySlug)}
                className="underline underline-offset-2 hover:text-primary"
              >
                {doc.shortTitle}
              </Link>
            ))}
          </div>
          <p>{siteConfig.disclaimer}</p>
          <p>© 32Дент, {new Date().getFullYear()}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
