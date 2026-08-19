import type { Metadata } from 'next'
import { MapPin, Navigation, Send } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { ContactBookingButton } from '@/components/contact/contact-booking-button'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Контакты',
  description: `Адрес, телефон и часы работы стоматологии 32Дент в ${siteConfig.city}.`,
}

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Контакты 32Дент
      </h1>

      <div className="grid gap-10 md:grid-cols-2">
        <Reveal delay={0}>
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-1">
                <span className="font-heading text-base font-semibold text-foreground">Адрес</span>
                <span className="text-muted-foreground">{siteConfig.address}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-heading text-base font-semibold text-foreground">Часы работы</span>
              <table className="w-full max-w-sm text-sm">
                <tbody>
                  {siteConfig.hoursFull.map((row) => (
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
                href={siteConfig.phoneHref}
                className="text-2xl font-bold text-foreground hover:text-primary"
              >
                {siteConfig.phoneDisplay}
              </a>
              <div className="mt-1 flex items-center gap-4">
                <a
                  href={siteConfig.viberHref}
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

            <ContactBookingButton />
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-sm sm:aspect-4/3">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3Ac1f650571113f9c8206afea28bfd8a278ae9fe9beb9ef7fa6baf9730d9a63a6e&amp;source=constructor"
                className="absolute inset-0 size-full border-0"
                loading="lazy"
                title="Карта проезда к 32Дент"
              />
            </div>

            <a
              href="https://yandex.ru/maps/?um=constructor%3Ac1f650571113f9c8206afea28bfd8a278ae9fe9beb9ef7fa6baf9730d9a63a6e"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Navigation className="size-4" />
              Проложить маршрут
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}