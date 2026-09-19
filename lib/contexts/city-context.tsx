'use client'

import * as React from 'react'
import type { City } from '@/config/cities'
import type { CityContent } from '@/content'

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
  // Запасного варианта «по умолчанию Рогачёв» больше нет: ради него сюда
  // импортировался getCityContent, и контент всех трёх городов (53 КБ)
  // попадал в клиентский JS каждой страницы, включая хаб, — при том что
  // нужный город и так приходит из CityProvider в app/[city]/layout.tsx.
  // Корневые страницы (хаб, блог, документы) useCity() не вызывают.
  throw new Error('useCity() вызван вне CityProvider — компонент должен рендериться внутри app/[city]/')
}
