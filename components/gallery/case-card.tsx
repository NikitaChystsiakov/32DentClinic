'use client'

import Image from 'next/image'
import { FileCheck2 } from 'lucide-react'

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

        {/* Блок врача и пометка о согласии — только у реальных кейсов.
            Иллюстрации (пока клиника собирает работы и согласия) показываются
            без подписи снизу: фото, вид работы и техническое описание. */}
        {entry.kind === 'case' && (
          <div className="mt-auto flex items-center gap-3 rounded-lg border border-silver/30 bg-silver-muted/70 p-3">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-silver/25">
              <Image src={entry.doctor.photo} alt={entry.doctor.name} fill sizes="44px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{entry.doctor.name}</p>
              <p className="text-xs text-muted-foreground">{entry.doctor.specialization}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileCheck2 className="size-3.5 shrink-0 text-secondary" />
                Опубликовано с письменного согласия пациента
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
