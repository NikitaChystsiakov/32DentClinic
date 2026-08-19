import { Star, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { aggregatorRatings, type AggregatorRating } from '@/lib/data/aggregators'
import { cn } from '@/lib/utils'

function PlatformLogo({ id }: { id: AggregatorRating['id'] }) {
  if (id === '103by') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#0d6efd] font-heading text-sm font-bold text-white">
          103
        </span>
        <span className="font-heading text-2xl font-bold tracking-tight text-[#0d6efd]">.by</span>
      </span>
    )
  }
  if (id === 'yandex') {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-[#fc3f1d] font-heading text-sm font-bold text-white">
          Я
        </span>
        <span className="font-heading text-2xl font-bold tracking-tight text-[#fc3f1d]">
          Яндекс
        </span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center font-heading text-2xl font-bold tracking-tight">
      <span className="text-[#4285f4]">G</span>
      <span className="text-[#ea4335]">o</span>
      <span className="text-[#fbbc05]">o</span>
      <span className="text-[#4285f4]">g</span>
      <span className="text-[#34a853]">l</span>
      <span className="text-[#ea4335]">e</span>
    </span>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          className={cn(
            'size-4',
            step <= Math.round(rating) ? 'fill-accent text-accent' : 'text-foreground/15'
          )}
        />
      ))}
    </div>
  )
}

function RatingCard({ aggregator }: { aggregator: AggregatorRating }) {
  return (
    <a
      href={aggregator.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group h-full"
    >
      <Card className="h-full transition-colors group-hover:ring-primary/40">
        <CardContent className="flex h-full flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <PlatformLogo id={aggregator.id} />
            {aggregator.rating !== null && <Star className="size-5 fill-accent text-accent" />}
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            {aggregator.rating !== null ? (
              <>
                <div className="flex items-end gap-1.5">
                  <span className="font-heading text-3xl font-bold text-foreground">
                    {aggregator.rating}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">из 5</span>
                </div>
                <Stars rating={aggregator.rating} />
                <p className="text-sm text-muted-foreground">
                  {aggregator.reviewsCount} отзывов
                </p>
              </>
            ) : (
              <>
                <div className="flex items-end gap-1.5">
                  <span className="font-heading text-3xl font-bold text-foreground/30">—</span>
                  <span className="mb-1 text-sm text-muted-foreground">из 5</span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <Star key={step} className="size-4 text-foreground/15" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Рейтинг уточняется</p>
              </>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Читать отзывы
            <ExternalLink className="size-3.5" />
          </span>
        </CardContent>
      </Card>
    </a>
  )
}

export function RatingsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Оценки на площадках</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Нам доверяют на картах и в каталогах
        </h2>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Посмотрите отзывы пациентов о клинике 32Дент на популярных сервисах.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aggregatorRatings.map((aggregator) => (
          <RatingCard key={aggregator.id} aggregator={aggregator} />
        ))}
      </div>
    </section>
  )
}