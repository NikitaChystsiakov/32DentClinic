import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Calculator } from '@/components/calculator'

export const metadata: Metadata = {
  title: 'Рассчитать стоимость лечения',
  description: 'Узнайте примерный план лечения и ориентировочную стоимость за 1 минуту.',
}

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Главная</BreadcrumbLink>
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

      <Calculator showHeading={false} />
    </div>
  )
}
