import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getServiceBySlug, serviceCategories } from '@/config/services'
import { ServiceDetailContent } from '@/components/services/service-detail-content'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd, buildMetadata, cityMetaDescription, faqJsonLd } from '@/lib/seo'

// «Имплантация» здесь не собирается: у неё свой статический сегмент
// uslugi/implantaciya/ с хабом протоколов, который перекрывает [slug].
export function generateStaticParams() {
  return serviceCategories
    .filter((service) => service.slug !== 'implantaciya')
    .flatMap((service) =>
      service.availableIn.map((city) => ({
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

  // Название клиники добавит шаблон title из app/[city]/layout.tsx.
  return buildMetadata({
    title: `${service.metaTitle} в ${city.nameIn}`,
    description: cityMetaDescription(service.metaDescription, city, service.priceFrom),
    path: `/${citySlug}/uslugi/${slug}/`,
    city,
  })
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city: citySlug, slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Главная', path: `/${citySlug}/` },
          { name: 'Услуги', path: `/${citySlug}/uslugi/` },
          { name: service.shortName },
        ])}
      />
      {/* FAQPage — расширенный сниппет в выдаче; только если вопросы есть. */}
      {service.faq.length > 0 && <JsonLd data={faqJsonLd(service.faq)} />}
      <ServiceDetailContent slug={slug} />
    </>
  )
}
