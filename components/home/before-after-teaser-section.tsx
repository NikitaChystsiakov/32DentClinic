"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Compare } from '@/components/before-after'
import { beforeAfterCases } from '@/lib/data/before-after'

const TEASER_CASES = beforeAfterCases.slice(0, 4)

export function BeforeAfterTeaserSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Портфолио</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Наши результаты</h2>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Передвиньте ползунок, чтобы увидеть, как меняется улыбка после лечения в DENT32.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEASER_CASES.map((c) => (
          <Card key={c.id} className="h-full">
            <CardContent className="flex h-full flex-col gap-3 p-3">
              <Compare before={c.before} after={c.after} />
              <div className="flex flex-col gap-1 px-1 pb-1">
                <h3 className="font-heading text-sm font-semibold text-foreground">{c.title}</h3>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" render={<Link href="/primery-rabot/" />} nativeButton={false}>
          Смотреть все примеры
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </section>
  )
}