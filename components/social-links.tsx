import { MessengerIcon } from '@/components/icons/messenger-icon'
import type { City } from '@/config/cities'
import { getMessengerLinks } from '@/lib/messengers'
import { cn } from '@/lib/utils'

/*
 * Соцсети и мессенджеры клиники города круглыми кнопками — для главных
 * страниц (хаб сети и главная города). Набор и порядок — из
 * getMessengerLinks: Viber, Telegram, WhatsApp, MAX и Instagram, если он
 * задан в config/cities.ts. Серверный компонент — в клиентский JS не
 * попадает. Кнопки 44 px — минимальная зона нажатия на телефоне.
 */
export function SocialLinks({ city, className }: { city: City; className?: string }) {
  const links = getMessengerLinks(city)

  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label={`Соцсети и мессенджеры 32Дент ${city.name}`}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.href}
            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-label={`${link.label} — 32Дент ${city.name}`}
            title={link.label}
            className="flex size-11 items-center justify-center rounded-full bg-card text-primary ring-1 ring-primary/15 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <MessengerIcon id={link.id} className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  )
}
