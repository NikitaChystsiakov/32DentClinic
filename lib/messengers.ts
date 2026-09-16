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
