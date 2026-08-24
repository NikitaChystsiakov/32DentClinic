'use client'

import * as React from 'react'
import type { City } from '@/config/cities'
import type { CityContent } from '@/content'
import { getCityBySlug } from '@/config/cities'
import { getCityContent } from '@/content'

interface CityContextValue {
  city: City
  content: CityContent
}

const CityContext = React.createContext<CityContextValue | null>(null)

export function CityProvider({
  city,
  content,
  children,
}: {
  city: City
  content: CityContent
  children: React.ReactNode
}) {
  return (
    <CityContext.Provider value={{ city, content }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  const context = React.useContext(CityContext)
  if (context) return context

  // Fallback for root pages without CityProvider — default to Rogachev
  const city = getCityBySlug('rogachev')!
  const content = getCityContent('rogachev')!
  return { city, content }
}
