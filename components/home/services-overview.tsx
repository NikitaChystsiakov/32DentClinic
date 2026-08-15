import Link from 'next/link'
import { ArrowRight, Stethoscope, Scissors, Smile, Crown, Zap, Sparkles, ScanLine } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { serviceCategories } from '@/lib/services-data'

const icons = {
  Stethoscope,
  Scissors,
  Smile,
  Crown,
  Zap,
  Sparkles,
  ScanLine,
} as const

export function ServicesOverview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Направления</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Что мы лечим</h2>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          От планового осмотра до сложного протезирования — семь направлений на одной базе, с общей
          историей лечения у каждого пациента.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCategories.map((service) => {
          const Icon = icons[service.icon as keyof typeof icons]
          return (
            <Link key={service.slug} href={`/uslugi/${service.slug}/`}>
              <Card className="h-full transition-colors hover:ring-primary/40">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{service.shortName}</CardTitle>
                  <CardDescription className="line-clamp-2">{service.cardDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">от {service.priceFrom} р.</span>
                    <span className="inline-flex items-center gap-1 text-primary">
                      Подробнее
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
