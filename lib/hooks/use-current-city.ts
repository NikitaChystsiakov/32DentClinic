'use client'

import { usePathname } from 'next/navigation'

import { getCityBySlug, type City } from '@/config/cities'
import { getNearbyTownBySlug, getPrimaryClinicSlug } from '@/config/nearby-towns'

/**
 * Клиника, к которой относится текущий адрес: /rogachev/... → Рогачёв.
 * Для «соседних» городов без клиники (/svetlogorsk) — их основная клиника
 * из config/nearby-towns.ts, чтобы шапка, футер, нижняя панель и форма
 * записи показывали её телефон, адрес и ссылки. На страницах сети (/, /blog)
 * — null.
 */
export function useCurrentCity(): City | null {
  const pathname = usePathname()
  const match = pathname?.match(/^\/([a-z-]+)(\/|$)/)
  if (match) {
    const city = getCityBySlug(match[1])
    if (city) return city
    const town = getNearbyTownBySlug(match[1])
    if (town) return getCityBySlug(getPrimaryClinicSlug(town)) ?? null
  }
  return null
}
