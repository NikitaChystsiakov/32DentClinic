'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cities } from '@/config/cities'

export function HomeHeader() {
  const [scrolled, setScrolled] = React.useState(false)
  const [cityOpen, setCityOpen] = React.useState(false)
  const cityDropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setCityOpen(false)
      }
    }
    if (cityOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [cityOpen])

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
          'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8',
          scrolled ? 'h-16' : 'h-20'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-heading text-xl font-bold text-foreground">
          <span className="flex size-24 items-center justify-center rounded-lg text-primary-foreground">
            <Image src="/images/logo.png" alt="Логотип 32Дент" width={168} height={111} loading="eager" />
          </span>
        </Link>

        {/* City dropdown — lg+ */}
        <div ref={cityDropdownRef} className="relative hidden shrink-0 lg:block">
          <button
            type="button"
            onClick={() => setCityOpen((o) => !o)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted',
              cityOpen && 'bg-muted'
            )}
          >
            <MapPin className="size-3.5 text-primary" />
            Выберите город
            <ChevronDown className={cn('size-3.5 transition-transform', cityOpen && 'rotate-180')} />
          </button>
          {cityOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
              <div className="p-1">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    onClick={() => setCityOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <MapPin className="size-3.5" />
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side — desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => {
              document.getElementById('city-cards')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Выбрать город
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Выбрать город"
            onClick={() => {
              document.getElementById('city-cards')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <MapPin className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
