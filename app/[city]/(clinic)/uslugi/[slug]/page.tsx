import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}

  return {
    title: service.metaTitle,
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
