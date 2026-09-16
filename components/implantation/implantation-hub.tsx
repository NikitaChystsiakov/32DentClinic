'use client'

import Link from 'next/link'
import { ArrowRight, Calculator } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { FaqSection } from '@/components/home/faq-section'
import { TreatmentSteps } from '@/components/home/treatment-steps'
import { ImplantologistsSection } from '@/components/home/implantologists-section'
import { ContactCtaSection } from '@/components/home/contact-cta-section'
import { ProcedureTable } from '@/components/services/procedure-table'
import { ProtocolCard, formatProtocolPrice } from '@/components/implantation/protocol-card'
import {
  getProtocolsForCity,
  implantBrands,
  implantationFaq,
  implantationTimeline,
} from '@/config/implantation'
import { getImplantologistsForCity } from '@/config/doctors'
import { getServiceBySlug } from '@/config/services'
import { useCity } from '@/lib/contexts/city-context'
import { siteConfig } from '@/lib/site-config'

/**
 * Хаб раздела «Имплантация» — /<город>/uslugi/implantaciya/. Заменяет
 * общий шаблон услуги: у главного направления сети должны быть протоколы,
 * этапы, прайс, врачи и развёрнутый FAQ, а не две строки прайса.
 *
 * Секции собраны из тех же панелей, что и главная (SectionPanel + секции
 * из components/home), чтобы раздел читался как продолжение главной, а не
 * как отдельный шаблон: этапы — та же лента с врачами, FAQ — те же «пузыри».
 */
export function ImplantationHub() {
  const { city, content } = useCity()
  const protocols = getProtocolsForCity(city.slug)
  const single = protocols.find((p) => p.slug === 'odinochnyj-implant')
  const singlePrice = single ? formatProtocolPrice(single, city.slug) : null
  // Прайс раздела — те же строки, что в /ceny/ (config/services.ts).
  const priceList = getServiceBySlug('implantaciya')?.procedures ?? []
  const hasImplantologists = getImplantologistsForCity(city.slug).length > 0
  // В hero перечисляем только системы с ценой в прайсе (MegaGen — уточняется).
  const brandNames = implantBrands
    .filter((b) => b.name !== 'MegaGen')
    .map((b) => b.name)
    .join(', ')

  const stats = [
    content.guaranteeStat,
    { value: 'Straumann · MIS', label: 'системы имплантов' },
    ...(singlePrice ? [{ value: singlePrice, label: 'имплантат с установкой' }] : []),
  ]

  return (
    <div className="bg-(--page-surface)">
      {/* Hero — без панели, как шапка страницы услуги */}
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-4 sm:px-6 lg:px-8">
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
              <BreadcrumbPage>Имплантация</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Reveal delay={0}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
            <div className="flex flex-col gap-5">
              <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
                Главное направление клиники
              </span>
              <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Имплантация зубов в {city.nameIn}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                От одного импланта до восстановления всей челюсти по протоколам All-on-4 и All-on-6.
                Планируем по 3D-снимку, ставим импланты {brandNames}, стоимость называем до начала
                лечения.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <BookingButton
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  options={{ service: 'implantaciya' }}
                >
                  Записаться на консультацию
                </BookingButton>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href={`/${city.slug}/kalkulyator/`} />}
                  nativeButton={false}
                >
                  <Calculator data-icon="inline-start" />
                  Рассчитать стоимость
                </Button>
              </div>
            </div>

            {/* На телефоне — три компактные плитки в ряд, а не три полосы
                во всю ширину: иначе шапка растягивалась на лишний экран. */}
            <dl className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-(--panel-lavender) p-3 sm:p-5">
                  <dt className="font-heading text-base leading-tight font-bold text-balance text-foreground sm:text-2xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>

      {/* Протоколы */}
      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <div className="mb-8 flex flex-col gap-2">
            <span className="text-sm font-medium text-(--panel-eyebrow)">Протоколы</span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">Виды имплантации</h2>
            <p className="max-w-2xl text-pretty text-(--panel-body)">
              Какой протокол подойдёт, зависит от количества отсутствующих зубов и объёма кости — это видно
              на 3D-снимке. Ниже — что делаем в {city.nameIn} и от какой цены.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {protocols.map((protocol) => (
              <ProtocolCard key={protocol.slug} protocol={protocol} citySlug={city.slug} compact />
            ))}
          </div>
        </SectionPanel>
      </Reveal>

      {/* Этапы — та же секция, что на главной, с содержанием под имплантацию */}
      <Reveal delay={1}>
        <SectionPanel variant="indigo-light" className="overflow-hidden">
          <TreatmentSteps
            timeline={implantationTimeline}
            title="Этапы имплантации"
            description="От консультации до постоянной коронки — что происходит на каждом визите и сколько это занимает."
          />
        </SectionPanel>
      </Reveal>

      {/* Прайс раздела */}
      {priceList.length > 0 && (
        <Reveal delay={1}>
          <SectionPanel variant="sky">
            <div className="mb-6 flex flex-col gap-2">
              <span className="text-sm font-medium text-(--panel-eyebrow)">Прайс</span>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">Цены на имплантацию</h2>
              <p className="max-w-2xl text-pretty text-(--panel-body)">
                Позиции по этапам: имплантат с установкой, формирователь десны, синус-лифтинг, комплексные
                протоколы All-on-4 и All-on-6. Коронки на имплантах — в разделе{' '}
                <Link href={`/${city.slug}/uslugi/protezirovanie/`} className="font-medium text-primary hover:underline">
                  «Протезирование»
                </Link>
                .
              </p>
            </div>
            <div className="rounded-2xl bg-card p-2 ring-1 ring-primary/10 sm:p-4">
              <ProcedureTable slug="implantaciya" procedures={priceList} />
            </div>
            <p className="mt-4 text-xs text-(--panel-body)">{siteConfig.priceNotice}</p>
          </SectionPanel>
        </Reveal>
      )}

      {/* Врачи — блок сам скрывается, если реального имплантолога в городе ещё нет */}
      {hasImplantologists && (
        <Reveal delay={1}>
          <SectionPanel variant="mint">
            <ImplantologistsSection />
          </SectionPanel>
        </Reveal>
      )}

      {/* FAQ — те же «пузыри», что на главной */}
      <Reveal delay={1}>
        <SectionPanel variant="periwinkle">
          <FaqSection
            items={implantationFaq}
            description="Что чаще всего спрашивают про импланты: системы, цены, сроки, противопоказания и уход."
          />
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-lg font-bold text-foreground">Полный прайс клиники</h2>
              <p className="text-sm text-muted-foreground">
                Коронки на имплантах, удаление, диагностика и остальные направления в {city.nameIn}.
              </p>
            </div>
            <Button variant="outline" render={<Link href={`/${city.slug}/ceny/`} />} nativeButton={false}>
              Смотреть прайс
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
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
