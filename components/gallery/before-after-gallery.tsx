'use client'

import * as React from 'react'

import { CaseCard } from '@/components/gallery/case-card'
import { getGalleryItemsForCity, getGalleryServiceSlugs } from '@/lib/data/before-after'
import { useCity } from '@/lib/contexts/city-context'
import { serviceCategories } from '@/lib/services-data'
import { cn } from '@/lib/utils'

export function BeforeAfterGallery() {
  const { city } = useCity()
  const [filter, setFilter] = React.useState('all')

  // Только работы этой клиники (или иллюстрации, пока их нет) — раньше в
  // Минске показывались кейсы жлобинских врачей.
  const items = React.useMemo(() => getGalleryItemsForCity(city.slug), [city.slug])
  const filters = React.useMemo(
    () => [
      { id: 'all', label: 'Все' },
      ...getGalleryServiceSlugs(city.slug).map((slug) => ({
        id: slug,
        label: serviceCategories.find((s) => s.slug === slug)?.shortName ?? slug,
      })),
    ],
    [city.slug]
  )

  const visible = filter === 'all' ? items : items.filter((g) => g.item.serviceSlug === filter)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по услугам">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              filter === f.id
                ? 'border-primary bg-primary text-primary-foreground'
                : // Тот же язык, что у вторичной кнопки (variant="outline"):
                  // индиговый контур и текст, на hover контур плотнее и
                  // появляется лёгкая заливка.
                  'border-primary/30 text-primary hover:border-primary/50 hover:bg-primary/8'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {visible.map((entry) => (
          <CaseCard key={entry.item.id} entry={entry} headingTag="h2" />
        ))}
      </div>
    </div>
  )
}
