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

export function BeforeAfterTeaserSection() {
  const { city } = useCity()

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
              <CarouselItem key={c.id} className="basis-[88%] my-2 sm:basis-1/2">
                <Card className="h-full ring-silver/25 transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-xl">
                  <CardContent className="flex h-full flex-col gap-4 p-4">
                    <Compare before={c.before} after={c.after} />
                    <div className="flex flex-col gap-1 px-1">
                      <h3 className="font-heading text-lg font-semibold text-foreground">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.description}</p>
                    </div>
                    <div className="mt-auto flex items-start gap-3 rounded-lg border border-silver/30 bg-silver-muted/70 p-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-silver/25">
                        <Image
                          src={c.doctorPhoto}
                          alt={c.doctorName}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{c.doctorName}</p>
                        <p className="text-xs text-muted-foreground">{c.doctorSpecialization}</p>
                        <p className="mt-1.5 flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
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
