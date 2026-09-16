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
import { getCityBySlug } from '@/config/cities'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}
  return buildMetadata({
    title: 'Документы и лицензии',
    description: `Лицензия на медицинскую деятельность, реквизиты и документы стоматологии ${city.brandName} в ${city.nameIn}.`,
    path: `/${citySlug}/o-nas/dokumenty-i-licenzii/`,
    city,
  })
}

export default async function DocumentsPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${citySlug}/`}>Главная</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${citySlug}/o-nas/`}>О нас</Link>} />
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
