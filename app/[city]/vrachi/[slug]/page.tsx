import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDoctorBySlug, doctors } from '@/config/doctors'
import { DoctorDetailContent } from '@/components/doctors/doctor-detail-content'

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
  const { slug } = await params
  const doctor = getDoctorBySlug(slug)
  if (!doctor) return {}

  return {
    title: doctor.name,
    description: doctor.bio.slice(0, 155),
  }
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { slug } = await params
  const doctor = getDoctorBySlug(slug)
  if (!doctor) notFound()

  return <DoctorDetailContent slug={slug} />
}
