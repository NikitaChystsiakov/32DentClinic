import { notFound } from 'next/navigation'

import { HeroSplit } from '@/components/home/hero-split'
import { HeroSection } from '@/components/home/hero-section'
import { ServicesOverview } from '@/components/home/services-overview'
import { ImplantTypesSection } from '@/components/home/implant-types-section'
import { ImplantologistsSection } from '@/components/home/implantologists-section'
import { GuaranteeSection } from '@/components/home/guarantee-section'
import { CalculatorTeaserSection } from '@/components/home/calculator-teaser-section'
import { DoctorsCarouselSection } from '@/components/home/doctors-carousel-section'
import { BeforeAfterTeaserSection } from '@/components/home/before-after-teaser-section'
import { WhyUsSection } from '@/components/home/why-us-section'
import { ClinicGallerySection } from '@/components/home/clinic-gallery-section'
import { ClinicVideoSection } from '@/components/home/clinic-video-section'
import { ReviewsSection } from '@/components/home/reviews-section'
import { RatingsSection } from '@/components/home/ratings-section'
import { FaqSection } from '@/components/home/faq-section'
import { ContactCtaSection } from '@/components/home/contact-cta-section'
import { TreatmentSteps } from '@/components/home/treatment-steps'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { TownLanding } from '@/components/town/town-landing'
import { getCityContent } from '@/content'
import { getTownContent } from '@/content/towns'
import { getDoctorsForCity, getImplantologistsForCity } from '@/config/doctors'
import { getNearbyTownBySlug } from '@/config/nearby-towns'
import { aggregatorRatings } from '@/lib/data/aggregators'
import { siteConfig } from '@/lib/site-config'

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params

  // «Соседний» город без клиники (config/nearby-towns.ts): вместо главной
  // клиники — посадочная страница, которая ведёт в ближайшие клиники сети.
  const town = getNearbyTownBySlug(citySlug)
  if (town) {
    const townContent = getTownContent(citySlug)
    if (!townContent) notFound()
    return <TownLanding town={town} content={townContent} />
  }

  const content = getCityContent(citySlug)
  if (!content) notFound()

  const rating = aggregatorRatings.find((a) => a.id === '103by')
  const doctorsCount = getDoctorsForCity(citySlug).length
  const hasImplantologists = getImplantologistsForCity(citySlug).length > 0

  const stats = [
    {
      value: String(rating?.rating ?? siteConfig.rating),
      label: `рейтинг · ${rating?.reviewsCount ?? siteConfig.reviewsCount} отзывов на ${rating?.name ?? siteConfig.reviewsSource}`,
    },
    { value: String(doctorsCount), label: 'врачей принимают пациентов в клинике' },
    content.guaranteeStat,
  ]

  // Минск обкатывает новый широкий HeroSplit; Рогачёв и Жлобин пока
  // остаются на прежней hero-секции с фото клиники на фоне.
  const useSplitHero = citySlug === 'minsk'

  return (
    <div className="bg-(--page-surface)">
      <Reveal delay={0}>
        {useSplitHero ? (
          <HeroSplit
            tags={content.hero.tags}
            title={content.hero.title}
            highlights={content.hero.highlights}
            badge={content.hero.badge}
            offers={content.hero.offers}
            photo={content.hero.photo}
            video={content.hero.video}
            promo={content.hero.promo}
            stats={stats}
          />
        ) : (
          <HeroSection />
        )}
      </Reveal>
      {/* Видеообзор клиники — вторым экраном, сразу под hero: заказчик
          прислал ролики для главной, и выше их ставить некуда (hero занят
          предложением месяца). На страницу попадает только постер, сам
          ролик грузится по клику — первый экран от него не тяжелеет.
          Городам без ролика (Рогачёв) панель не рендерим вовсе. */}
      {content.clinicVideo && (
        <Reveal delay={1}>
          <SectionPanel variant="ice">
            <ClinicVideoSection />
          </SectionPanel>
        </Reveal>
      )}
      {/* Порядок блоков — под имплантацию как главное направление: сразу
          после hero (и видео) человек видит виды имплантации и цены, затем
          врача, который её делает, этапы, кейсы и гарантию. Остальные
          услуги — ниже, компактным блоком «Также лечим». */}
      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <ImplantTypesSection />
        </SectionPanel>
      </Reveal>
      {/* Блок сам не рендерится, если в городе нет реального имплантолога —
          тогда пустая панель тоже не нужна. */}
      {hasImplantologists && (
        <Reveal delay={1}>
          <SectionPanel variant="sky">
            <ImplantologistsSection limit={2} />
          </SectionPanel>
        </Reveal>
      )}
      <Reveal delay={1}>
        <SectionPanel variant="indigo-light" className="overflow-hidden">
          <TreatmentSteps />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="mint">
          <BeforeAfterTeaserSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="dark">
          <GuaranteeSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <ServicesOverview />
        </SectionPanel>
      </Reveal>
      <Reveal delay={2}>
        <SectionPanel variant="indigo-bold">
          <CalculatorTeaserSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="sky">
          <DoctorsCarouselSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="aqua">
          <WhyUsSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="ice">
          <ClinicGallerySection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <ReviewsSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="sky">
          <RatingsSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="periwinkle">
          <FaqSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={0}>
        <SectionPanel variant="mint">
          <ContactCtaSection />
        </SectionPanel>
      </Reveal>
    </div>
  )
}
