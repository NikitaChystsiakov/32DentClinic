'use client'

import { usePathname } from 'next/navigation'

import { getCityBySlug, type City } from '@/config/cities'

export function useCurrentCity(): City | null {
  const pathname = usePathname()
  const match = pathname?.match(/^\/([a-z-]+)(\/|$)/)
  if (match) {
    const city = getCityBySlug(match[1])
    if (city) return city
  }
  return null
}
