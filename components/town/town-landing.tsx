import { BeforeAfterTeaserSection } from '@/components/home/before-after-teaser-section'
import { ContactCtaSection } from '@/components/home/contact-cta-section'
import { DoctorsCarouselSection } from '@/components/home/doctors-carousel-section'
import { FaqSection } from '@/components/home/faq-section'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { JsonLd } from '@/components/seo/json-ld'
import { TownFeaturedServices } from '@/components/town/town-featured-services'
import { TownHero } from '@/components/town/town-hero'
import { TownIntro } from '@/components/town/town-intro'
import { TownReasons } from '@/components/town/town-reasons'
import { TownRoute } from '@/components/town/town-route'
import { TownTripPlan } from '@/components/town/town-trip-plan'
import { getPrimaryClinicSlug, type NearbyTown } from '@/config/nearby-towns'
import { getCityContent } from '@/content'
import type { TownContent } from '@/content/towns'
import { breadcrumbJsonLd, clinicJsonLd } from '@/lib/seo'
import { getClinicForService, getTownClinics } from '@/lib/town-clinics'

/*
 * Посадочная страница «соседнего» города (см. config/nearby-towns.ts).
 * Своё здесь — hero, «где принимаем», услуги, причины, план поездки, дорога
 * и FAQ; врачи, примеры работ и контактный блок переиспользуются с главной
 * клиники. В CityProvider на этой странице — основная клиника города,
 * поэтому ContactCtaSection и форма записи показывают её адрес и телефон.
 *
 * Структурированные данные: BreadcrumbList (хаб → город) и Dentist для
 * каждой клиники, куда ведёт страница. Схему основной клиники уже выводит
 * app/[city]/layout.tsx, здесь — остальные, чтобы у поисковика были адрес,
 * телефон и часы всех клиник, названных на странице. FAQPage добавляет сам
 * FaqSection — второй раз её выводить нельзя, дубль схемы Google считает
 * ошибкой разметки.
 */
export function TownLanding({ town, content }: { town: NearbyTown; content: TownContent }) {
  // Врачей показываем из той клиники, где делают главную услугу страницы
  // (первую в featuredServices) — как правило, это и есть основная клиника.
  const leadService = content.featuredServices.items[0]
  const primaryClinicSlug = getPrimaryClinicSlug(town)
  const doctorsCitySlug = (leadService && getClinicForService(town, leadService.slug)?.slug) ?? primaryClinicSlug

  const secondaryClinicSchemas = getTownClinics(town)
    .filter((clinic) => clinic.slug !== primaryClinicSlug)
    .flatMap((clinic) => {
      const cityContent = getCityContent(clinic.slug)
      return cityContent ? [clinicJsonLd(clinic.city, cityContent.contacts.hours)] : []
    })

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
      {/* План «за один день» — перед маршрутом: сначала человек видит, что
          поездка реальна без ночёвки, потом — как именно ехать. Секции нет,
          если в content.tripPlan пусто. */}
      {content.tripPlan && (
        <Reveal delay={1}>
          <SectionPanel variant="mint">
            <TownTripPlan content={content} />
          </SectionPanel>
        </Reveal>
      )}
      <Reveal delay={1}>
        <SectionPanel variant={content.tripPlan ? 'lavender' : 'mint'}>
          <TownRoute town={town} content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="sky">
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

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Сеть стоматологий 32Дент', path: '/' },
          { name: `Пациентам из ${town.nameFrom}` },
        ])}
      />
      {secondaryClinicSchemas.map((schema) => (
        <JsonLd key={schema['@id']} data={schema} />
      ))}
    </div>
  )
}
