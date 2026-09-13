import { notFound } from 'next/navigation'
import { isValidCitySlug, VALID_CITY_SLUGS } from '@/config/cities'

/*
 * Подстраницы клиники (/uslugi, /vrachi, /ceny, …) есть только у городов
 * из config/cities.ts. Родительский app/[city]/layout.tsx пропускает ещё и
 * «соседние» города из config/nearby-towns.ts — у них одна посадочная
 * страница, и /svetlogorsk/uslugi должен отдавать 404, а не показывать
 * жлобинские услуги под чужим адресом (дубли контента для поисковиков).
 *
 * generateStaticParams здесь уже: родительский перечисляет и соседние
 * города (ради /svetlogorsk), а подстраницы для них собирать незачем.
 */
export function generateStaticParams() {
  return VALID_CITY_SLUGS.map((city) => ({ city }))
}

export default async function ClinicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  if (!isValidCitySlug(city)) notFound()
  return children
}
