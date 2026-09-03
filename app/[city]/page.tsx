import { notFound } from 'next/navigation'

import { HeroSplit } from '@/components/home/hero-split'
import { HeroSection } from '@/components/home/hero-section'
import { ServicesOverview } from '@/components/home/services-overview'
import { CalculatorTeaserSection } from '@/components/home/calculator-teaser-section'
import { DoctorsCarouselSection } from '@/components/home/doctors-carousel-section'
import { BeforeAfterTeaserSection } from '@/components/home/before-after-teaser-section'
import { WhyUsSection } from '@/components/home/why-us-section'
import { ClinicGallerySection } from '@/components/home/clinic-gallery-section'
import { ReviewsSection } from '@/components/home/reviews-section'
import { RatingsSection } from '@/components/home/ratings-section'
import { FaqSection } from '@/components/home/faq-section'
import { ContactCtaSection } from '@/components/home/contact-cta-section'
import { TreatmentSteps } from '@/components/home/treatment-steps'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { getCityContent } from '@/content'
import { getDoctorsForCity } from '@/config/doctors'
import { aggregatorRatings } from '@/lib/data/aggregators'
import { formatPromoCountdown } from '@/lib/hero-schedule'
import { siteConfig } from '@/lib/site-config'

// Обратный отсчёт активной акции пересчитывается раз в час.
export const revalidate = 3600

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const content = getCityContent(citySlug)
  if (!content) notFound()

  const rating = aggregatorRatings.find((a) => a.id === '103by')
  const doctorsCount = getDoctorsForCity(citySlug).length

  // Бейдж срочности и таймер — только пока акция реально активна: если
  // hero.promo не задан или дата уже прошла, formatPromoCountdown вернёт
  // undefined и оба элемента в hero-split.tsx просто не отрендерятся.
  const promoCountdown = content.hero.promo
    ? formatPromoCountdown(content.hero.promo.endsAt)
    : undefined

  const stats = [
    {
      value: String(rating?.rating ?? siteConfig.rating),
      label: `рейтинг · ${rating?.reviewsCount ?? siteConfig.reviewsCount} отзывов на ${rating?.name ?? siteConfig.reviewsSource}`,
    },
    { value: String(doctorsCount), label: 'врачей принимают пациентов в клинике' },
    content.guaranteeStat,
    { value: '0%', label: `рассрочка и полис «${siteConfig.insurancePartner}»` },
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
            urgencyBadge={promoCountdown ? content.hero.promo?.badge : undefined}
            countdown={promoCountdown}
            stats={stats}
          />
        ) : (
          <HeroSection />
        )}
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="cool-1">
          <ServicesOverview />
        </SectionPanel>
      </Reveal>
      <Reveal delay={2}>
        <SectionPanel variant="indigo-bold">
          <CalculatorTeaserSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="warm-1">
          <DoctorsCarouselSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="indigo-light" className="overflow-hidden">
          <TreatmentSteps />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="mint-1">
          <BeforeAfterTeaserSection />
        </SectionPanel>
      </Reveal>
      {/* A/B-сравнение (только Минск, временно): второй экземпляр «Примеров
          работ» — тот же блок, но по три карточки в ряд. Оба варианта висят
          на странице намеренно: их показывают людям, впервые видящим сайт,
          чтобы выбрать вариант по живой реакции. Это не забытый мусор — не
          удалять до решения. Когда вариант выберут, снести проигравший, а
          если победят две карточки — заодно убрать проп columns в
          before-after-teaser-section.tsx. */}
      {citySlug === 'minsk' && (
        <Reveal delay={1}>
          <SectionPanel variant="mint-1">
            <BeforeAfterTeaserSection columns={3} />
          </SectionPanel>
        </Reveal>
      )}
      <Reveal delay={1}>
        <SectionPanel variant="rose-1">
          <WhyUsSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="lavender-1">
          <ClinicGallerySection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="cool-1">
          <ReviewsSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="warm-1">
          <RatingsSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="periwinkle">
          <FaqSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={0}>
        <SectionPanel variant="mint-1">
          <ContactCtaSection />
        </SectionPanel>
      </Reveal>
    </div>
  )
}
