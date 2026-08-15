import type { Metadata } from 'next'
import { SplitSquareHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { GalleryFinalCta } from '@/components/gallery/gallery-final-cta'

export const metadata: Metadata = {
  title: 'Примеры работ',
  description: 'Фотографии результатов лечения в стоматологии Dent32 — примеры до и после.',
}

const PLACEHOLDER_CARDS = [
  'Терапия',
  'Хирургия',
  'Ортодонтия',
  'Протезирование',
  'Имплантация',
  'Проф.гигиена и отбеливание',
]

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4">
        <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Наши результаты
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Реальные результаты лечения наших врачей. Фотографии клиника добавляет и обновляет регулярно.
        </p>
      </div>

      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_CARDS.map((name) => (
          <Card key={name}>
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SplitSquareHorizontal className="size-7" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-base font-semibold text-foreground">{name}</p>
                <p className="text-sm text-muted-foreground">Фотографии добавляются</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <GalleryFinalCta />
    </div>
  )
}
