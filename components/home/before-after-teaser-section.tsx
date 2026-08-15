import Link from 'next/link'
import { ArrowRight, SplitSquareHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const PLACEHOLDER_CARDS = [
  { title: 'Протезирование' },
  { title: 'Имплантация' },
  { title: 'Реставрация зубов' },
]

export function BeforeAfterTeaserSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Портфолио</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Наши результаты</h2>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Клиника собирает фотографии до и после лечения — они появятся здесь по мере подготовки.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_CARDS.map((card) => (
          <Card key={card.title} className="h-full">
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SplitSquareHorizontal className="size-7" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-heading text-base font-semibold text-foreground">{card.title}</p>
                <p className="text-sm text-muted-foreground">Фотографии добавляются</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Button variant="outline" render={<Link href="/primery-rabot/" />} nativeButton={false}>
          Смотреть все работы
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </section>
  )
}
