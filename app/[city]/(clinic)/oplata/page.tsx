import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ContactCtaSection } from '@/components/home/contact-cta-section'
import { FaqSection } from '@/components/home/faq-section'
import {
  PaymentCredit,
  PaymentHero,
  PaymentInstallment,
  PaymentMethods,
  PaymentRequisites,
} from '@/components/payment/payment-sections'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { JsonLd } from '@/components/seo/json-ld'
import { getCityBySlug } from '@/config/cities'
import { getCityContent } from '@/content'
import { getPaymentContent } from '@/content/payment'
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

// «Оплата, рассрочка и кредит». Есть только у городов с записью в
// content/payment.ts (сейчас — Минск), остальным notFound(), как у медтуризма.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  const content = getPaymentContent(citySlug)
  if (!city || !content) return {}
  return buildMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/${citySlug}/oplata/`,
    city,
    absoluteTitle: true,
  })
}

export default async function PaymentPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  const cityContent = getCityContent(citySlug)
  const content = getPaymentContent(citySlug)
  if (!city || !cityContent || !content) notFound()

  return (
    <div className="bg-(--page-surface)">
      <Reveal delay={0}>
        <PaymentHero city={city} content={content} />
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="lavender" id="sposoby">
          <PaymentMethods content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="sky" id="rassrochka">
          <PaymentInstallment content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="mint" id="kredit">
          <PaymentCredit content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="aqua" id="rekvizity">
          <PaymentRequisites city={city} content={content} />
        </SectionPanel>
      </Reveal>
      <Reveal delay={1}>
        <SectionPanel variant="periwinkle">
          <FaqSection items={content.faq} description="Коротко об оплате, рассрочке и кредите." />
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
          { name: 'Оплата и рассрочка' },
        ])}
      />
    </div>
  )
}
