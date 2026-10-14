import { serviceCategories } from '@/config/services'
import type { MedTourismPrice } from '@/content/medtourism'

/**
 * Сумма карточки цены в BYN — из прайса config/services.ts по точным
 * названиям строк. Строки ищутся во всех услугах: «имплант под ключ»
 * складывается из имплантации и протезирования. Строки нет или цена не
 * опубликована (tbd) — ошибка сборки: лучше упасть, чем показать
 * россиянину 0 ₽ или устаревшую сумму после переименования в прайсе.
 */
export function medTourismPriceByn(price: MedTourismPrice): number {
  return price.procedures.reduce((sum, name) => {
    const procedure = serviceCategories.flatMap((s) => s.procedures).find((p) => p.name === name)
    if (!procedure || procedure.tbd) {
      throw new Error(`content/medtourism.ts: в прайсе нет цены для «${name}» (карточка «${price.title}»)`)
    }
    return sum + procedure.priceFrom
  }, 0)
}
