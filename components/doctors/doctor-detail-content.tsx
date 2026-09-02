'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Award } from 'lucide-react'

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { useCity } from '@/lib/contexts/city-context'
import { getDoctorBySlug } from '@/config/doctors'
import { DoctorHeroCta, DoctorFinalCta } from '@/components/doctors/doctor-cta'
import { Reveal } from '@/components/reveal'

export function DoctorDetailContent({ slug }: { slug: string }) {
  const { city } = useCity()
  const doctor = getDoctorBySlug(slug)
  if (!doctor) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${city.slug}/`}>Главная</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${city.slug}/vrachi/`}>Врачи</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{doctor.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero */}
      <Reveal delay={0}>
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-silver/25 sm:w-48">
            <Image src={doctor.photo} alt={doctor.name} fill sizes="(max-width: 640px) 160px, 192px" className="object-cover" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {doctor.name}
            </h1>
            <p className="text-lg text-muted-foreground">{doctor.specialization}</p>
            <Badge variant="secondary" className="w-fit">
              Стаж {doctor.experienceYears} лет
            </Badge>
            <DoctorHeroCta slug={doctor.slug} name={doctor.name} />
          </div>
        </div>
      </Reveal>

      {/* Bio */}
      <Reveal delay={1}>
        <div className="mb-16 flex flex-col gap-3">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">О враче</h2>
          <p className="text-pretty leading-relaxed text-foreground">{doctor.bio}</p>
          <p className="text-sm text-muted-foreground">Полную биографию врач добавит дополнительно</p>
        </div>
      </Reveal>

      {/* Directions */}
      <Reveal delay={1}>
        <div className="mb-16 flex flex-col gap-4">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Направления работы</h2>
          <div className="flex flex-wrap gap-3">
            {doctor.directions.map((direction: { label: string; href: string }) => (
              <Link
                key={direction.href}
                href={`/${city.slug}${direction.href}`}
                className="rounded-lg border border-silver/30 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {direction.label}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Certificates - only if hasCertificates */}
      {doctor.hasCertificates && (
        <Reveal delay={1}>
          <div className="mb-16 flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Сертификаты</h2>
            <div className="flex items-center gap-3 rounded-xl border border-silver/30 p-4 text-muted-foreground">
              <Award className="size-5 text-primary" />
              <span>Сертификаты будут добавлены</span>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal delay={2}>
        <DoctorFinalCta slug={doctor.slug} />
      </Reveal>
    </div>
  )
}
