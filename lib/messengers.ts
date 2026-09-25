import type { City } from '@/config/cities'
import { siteConfig } from '@/lib/site-config'

/*
 * Ссылки на мессенджеры клиники. Раньше Viber собирался как
 * `https://viber.com/<номер>` — такого адреса у Viber нет, ссылка открывала
 * сайт viber.com. Рабочий формат — deep link `viber://chat?number=%2B375…`:
 * на телефоне и на компьютере с установленным Viber открывается чат с
 * номером клиники. Номер — телефон города (заказчик, 17.09.2026: Viber
 * везде на номере клиники).
 */
export function viberChatHref(city: City): string {
  return `viber://chat?number=%2B${phoneDigits(city)}`
}

/**
 * Telegram: у города — своя ссылка из City.telegram (у Рогачёва — по
 * номеру, у Минска — @Dent32plus); если у города не задана и на страницах
 * сети — Telegram сети из lib/site-config.ts.
 */
export function telegramHref(city?: City | null): string {
  return city?.telegram ?? siteConfig.telegramHref
}

function phoneDigits(city: City): string {
  return city.phoneHref.replace(/\D/g, '')
}

/** Чат WhatsApp: номер из City.whatsapp, а если он не задан — телефон города. */
export function whatsappHref(city: City): string {
  const digits = city.whatsapp ? city.whatsapp.replace(/\D/g, '') : phoneDigits(city)
  return `https://wa.me/${digits}`
}

/** Чат в MAX: ссылка из City.max, а пока её нет — сайт мессенджера. */
export function maxHref(city: City): string {
  return city.max ?? siteConfig.maxHref
}

export type MessengerId = 'viber' | 'telegram' | 'whatsapp' | 'max' | 'instagram'

/**
 * Ссылка на чат именно этой клиники — или null, если у города своей нет и
 * getMessengerLinks подставил бы общую (Telegram сети, сайт MAX). Нужна на
 * страницах сети, где человек сам выбирает клинику: пункт «Жлобин» не должен
 * вести в минский Telegram.
 */
export function cityMessengerHref(city: City, id: MessengerId): string | null {
  switch (id) {
    case 'viber':
      return viberChatHref(city)
    case 'whatsapp':
      return whatsappHref(city)
    case 'telegram':
      return city.telegram ?? null
    case 'max':
      return city.max ?? null
    case 'instagram':
      return city.instagram ?? null
  }
}

export interface MessengerLink {
  id: MessengerId
  label: string
  href: string
  /** Открывать в новой вкладке (сайты соцсетей); deep link Viber — нет. */
  external: boolean
}

/**
 * Все способы написать клинике города в одном порядке — для страницы
 * контактов, подвала и мобильного меню. У каждого города всегда четыре:
 * Viber, Telegram, WhatsApp, MAX (заказчик, 17.09.2026); Instagram — только
 * если заполнен в config/cities.ts. Без города (страницы сети) — Telegram сети.
 */
export function getMessengerLinks(city: City | null | undefined): MessengerLink[] {
  const links: MessengerLink[] = []
  if (city) links.push({ id: 'viber', label: 'Viber', href: viberChatHref(city), external: false })
  links.push({ id: 'telegram', label: 'Telegram', href: telegramHref(city), external: true })
  if (city) {
    links.push({ id: 'whatsapp', label: 'WhatsApp', href: whatsappHref(city), external: true })
    links.push({ id: 'max', label: 'MAX', href: maxHref(city), external: true })
    if (city.instagram) links.push({ id: 'instagram', label: 'Instagram', href: city.instagram, external: true })
  }
  return links
}
