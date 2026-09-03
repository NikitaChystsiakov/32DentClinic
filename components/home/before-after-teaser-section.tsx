"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Quote } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Compare } from '@/components/before-after'
import { beforeAfterCases } from '@/lib/data/before-after'
import { useCity } from '@/lib/contexts/city-context'
import { cn } from '@/lib/utils'

interface BeforeAfterTeaserSectionProps {
  /**
   * Сколько карточек показывать в ряд на десктопе. При трёх карточка
   * становится уже, поэтому внутренности слегка ужимаются — иначе цитата
   * врача и подпись начинают рассыпаться по строкам.
   */
  columns?: 2 | 3
}

export function BeforeAfterTeaserSection({ columns = 2 }: BeforeAfterTeaserSectionProps) {
  const { city } = useCity()
  const compact = columns === 3

  return (
    <>
      <div className="mb-10 flex flex-col gap-2">
          <span className="text-sm font-medium text-(--panel-eyebrow)">Портфолио</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
            Наши результаты
          </h2>
          <p className="max-w-2xl text-pretty text-(--panel-body)">
            Передвиньте ползунок, чтобы увидеть, как меняется улыбка после лечения в 32Дент.
          </p>
        </div>

        <Carousel opts={{ align: 'start', loop: true }} className="px-1">
          <CarouselContent>
            {beforeAfterCases.map((c) => (
              <CarouselItem
                key={c.id}
                className={cn('basis-[88%] my-2 sm:basis-1/2', compact && 'lg:basis-1/3')}
              >
                <Card className="h-full ring-silver/25 transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-xl">
                  <CardContent className={cn('flex h-full flex-col gap-4 p-4', compact && 'gap-3 p-3.5')}>
                    <Compare before={c.before} after={c.after} />
                    <div className="flex flex-col gap-1 px-1">
                      <h3
                        className={cn(
                          'font-heading font-semibold text-foreground',
                          compact ? 'text-base' : 'text-lg'
                        )}
                      >
                        {c.title}
                      </h3>
                      <p className={cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>
                        {c.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'mt-auto flex items-start gap-3 rounded-lg border border-silver/30 bg-silver-muted/70 p-3',
                        compact && 'gap-2.5 p-2.5'
                      )}
                    >
                      <div
                        className={cn(
                          'relative shrink-0 overflow-hidden rounded-full ring-1 ring-silver/25',
                          compact ? 'size-9' : 'size-11'
                        )}
                      >
                        <Image
                          src={c.doctorPhoto}
                          alt={c.doctorName}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn('font-semibold text-foreground', compact ? 'text-xs' : 'text-sm')}>
                          {c.doctorName}
                        </p>
                        <p className={cn('text-muted-foreground', compact ? 'text-[11px]' : 'text-xs')}>
                          {c.doctorSpecialization}
                        </p>
                        <p
                          className={cn(
                            'mt-1.5 flex gap-1.5 leading-relaxed text-muted-foreground',
                            compact ? 'text-[11px]' : 'text-xs'
                          )}
                        >
                          <Quote className="mt-0.5 size-3 shrink-0 text-secondary" />
                          <span>{c.reasoning}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>

        <div className="mt-8 flex justify-center">
          <Button variant="silver" render={<Link href={`/${city.slug}/primery-rabot/`} />} nativeButton={false}>
            Смотреть все примеры
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
    </>
  )
}
