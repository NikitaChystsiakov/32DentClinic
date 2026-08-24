'use client'

import Link from 'next/link'
import { Calculator, ArrowRight, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCity } from '@/lib/contexts/city-context'

export function CalculatorTeaserSection() {
  const { city } = useCity()

  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary-foreground/10">
            <Calculator className="size-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Узнайте предварительную стоимость лечения
          </h2>
          <p className="max-w-lg text-pretty text-primary-foreground/80">
            Ответьте на несколько вопросов о ваших зубах — получите план и ориентировочную цену, а заодно
            промокод на скидку при записи.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
            <Percent className="size-4" />
            <span>Промокод действует 7 дней после расчёта</span>
          </div>
        </div>
        <Button
          size="lg"
          variant="secondary"
          className="w-fit shrink-0"
          render={<Link href={`/${city.slug}/kalkulyator/`} />}
          nativeButton={false}
        >
          Рассчитать стоимость
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </section>
  )
}
