import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug } from '@/config/cities'
import { getDoctorBySlug, doctors } from '@/config/doctors'
import { DoctorDetailContent } from '@/components/doctors/doctor-detail-content'
import { JsonLd } from '@/components/seo/json-ld'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, truncateDescription } from '@/lib/seo'

export function generateStaticParams() {
  return doctors.flatMap((doctor) =>
    doctor.cities.map((city) => ({
      city,
      slug: doctor.slug,
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}): Promise<Metadata> {
  const { city: citySlug, slug } = await params
  const doctor = getDoctorBySlug(slug)
  const city = getCityBySlug(citySlug)
  if (!doctor || !city) return {}

  // Заглушки (isPlaceholder — выдуманные имена) в индекс не идут: поисковик
  // не должен показывать «врача», которого в клинике нет. Из sitemap они
  // уже исключены, но без noindex страницу всё равно можно найти по ссылке.
  // absoluteTitle: город уже в заголовке, шаблон «| 32Дент, Рогачёв» дописал
  // бы его второй раз и вылез бы за 60–65 знаков.
  return buildMetadata({
    title: `${doctor.name} — ${shortRole(doctor.specialization)} в ${city.nameIn} | ${city.brandName}`,
    absoluteTitle: true,
    description: truncateDescription(
      `${doctor.bio} Стаж ${doctor.experienceYears} лет. Стоматология ${city.brandName} в ${city.nameIn}, запись к врачу онлайн.`
    ),
    path: `/${citySlug}/vrachi/${slug}/`,
    city,
    noindex: Boolean(doctor.isPlaceholder),
  })
}

// Короткая роль для title: полная специализация («Врач-терапевт-стоматолог
// (в т.ч. приём детей)») вместе с городом и шаблоном не влезает в 60 знаков.
function shortRole(specialization: string): string {
  const s = specialization.toLowerCase()
  if (s.includes('имплантолог')) return 'хирург-имплантолог'
  if (s.includes('хирург')) return 'стоматолог-хирург'
  if (s.includes('ортопед')) return 'стоматолог-ортопед'
  if (s.includes('ортодонт')) return 'ортодонт'
  if (s.includes('терапевт')) return 'стоматолог-терапевт'
  return 'стоматолог'
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city: citySlug, slug } = await params
  const doctor = getDoctorBySlug(slug)
  const city = getCityBySlug(citySlug)
  if (!doctor || !city) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Главная', path: `/${citySlug}/` },
          { name: 'Врачи', path: `/${citySlug}/vrachi/` },
          { name: doctor.name },
        ])}
      />
      {/* Physician — только для реальных врачей: схему с выдуманным именем
          поисковику отдавать нельзя. */}
      {!doctor.isPlaceholder && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Physician',
            name: doctor.name,
            url: absoluteUrl(`/${citySlug}/vrachi/${slug}/`),
            image: absoluteUrl(doctor.photo),
            jobTitle: doctor.specialization,
            medicalSpecialty: 'Dentistry',
            worksFor: { '@id': `${absoluteUrl(`/${citySlug}/`)}#clinic` },
          }}
        />
      )}
      <DoctorDetailContent slug={slug} />
    </>
  )
}
