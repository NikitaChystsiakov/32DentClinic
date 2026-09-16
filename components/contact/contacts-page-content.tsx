'use client'

import { MapPin, Send } from 'lucide-react'
import { useCity } from '@/lib/contexts/city-context'
import { ViberIcon } from '@/components/icons/viber-icon'
import { ContactBookingButton } from '@/components/contact/contact-booking-button'
import { Reveal } from '@/components/reveal'
import { LazyMap } from '@/components/lazy-map'
import { telegramHref, viberChatHref } from '@/lib/messengers'

// Разметка страницы /<город>/kontakty/; метаданные задаёт серверная
// app/[city]/(clinic)/kontakty/page.tsx.
export function ContactsPageContent() {
  const { city, content } = useCity()

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
              <div className="mt-1 flex items-center gap-4">
                <a
                  href={viberChatHref(city)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                >
                  <ViberIcon className="size-4" /> Viber
                </a>
                <a
                  href={telegramHref()}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                >
                  <Send className="size-4" /> Telegram
                </a>
              </div>
            </div>

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
