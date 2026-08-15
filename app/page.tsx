import { HeroSection } from '@/components/home/hero-section'
import { ServicesOverview } from '@/components/home/services-overview'
import { CalculatorTeaserSection } from '@/components/home/calculator-teaser-section'
import { DoctorsCarouselSection } from '@/components/home/doctors-carousel-section'
import { BeforeAfterTeaserSection } from '@/components/home/before-after-teaser-section'
import { WhyUsSection } from '@/components/home/why-us-section'
import { ReviewsSection } from '@/components/home/reviews-section'
import { ContactCtaSection } from '@/components/home/contact-cta-section'

export default function Page() {
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <CalculatorTeaserSection />
      <DoctorsCarouselSection />
      <BeforeAfterTeaserSection />
      <WhyUsSection />
      <ReviewsSection />
      <ContactCtaSection />
    </>
  )
}
