'use client'

import { Mail, MapPin } from 'lucide-react'
import { useCity } from '@/lib/contexts/city-context'
import { MessengerIcon } from '@/components/icons/messenger-icon'
import { ContactBookingButton } from '@/components/contact/contact-booking-button'
import { Reveal } from '@/components/reveal'
import { LazyMap } from '@/components/lazy-map'
import { getMessengerLinks } from '@/lib/messengers'

// Разметка страницы /<город>/kontakty/; метаданные задаёт серверная
// app/[city]/(clinic)/kontakty/page.tsx.
export function ContactsPageContent() {
  const { city, content } = useCity()
  // Viber, Telegram и — если заполнены в config/cities.ts — WhatsApp, MAX,
  // Instagram.
  const messengers = getMessengerLinks(city)

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {content.contacts.title}
      </h1>

      <div className="grid gap-10 md:grid-cols-2">
        <Reveal delay={0}>
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-1">
                <span className="font-heading text-base font-semibold text-foreground">Адрес</span>
                <span className="text-muted-foreground">{city.address}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-heading text-base font-semibold text-foreground">Часы работы</span>
              <table className="w-full max-w-sm text-sm">
                <tbody>
                  {content.contacts.hours.map((row) => (
                    <tr key={row.days} className="border-b border-border last:border-0">
                      <td className="py-2 text-muted-foreground">{row.days}</td>
                      <td className="py-2 text-right font-medium text-foreground">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-heading text-base font-semibold text-foreground">Телефон</span>
              <a
                href={city.phoneHref}
                className="text-2xl font-bold text-foreground hover:text-primary"
              >
                {city.phone}
              </a>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                {messengers.map((m) => (
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
            </div>

            {city.email && (
              <div className="flex items-start gap-3">
                <Mail className="mt-1 size-5 shrink-0 text-primary" />
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-base font-semibold text-foreground">E-mail</span>
                  <a href={`mailto:${city.email}`} className="text-muted-foreground hover:text-primary">
                    {city.email}
                  </a>
                </div>
              </div>
            )}

            <ContactBookingButton />
          </div>
        </Reveal>

        <Reveal delay={1}>
          <LazyMap
            embedSrc={`https://yandex.ru/map-widget/v1/?ll=${city.coordinates.lng},${city.coordinates.lat}&z=16&pt=${city.coordinates.lng},${city.coordinates.lat},pm2rdm`}
            externalHref={`https://yandex.ru/maps/?ll=${city.coordinates.lng},${city.coordinates.lat}&z=16&pt=${city.coordinates.lng},${city.coordinates.lat},pm2rdm`}
            title={`Карта проезда к ${city.brandName} в ${city.nameIn}`}
            address={city.address}
          />
        </Reveal>
      </div>
    </div>
  )
}
