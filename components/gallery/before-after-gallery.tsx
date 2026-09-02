"use client"

import * as React from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Compare } from '@/components/before-after'
import { beforeAfterCases, getBeforeAfterServiceSlugs } from '@/lib/data/before-after'
import { serviceCategories } from '@/lib/services-data'
import { cn } from '@/lib/utils'

const serviceSlugs = getBeforeAfterServiceSlugs()

const FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Все' },
  ...serviceSlugs.map((slug) => ({
    id: slug,
    label: serviceCategories.find((s) => s.slug === slug)?.shortName ?? slug,
  })),
]

export function BeforeAfterGallery() {
  const [filter, setFilter] = React.useState('all')

  const cases =
    filter === 'all'
      ? beforeAfterCases
      : beforeAfterCases.filter((c) => c.serviceSlug === filter)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по услугам">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              filter === f.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-silver/30 text-foreground hover:border-primary/40 hover:text-primary'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {cases.map((c) => (
          <Card
            key={c.id}
            className="h-full ring-silver/25 transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-xl"
          >
            <CardContent className="flex h-full flex-col gap-4 p-4">
              <Compare before={c.before} after={c.after} />
              <div className="flex flex-col gap-1 px-1">
                <h2 className="font-heading text-lg font-semibold text-foreground">{c.title}</h2>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
              <div className="mt-auto flex items-start gap-3 rounded-lg border border-silver/30 bg-silver-muted/70 p-3">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-silver/25">
                  <Image
                    src={c.doctorPhoto}
                    alt={c.doctorName}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{c.doctorName}</p>
                  <p className="text-xs text-muted-foreground">{c.doctorSpecialization}</p>
                  <p className="mt-1.5 flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                    <Quote className="mt-0.5 size-3 shrink-0 text-secondary" />
                    <span>{c.reasoning}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
