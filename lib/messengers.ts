import type { City } from '@/config/cities'
import { siteConfig } from '@/lib/site-config'

/*
 * Ссылки на мессенджеры клиники. Раньше Viber собирался как
 * `https://viber.com/<номер>` — такого адреса у Viber нет, ссылка открывала
 * сайт viber.com. Рабочий формат — deep link `viber://chat?number=%2B375…`:
 * на телефоне и на компьютере с установленным Viber открывается чат с
 * номером клиники. Номер берётся из телефона города, поэтому в Минске это
 * минский чат, а не рогачёвский.
 */
export function viberChatHref(city: City): string {
  const digits = city.phoneHref.replace(/\D/g, '')
  return `viber://chat?number=%2B${digits}`
}

/** Telegram один на сеть (см. lib/site-config.ts); при появлении городских — добавить поле в City. */
export function telegramHref(): string {
  return siteConfig.telegramHref
}

/** Чат WhatsApp по номеру из City.whatsapp; нет номера — нет ссылки. */
export function whatsappHref(city: City): string | null {
  if (!city.whatsapp) return null
  return `https://wa.me/${city.whatsapp.replace(/\D/g, '')}`
}

export type MessengerId = 'viber' | 'telegram' | 'whatsapp' | 'max' | 'instagram'

export interface MessengerLink {
  id: MessengerId
  label: string
  href: string
  /** Открывать в новой вкладке (сайты соцсетей); deep link Viber — нет. */
  external: boolean
}

/**
 * Все способы написать клинике города в одном порядке — для страницы
 * контактов, подвала и мобильного меню. Viber всегда (собирается из
 * телефона), Telegram — сети, остальные только если заполнены в
 * config/cities.ts. Без города (страницы сети) — только Telegram.
 */
export function getMessengerLinks(city: City | null | undefined): MessengerLink[] {
  const links: MessengerLink[] = []
  if (city) links.push({ id: 'viber', label: 'Viber', href: viberChatHref(city), external: false })
  links.push({ id: 'telegram', label: 'Telegram', href: telegramHref(), external: true })
  if (city) {
    const whatsapp = whatsappHref(city)
    if (whatsapp) links.push({ id: 'whatsapp', label: 'WhatsApp', href: whatsapp, external: true })
    if (city.max) links.push({ id: 'max', label: 'MAX', href: city.max, external: true })
    if (city.instagram) links.push({ id: 'instagram', label: 'Instagram', href: city.instagram, external: true })
  }
  return links
}
