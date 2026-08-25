'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

export function HomeHeader() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-transparent transition-all duration-300',
        scrolled
          ? 'border-border bg-background/90 shadow-sm backdrop-blur-md'
          : 'bg-background/60'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8',
          scrolled ? 'h-16' : 'h-20'
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2 font-heading text-xl font-bold text-foreground">
          <span className="flex size-24 items-center justify-center rounded-lg text-primary-foreground">
            <Image src="/images/logo.png" alt="Логотип 32Дент" width={168} height={111} loading="eager" />
          </span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  )
}
