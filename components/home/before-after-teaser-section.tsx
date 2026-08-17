"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { CASES, Compare } from '@/components/before-after'

const TEASER_CASES = CASES.slice(0, 3)

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

      <Tabs defaultValue={TEASER_CASES[0].id} className="mt-12">
        <TabsList className="mx-auto flex h-auto flex-wrap justify-center gap-1 p-1.5">
          {TEASER_CASES.map((c) => (
            <TabsTrigger key={c.id} value={c.id} className="h-9 px-4">
              {c.category}
            </TabsTrigger>
          ))}
        </TabsList>

        {TEASER_CASES.map((c) => (
          <TabsContent key={c.id} value={c.id} className="mt-8">
            <div className="mx-auto max-w-3xl">
              <Compare before={c.before} after={c.after} />
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-foreground">{c.procedure}</p>
                <p className="text-sm text-muted-foreground">{c.cost}</p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" render={<Link href="/primery-rabot/" />} nativeButton={false}>
          Смотреть все работы
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </section>
  )
}