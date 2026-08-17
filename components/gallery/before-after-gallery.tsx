"use client"

import * as React from 'react'

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
                : 'border-border text-foreground hover:border-primary/40 hover:text-primary'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <Card key={c.id} className="h-full">
            <CardContent className="flex h-full flex-col gap-3 p-3">
              <Compare before={c.before} after={c.after} />
              <div className="flex flex-col gap-1 px-1 pb-1">
                <h2 className="font-heading text-base font-semibold text-foreground">{c.title}</h2>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}