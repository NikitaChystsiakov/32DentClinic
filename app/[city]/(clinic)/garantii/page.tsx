import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GuaranteePolicyPage } from '@/components/guarantee/guarantee-policy'
import { JsonLd } from '@/components/seo/json-ld'
import { getCityBySlug } from '@/config/cities'
import { getGuaranteePolicy } from '@/config/guarantees'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

// Гарантии клиники города: выжимка из положения и ссылка на PDF. Есть только
// у городов с записью в config/guarantees.ts — остальным notFound(), как у
// протоколов имплантации вне availableIn.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city || !getGuaranteePolicy(citySlug)) return {}
  return buildMetadata({
    title: 'Гарантии и сроки службы',
    description: `Гарантийные сроки на пломбы, коронки, протезы и имплантацию в ${city.brandName} ${city.name}: на что даётся гарантия, условия и как обратиться. Полный текст положения — в PDF.`,
    path: `/${citySlug}/garantii/`,
    city,
  })
}

export default async function GuaranteesPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  const policy = getGuaranteePolicy(citySlug)
  if (!city || !policy) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Главная', path: `/${citySlug}/` },
          { name: 'Гарантии' },
        ])}
      />
      <GuaranteePolicyPage city={city} policy={policy} />
    </>
  )
}
