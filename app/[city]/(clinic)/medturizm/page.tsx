import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BeforeAfterTeaserSection } from '@/components/home/before-after-teaser-section'
import { ContactCtaSection } from '@/components/home/contact-cta-section'
import { FaqSection } from '@/components/home/faq-section'
import { ImplantologistsSection } from '@/components/home/implantologists-section'
import { MedTourismCards } from '@/components/medtourism/medtourism-cards'
import { MedTourismHero } from '@/components/medtourism/medtourism-hero'
import { MedTourismPrices } from '@/components/medtourism/medtourism-prices'
import { MedTourismRequest } from '@/components/medtourism/medtourism-request'
import { MedTourismSteps } from '@/components/medtourism/medtourism-steps'
import { MedTourismTrips } from '@/components/medtourism/medtourism-trips'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { JsonLd } from '@/components/seo/json-ld'
import { getCityBySlug } from '@/config/cities'
import { getImplantologistsForCity } from '@/config/doctors'
import { getCityContent } from '@/content'
import { getMedTourismContent, MEDTOURISM_DRAFT } from '@/content/medtourism'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

// Страница для пациентов из России. Есть только у городов с записью в
// content/medtourism.ts (сейчас — Минск), остальным notFound(), как у
// «Гарантий». Пока MEDTOURISM_DRAFT — noindex и нет в sitemap.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  const content = getMedTourismContent(citySlug)
  if (!city || !content) return {}
  return buildMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/${citySlug}/medturizm/`,
    city,
    absoluteTitle: true,
    noindex: MEDTOURISM_DRAFT,
  })
}

export default async function MedTourismPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  const cityContent = getCityContent(citySlug)
  const content = getMedTourismContent(citySlug)
  if (!city || !cityContent || !content) notFound()

  const hasImplantologists = getImplantologistsForCity(citySlug).length > 0

  // Порядок: цена и сроки → почему нам можно доверять (причины, врачи,
  // гарантия) → форма со снимком → практическое (дорога, жильё) → FAQ.
  // Форма стоит в середине, а не в конце: на неё ведёт и кнопка hero.
  return (
    <div className="bg-(--page-surface)">
      <Reveal delay={0}>
        <MedTourismHero city={city} content={content} />
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <MedTourismSteps content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="sky">
          <div id="ceny" className="scroll-mt-24">
            <MedTourismPrices content={content} />
          </div>
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="mint">
          <MedTourismTrips content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="aqua">
          <MedTourismCards eyebrow="Почему к нам" {...content.reasons} />
        </SectionPanel>
      </Reveal>
      {hasImplantologists && (
        <Reveal delay={1}>
          <SectionPanel variant="sky">
            <ImplantologistsSection city={city} limit={2} />
          </SectionPanel>
        </Reveal>
      )}
      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <MedTourismCards eyebrow="Гарантия" {...content.guarantee} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="ice">
          <MedTourismRequest city={city} content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="mint">
          <MedTourismCards eyebrow="Дорога" {...content.travel} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="aqua">
          <MedTourismCards eyebrow="На месте" {...content.stay} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="sky">
          <BeforeAfterTeaserSection city={city} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="periwinkle">
          <FaqSection items={content.faq.items} description={content.faq.subtitle} />
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
          { name: content.hero.eyebrow },
        ])}
      />
    </div>
  )
}
