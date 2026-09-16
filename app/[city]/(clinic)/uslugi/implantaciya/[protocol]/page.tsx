import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getProtocolBySlug, implantProtocols } from '@/config/implantation'
import { ProtocolContent } from '@/components/implantation/protocol-content'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, truncateDescription } from '@/lib/seo'

// Только пары «город + протокол» из availableIn: страница All-on-4 для
// города, где протокол не делают, в сборку не попадает и отдаёт 404.
export function generateStaticParams() {
  return implantProtocols.flatMap((protocol) =>
    protocol.availableIn.map((city) => ({ city, protocol: protocol.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; protocol: string }>
}): Promise<Metadata> {
  const { city: citySlug, protocol: protocolSlug } = await params
  const protocol = getProtocolBySlug(protocolSlug)
  const city = getCityBySlug(citySlug)
  if (!protocol || !city) return {}

  return buildMetadata({
    title: `${protocol.metaTitle} в ${city.nameIn}`,
    description: truncateDescription(`${protocol.intro} ${city.brandName}, ${city.name}.`),
    path: `/${citySlug}/uslugi/implantaciya/${protocolSlug}/`,
    city,
  })
}

export default async function ProtocolPage({
  params,
}: {
  params: Promise<{ city: string; protocol: string }>
}) {
  const { city, protocol: protocolSlug } = await params
  const protocol = getProtocolBySlug(protocolSlug)
  if (!protocol || !protocol.availableIn.includes(city)) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Главная', path: `/${city}/` },
          { name: 'Услуги', path: `/${city}/uslugi/` },
          { name: 'Имплантация', path: `/${city}/uslugi/implantaciya/` },
          { name: protocol.shortName },
        ])}
      />
      {protocol.faq.length > 0 && <JsonLd data={faqJsonLd(protocol.faq)} />}
      <ProtocolContent slug={protocolSlug} />
    </>
  )
}
