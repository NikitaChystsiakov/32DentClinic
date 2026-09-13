import { BeforeAfterTeaserSection } from '@/components/home/before-after-teaser-section'
import { ContactCtaSection } from '@/components/home/contact-cta-section'
import { DoctorsCarouselSection } from '@/components/home/doctors-carousel-section'
import { FaqSection } from '@/components/home/faq-section'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { TownFeaturedServices } from '@/components/town/town-featured-services'
import { TownHero } from '@/components/town/town-hero'
import { TownIntro } from '@/components/town/town-intro'
import { TownReasons } from '@/components/town/town-reasons'
import { TownRoute } from '@/components/town/town-route'
import { getPrimaryClinicSlug, type NearbyTown } from '@/config/nearby-towns'
import type { TownContent } from '@/content/towns'
import { getClinicForService } from '@/lib/town-clinics'

/*
 * Посадочная страница «соседнего» города (см. config/nearby-towns.ts).
 * Своё здесь — hero, «где принимаем», услуги, причины, дорога и FAQ; врачи,
 * примеры работ и контактный блок переиспользуются с главной клиники.
 * В CityProvider на этой странице — основная клиника города, поэтому
 * ContactCtaSection и форма записи показывают её адрес и телефон.
 */
export function TownLanding({ town, content }: { town: NearbyTown; content: TownContent }) {
  // Врачей показываем из той клиники, где делают главную услугу страницы
  // (первую в featuredServices): для Светлогорска это имплантация в Рогачёве,
  // а не два врача ближайшего Жлобина.
  const leadService = content.featuredServices.items[0]
  const doctorsCitySlug =
    (leadService && getClinicForService(town, leadService.slug)?.slug) ?? getPrimaryClinicSlug(town)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <div className="bg-(--page-surface)">
      <Reveal delay={0}>
        <TownHero town={town} content={content} />
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <TownIntro town={town} content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="sky">
          <TownFeaturedServices town={town} content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="aqua">
          <TownReasons content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="ice">
          <DoctorsCarouselSection citySlug={doctorsCitySlug} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="mint">
          <TownRoute town={town} content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <BeforeAfterTeaserSection />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="periwinkle">
          <FaqSection items={content.faq.items} description={content.faq.subtitle} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={0}>
        <SectionPanel variant="mint">
          <ContactCtaSection />
        </SectionPanel>
      </Reveal>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
    </div>
  )
}
