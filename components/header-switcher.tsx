'use client'

import { usePathname } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { HomeHeader } from '@/components/home-header'

export function HeaderSwitcher() {
  const pathname = usePathname()
  if (pathname === '/') return <HomeHeader />
  return <SiteHeader />
}
