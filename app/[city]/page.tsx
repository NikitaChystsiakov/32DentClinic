import { HeroSection } from '@/components/home/hero-section'
import { ServicesOverview } from '@/components/home/services-overview'
import { CalculatorTeaserSection } from '@/components/home/calculator-teaser-section'
import { DoctorsCarouselSection } from '@/components/home/doctors-carousel-section'
import { BeforeAfterTeaserSection } from '@/components/home/before-after-teaser-section'
import { WhyUsSection } from '@/components/home/why-us-section'
import { ReviewsSection } from '@/components/home/reviews-section'
import { RatingsSection } from '@/components/home/ratings-section'
import { FaqSection } from '@/components/home/faq-section'
import { ContactCtaSection } from '@/components/home/contact-cta-section'
import { TreatmentSteps } from '@/components/home/treatment-steps'
import { Reveal } from '@/components/reveal'

export default function CityPage() {
  return (
    <>
      <Reveal delay={0}>
        <HeroSection />
      </Reveal>
      <Reveal delay={1}>
        <ServicesOverview />
      </Reveal>
      <Reveal delay={2}>
        <CalculatorTeaserSection />
      </Reveal>
      <Reveal delay={1}>
        <DoctorsCarouselSection />
      </Reveal>
      <Reveal delay={1}>
        <TreatmentSteps />
      </Reveal>
      <Reveal delay={1}>
        <BeforeAfterTeaserSection />
      </Reveal>
      <Reveal delay={1}>
        <WhyUsSection />
      </Reveal>
      <Reveal delay={1}>
        <ReviewsSection />
      </Reveal>
      <Reveal delay={1}>
        <RatingsSection />
      </Reveal>
      <Reveal delay={1}>
        <FaqSection />
      </Reveal>
      <Reveal delay={0}>
        <ContactCtaSection />
      </Reveal>
    </>
  )
}
