import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getServiceBySlug, serviceCategories } from '@/config/services'
import { ServiceDetailContent } from '@/components/services/service-detail-content'

export function generateStaticParams() {
  return serviceCategories.flatMap((service) =>
    ['rogachev', 'minsk', 'zhlobin'].map((city) => ({
      city,
      slug: service.slug,
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}): Promise<Metadata> {
  const { city: citySlug, slug } = await params
  const service = getServiceBySlug(slug)
  const city = getCityBySlug(citySlug)
  if (!service || !city) return {}

  // Название клиники и город добавит шаблон title из app/[city]/layout.tsx.
  return {
    title: `${service.metaTitle} в ${city.nameIn}`,
    description: service.intro.slice(0, 155),
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  return <ServiceDetailContent slug={slug} />
}
