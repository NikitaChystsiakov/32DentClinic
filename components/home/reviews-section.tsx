'use client'

import * as React from 'react'
import { Quote, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { useCity } from '@/lib/contexts/city-context'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  quote: string
  author: string
  service?: string
  doctor?: string
}

function ReviewCard({ review }: { review: Review }) {
  const initial = review.author.trim().charAt(0).toUpperCase()

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-5 py-6">
        <div className="flex items-center justify-between">
          <Quote className="size-7 fill-primary/10 text-primary" />
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((step) => (
              <Star key={step} className="size-4 fill-accent text-accent" />
            ))}
          </div>
        </div>
        <p className="flex-1 text-pretty leading-relaxed text-foreground">{review.quote}</p>
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
            {initial}
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-foreground">{review.author}</p>
            {(review.service ?? review.doctor) && (
              <p className="text-xs text-muted-foreground">{review.service ?? review.doctor}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReviewsSection() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const { city, content } = useCity()
  const reviews = content.reviews as Review[]

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary">Отзывы</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Что говорят наши пациенты
          </h2>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Реальные впечатления пациентов о лечении в 32Дент.
          </p>
        </div>

        <Carousel
          opts={{ align: 'start', loop: true }}
          setApi={setApi}
          className="px-1"
        >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="basis-[85%] py-1 sm:basis-1/2 lg:basis-1/3"
              >
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>

        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              aria-label={`Перейти к отзыву ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'size-2.5 rounded-full transition-colors',
                index === current ? 'bg-primary' : 'bg-foreground/20 hover:bg-foreground/40'
              )}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            render={<a href="#" />}
            nativeButton={false}
          >
            Оставить отзыв
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<a href="#" />}
            nativeButton={false}
          >
            Читать все отзывы на {content.aggregators.source}
          </Button>
        </div>
      </div>
    </section>
  )
}
