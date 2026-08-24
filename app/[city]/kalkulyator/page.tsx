'use client'

import Link from 'next/link'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Calculator } from '@/components/calculator'
import { Reveal } from '@/components/reveal'
import { useCity } from '@/lib/contexts/city-context'

export default function CalculatorPage() {
  const { city } = useCity()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${city.slug}/`}>Главная</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Калькулятор</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mb-8 text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Рассчитать стоимость лечения
      </h1>

      <Reveal delay={0}>
        <Calculator showHeading={false} />
      </Reveal>
    </div>
  )
}
