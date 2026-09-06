'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

/**
 * Переключатель темы — такая же иконка-действие, как Viber и Telegram в шапке
 * (класс .icon-action в globals.css). Раньше это была ghost-кнопка из ui/button:
 * она отличалась от соседних иконок и размером, и анимацией наведения.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  return (
    <button
      type="button"
      aria-label="Переключить тему"
      className={cn('icon-action', className)}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {mounted && resolvedTheme === 'dark' ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
    </button>
  )
}
