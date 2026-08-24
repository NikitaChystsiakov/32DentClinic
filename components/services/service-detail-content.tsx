'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ShieldCheck } from 'lucide-react'

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { getServiceBySlug } from '@/config/services'
import { getDoctorBySlug } from '@/config/doctors'
import { useCity } from '@/lib/contexts/city-context'
import { ServiceHeroCta } from '@/components/services/service-hero-cta'
import { ProcedureTable } from '@/components/services/procedure-table'
import { ServiceFaqSection } from '@/components/services/service-faq-section'
import { ServiceFinalCta } from '@/components/services/service-final-cta'
import { Reveal } from '@/components/reveal'

export function ServiceDetailContent({ slug }: { slug: string }) {
  const { city } = useCity()
  const service = getServiceBySlug(slug)
  if (!service) return null

  const doctors = service.doctorSlugs
    .map((doctorSlug) => getDoctorBySlug(doctorSlug))
    .filter((doctor): doctor is NonNullable<typeof doctor> => Boolean(doctor))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${city.slug}/`}>Главная</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${city.slug}/uslugi/`}>Услуги</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{service.shortName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero */}
      <Reveal delay={0}>
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-5">
            <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {service.title}
            </h1>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">{service.intro}</p>
            <ServiceHeroCta slug={service.slug} />
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl ring-1 ring-foreground/10">
            <Image src={service.image} alt={service.title} fill className="object-cover" />
          </div>
        </div>
      </Reveal>

      {/* Procedures */}
      <Reveal delay={1}>
        <div className="mb-16 flex flex-col gap-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Процедуры и цены</h2>
          <ProcedureTable slug={service.slug} procedures={service.procedures} />
        </div>
      </Reveal>

      {/* When to visit */}
      <Reveal delay={1}>
        <div className="mb-16 flex flex-col gap-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Когда стоит обратиться</h2>
          <ul className="flex flex-col gap-3">
            {service.whenToVisit.map((item) => (
              <li key={item} className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-secondary" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Steps */}
      {service.steps.length > 0 && (
        <Reveal delay={1}>
          <div className="mb-16 flex flex-col gap-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Как проходит приём</h2>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.steps.map((step, index) => (
                <li key={step} className="flex flex-col gap-2 rounded-xl border border-border p-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      )}

      {/* Doctors */}
      <Reveal delay={1}>
        <div className="mb-16 flex flex-col gap-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Врачи направления</h2>
          {doctors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <Link
                  key={doctor.slug}
                  href={`/${city.slug}/vrachi/${doctor.slug}/`}
                  className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:ring-1 hover:ring-primary/40"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={doctor.photo} alt={doctor.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-heading text-sm font-semibold text-foreground">{doctor.name}</span>
                    <span className="text-xs text-muted-foreground">{doctor.specialization}</span>
                    <span className="text-xs font-medium text-primary">Стаж {doctor.experienceYears} лет</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Информация уточняется</p>
          )}
        </div>
      </Reveal>

      {/* Guarantee */}
      <Reveal delay={1}>
        <div className="mb-16 flex items-center gap-4 rounded-xl bg-secondary/10 p-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <p className="font-heading text-base font-semibold text-foreground">
            Гарантия 2 года на все виды работ
          </p>
        </div>
      </Reveal>

      {/* FAQ */}
      {service.faq.length > 0 && (
        <Reveal delay={1}>
          <div className="mb-16">
            <ServiceFaqSection faq={service.faq} />
          </div>
        </Reveal>
      )}

      <ServiceFinalCta slug={service.slug} />
    </div>
  )
}
