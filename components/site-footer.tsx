import Link from 'next/link'
import { Phone, Send } from 'lucide-react'

import { navLinks, siteConfig } from '@/lib/site-config'
import { serviceCategories } from '@/lib/services-data'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                D32
              </span>
              Dent32
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Стоматология в Рогачёве. Гарантия 2 года на все виды работ.
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
            {serviceCategories.map((s) => (
              <Link
                key={s.slug}
                href={`/uslugi/${s.slug}/`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {s.shortName}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-semibold text-foreground">Контакты</h3>
            <p className="text-sm text-muted-foreground">{siteConfig.address}</p>
            <a href={siteConfig.phoneHref} className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Phone className="size-4" /> {siteConfig.phoneDisplay}
            </a>
            <p className="text-sm text-muted-foreground">
              {siteConfig.hoursFull[0].days}: {siteConfig.hoursFull[0].time}
              <br />
              {siteConfig.hoursFull[1].days} — {siteConfig.hoursFull[1].time}
            </p>
            <div className="flex items-center gap-3">
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
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            УНП {siteConfig.unp} · Лицензия № {siteConfig.license}
          </p>
          <p>{siteConfig.disclaimer}</p>
          <p>© Dent32, 2026. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
