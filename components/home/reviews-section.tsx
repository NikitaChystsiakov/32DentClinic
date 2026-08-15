import { Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { siteConfig } from '@/lib/site-config'

const REVIEWS = [
  {
    quote: 'Очень довольна лечением, врач всё подробно объяснил и без боли',
    author: 'Пациентка, Рогачёв',
  },
  {
    quote: 'Ребёнок первый раз спокойно высидел приём, врач нашёл подход',
    author: 'Родитель пациента',
  },
  {
    quote: 'Быстро помогли, когда срочно заболел зуб в командировке',
    author: 'Пациент',
  },
]

function ReviewCard({ quote, author }: { quote: string; author: string }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4 py-6">
        <Quote className="size-6 text-primary/40" />
        <p className="flex-1 text-pretty leading-relaxed text-foreground">{quote}</p>
        <p className="text-sm font-medium text-muted-foreground">{author}</p>
      </CardContent>
    </Card>
  )
}

export function ReviewsSection() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary">Отзывы</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Что говорят наши пациенты
          </h2>
          <p className="flex items-center gap-1.5 text-pretty text-muted-foreground">
            <Star className="size-4 fill-accent text-accent" />
            {siteConfig.reviewsCount}+ отзывов на {siteConfig.reviewsSource} со средней оценкой{' '}
            {siteConfig.rating}
          </p>
        </div>

        <div className="hidden gap-4 sm:grid sm:grid-cols-3">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.author} {...review} />
          ))}
        </div>

        <Carousel opts={{ align: 'start' }} className="sm:hidden">
          <CarouselContent>
            {REVIEWS.map((review) => (
              <CarouselItem key={review.author} className="basis-[85%]">
                <ReviewCard {...review} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" render={<a href="#" />} nativeButton={false}>
            Оставить отзыв
          </Button>
          <Button variant="outline" render={<a href="#" />} nativeButton={false}>
            Читать все отзывы на {siteConfig.reviewsSource}
          </Button>
        </div>
      </div>
    </section>
  )
}
