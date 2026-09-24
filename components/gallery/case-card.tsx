'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Compare } from '@/components/before-after'
import type { GalleryItem } from '@/lib/data/before-after'

/*
 * Карточка «до/после» — одна и для галереи, и для тизера на главной, чтобы
 * правила подписи (lib/data/before-after.ts) нельзя было обойти в одном из
 * мест. Заголовок как h3 в тизере и h2 в галерее — передаётся снаружи.
 */
export function CaseCard({
  entry,
  headingTag: Heading = 'h3',
}: {
  entry: GalleryItem
  headingTag?: 'h2' | 'h3'
}) {
  const { item } = entry
  return (
    <Card className="h-full ring-silver/25 transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-xl">
      <CardContent className="flex h-full flex-col gap-4 p-4">
        <Compare before={item.before} after={item.after} />
        <div className="flex flex-col gap-1 px-1">
          <Heading className="font-heading text-lg font-semibold text-foreground">{item.title}</Heading>
          <p className="text-sm text-muted-foreground">{item.work}</p>
        </div>
      </CardContent>
    </Card>
  )
}
