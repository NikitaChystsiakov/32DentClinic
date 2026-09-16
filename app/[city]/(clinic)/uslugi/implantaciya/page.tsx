import type { Metadata } from 'next'
import { getCityBySlug } from '@/config/cities'
import { implantBrands } from '@/config/implantation'
import { ImplantationHub } from '@/components/implantation/implantation-hub'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

/*
 * Хаб раздела «Имплантация». Статический сегмент uslugi/implantaciya/
 * перекрывает динамический uslugi/[slug]/ — у главного направления сети
 * своя страница с протоколами, врачами и FAQ, а не общий шаблон услуги.
 * generateStaticParams не нужен: параметр city перечисляет (clinic)/layout.tsx.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}

  const brands = implantBrands.map((b) => b.name).join(' и ')
  // Название клиники и город добавит шаблон title из app/[city]/layout.tsx.
  return buildMetadata({
    title: `Имплантация зубов в ${city.nameIn} — под ключ, All-on-4, All-on-6`,
    description: `Имплантация зубов в ${city.nameIn}: один зуб под ключ, All-on-4 и All-on-6, синус-лифтинг. Импланты ${brands}, планирование по 3D-снимку, стоимость до начала лечения.`,
    path: `/${citySlug}/uslugi/implantaciya/`,
    city,
  })
}

export default async function ImplantationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Главная', path: `/${citySlug}/` },
          { name: 'Услуги', path: `/${citySlug}/uslugi/` },
          { name: 'Имплантация' },
        ])}
      />
      <ImplantationHub />
    </>
  )
}
