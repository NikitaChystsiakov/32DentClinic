"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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

export function BeforeAfterTeaserSection() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary">Портфолио</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Наши результаты</h2>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Передвиньте ползунок, чтобы увидеть, как меняется улыбка после лечения в 32Дент.
          </p>
        </div>

        <Carousel opts={{ align: 'start', loop: true }} className="px-1">
          <CarouselContent>
            {beforeAfterCases.map((c) => (
              <CarouselItem key={c.id} className="basis-full my-2 sm:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col gap-3 p-3">
                    <Compare before={c.before} after={c.after} />
                    <div className="flex flex-col gap-1 px-1 pb-1">
                      <h3 className="font-heading text-sm font-semibold text-foreground">{c.title}</h3>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
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
          <Button variant="outline" render={<Link href="/primery-rabot/" />} nativeButton={false}>
            Смотреть все примеры
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}