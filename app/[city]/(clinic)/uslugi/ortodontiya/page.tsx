import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContactCtaSection } from '@/components/home/contact-cta-section'
import { FaqSection } from '@/components/home/faq-section'
import { MedTourismHeading } from '@/components/medtourism/medtourism-heading'
import {
  OrthoAligners,
  OrthoBracesSection,
  OrthoHero,
  OrthoPaymentBanner,
} from '@/components/orthodontics/orthodontics-sections'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { JsonLd } from '@/components/seo/json-ld'
import { ProcedureTable } from '@/components/services/procedure-table'
import { getCityBySlug } from '@/config/cities'
import { formatYears, getDoctorBySlug } from '@/config/doctors'
import { getServiceBySlug, proceduresForCity } from '@/config/services'
import { getCityContent } from '@/content'
import { orthodontics } from '@/content/orthodontics'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site-config'

// Отдельная страница ортодонтии вместо общего шаблона uslugi/[slug]: со
// статическим сегментом она перекрывает [slug], как и uslugi/implantaciya/.
// Есть только у городов, где ортодонтия в availableIn (сейчас — Минск).
function isAvailable(citySlug: string) {
  return getServiceBySlug('ortodontiya')?.availableIn.includes(citySlug) ?? false
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city || !isAvailable(citySlug)) return {}
  return buildMetadata({
    title: orthodontics.metaTitle,
    description: orthodontics.metaDescription,
    path: `/${citySlug}/uslugi/ortodontiya/`,
    city,
    absoluteTitle: true,
  })
}

export default async function OrthodonticsPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  const cityContent = getCityContent(citySlug)
  const service = getServiceBySlug('ortodontiya')
  if (!city || !cityContent || !service || !isAvailable(citySlug)) notFound()

  const doctors = service.doctorSlugs
    .map((slug) => getDoctorBySlug(slug))
    .filter((doctor): doctor is NonNullable<typeof doctor> => Boolean(doctor))
    .filter((doctor) => doctor.cities.includes(citySlug))

  return (
    <div className="bg-(--page-surface)">
      <Reveal delay={0}>
        <OrthoHero city={city} />
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <OrthoAligners />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="sky">
          <OrthoBracesSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <div className="px-3 py-2 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <OrthoPaymentBanner city={city} />
          </div>
        </div>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="mint">
          <MedTourismHeading
            eyebrow="Как проходит лечение"
            title="От консультации до ровной улыбки"
            subtitle="Стоимость всего лечения вы знаете до его начала — она записывается в план."
          />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.steps.map((step, index) => (
              <li key={step} className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-border">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed font-medium text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </SectionPanel>
      </Reveal>
      {doctors.length > 0 && (
        <Reveal delay={1}>
          <SectionPanel variant="aqua">
            <MedTourismHeading eyebrow="Врач" title="Кто вас будет лечить" />
            <div className="grid gap-4 md:grid-cols-2">
              {doctors.map((doctor) => (
                <Link
                  key={doctor.slug}
                  href={`/${citySlug}/vrachi/${doctor.slug}/`}
                  className="group flex items-center gap-5 rounded-2xl bg-card p-5 ring-1 ring-border transition-shadow hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl">
                    <Image src={doctor.photo} alt={doctor.name} fill sizes="96px" className="object-cover object-top" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-heading text-lg font-semibold text-foreground">{doctor.name}</span>
                    <span className="text-sm text-muted-foreground">{doctor.specialization}</span>
                    {doctor.experienceYears !== undefined && (
                      <span className="text-sm font-medium text-primary">Стаж {formatYears(doctor.experienceYears)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </SectionPanel>
        </Reveal>
      )}
      <Reveal delay={1}>
        <SectionPanel variant="neutral" id="ceny">
          <MedTourismHeading
            eyebrow="Прайс"
            title="Цены на ортодонтию"
            subtitle="Точную стоимость ортодонт называет после диагностики — она зависит от сложности случая и выбранной системы."
          />
          <ProcedureTable slug="ortodontiya" procedures={proceduresForCity(service.procedures, citySlug)} />
          <p className="mt-6 text-sm text-muted-foreground">{siteConfig.priceNotice}</p>
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="periwinkle">
          <FaqSection items={orthodontics.faq} description="Коротко о брекетах, элайнерах и стоимости лечения." />
        </SectionPanel>
      </Reveal>
      <Reveal delay={0}>
        <SectionPanel variant="mint">
          <ContactCtaSection city={city} content={cityContent} />
        </SectionPanel>
      </Reveal>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Главная', path: `/${citySlug}/` },
          { name: 'Услуги', path: `/${citySlug}/uslugi/` },
          { name: service.shortName },
        ])}
      />
    </div>
  )
}
