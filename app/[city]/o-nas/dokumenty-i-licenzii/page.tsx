import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PlaceholderGallery } from '@/components/about/placeholder-gallery'

export const metadata: Metadata = {
  title: 'Документы и лицензии — 32Дент',
  description: 'Документы и лицензии стоматологии 32Дент.',
}

export default function DocumentsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/`}>Главная</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/o-nas/`}>О нас</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Документы и лицензии</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Документы и лицензии
      </h1>

      <div className="mt-8">
        <PlaceholderGallery count={4} caption="Документы будут добавлены после предоставления клиникой" />
      </div>

      <p className="mt-8 text-pretty leading-relaxed text-muted-foreground">
        Документы будут добавлены после предоставления клиникой.
      </p>
    </section>
  )
}
