'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

interface MobileMenuContextValue {
  openMenu: () => void
  closeMenu: () => void
  setOpen: (open: boolean) => void
  isOpen: boolean
}

const MobileMenuContext = React.createContext<MobileMenuContextValue | null>(null)

/**
 * Мобильное меню одно на весь сайт, но открывают его из двух мест: бургер в
 * шапке (там его ищут по привычке) и кнопка в нижней панели. Поэтому состояние
 * живёт в провайдере, а сам Sheet рендерится один раз в layout — иначе на
 * странице оказалось бы два разных меню со своим состоянием.
 */
export function useMobileMenu() {
  const ctx = React.useContext(MobileMenuContext)
  if (!ctx) throw new Error('useMobileMenu должен вызываться внутри MobileMenuProvider')
  return ctx
}

// Шторка (components/mobile-menu-sheet.tsx) — ленивый чанк: base-ui Dialog и
// floating-ui нужны только после тапа по бургеру, а не на первом экране.
// Чтобы первый тап не ждал сеть, чанк подтягивается в idle после загрузки.
const loadSheet = () => import('@/components/mobile-menu-sheet')
const MobileMenuSheet = React.lazy(() => loadSheet().then((mod) => ({ default: mod.MobileMenuSheet })))

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  // Шторку монтируем с первого открытия и больше не размонтируем — иначе
  // не отыграет анимация закрытия.
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  const openMenu = React.useCallback(() => {
    setMounted(true)
    setIsOpen(true)
  }, [])
  const closeMenu = React.useCallback(() => setIsOpen(false), [])
  const value = React.useMemo(
    () => ({ openMenu, closeMenu, setOpen: setIsOpen, isOpen }),
    [openMenu, closeMenu, isOpen]
  )

  // Меню закрывается само при переходе: без этого после клика по ссылке
  // страница менялась, а шторка оставалась открытой поверх неё.
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  React.useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const id = idle(() => {
      void loadSheet()
    })
    return () => cancel(id)
  }, [])

  return (
    <MobileMenuContext.Provider value={value}>
      {children}
      {mounted && (
        <React.Suspense fallback={null}>
          <MobileMenuSheet />
        </React.Suspense>
      )}
    </MobileMenuContext.Provider>
  )
}
