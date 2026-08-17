import type { Metadata } from 'next'

import { Reveal } from '@/components/reveal'
import { BeforeAfter } from '@/components/before-after'
import { GalleryFinalCta } from '@/components/gallery/gallery-final-cta'

export const metadata: Metadata = {
  title: 'Примеры работ',
  description: 'Фотографии результатов лечения в стоматологии Dent32 — примеры до и после.',
}

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal delay={0}>
        <div className="mb-10 flex flex-col gap-4">
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Наши результаты
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Реальные результаты лечения наших врачей. Передвиньте ползунок, чтобы сравнить «до» и «после».
          </p>
        </div>
      </Reveal>

      <Reveal delay={0}>
        <BeforeAfter />
      </Reveal>

      <Reveal delay={2}>
        <GalleryFinalCta />
      </Reveal>
    </div>
  )
}