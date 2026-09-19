'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, CircleDashed, Plus } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { BookingButton } from '@/components/booking-button'
import { PhotoPlaceholder } from '@/components/photo-placeholder'
import { Reveal } from '@/components/reveal'
import { ServiceFaqSection } from '@/components/services/service-faq-section'
import { ServiceFinalCta } from '@/components/services/service-final-cta'
import { ProtocolCard } from '@/components/implantation/protocol-card'
import { ImplantologistsSection } from '@/components/home/implantologists-section'
import {
  getProtocolBySlug,
  getProtocolPricing,
  getProtocolsForCity,
  implantationFaq,
  type IncludedStatus,
} from '@/config/implantation'
import { useCity } from '@/lib/contexts/city-context'
import { siteConfig } from '@/lib/site-config'

// Статус позиции в таблице «Что входит»: tbd — клиника ещё не подтвердила,
// показываем честное «уточняется», а не выдуманное «входит».
const INCLUDED_LABELS: Record<IncludedStatus, { label: string; icon: typeof Check; className: string }> = {
  included: { label: 'входит', icon: Check, className: 'bg-(--panel-mint) text-secondary' },
  extra: { label: 'отдельно', icon: Plus, className: 'bg-(--panel-lavender) text-primary' },
  tbd: { label: 'уточняется', icon: CircleDashed, className: 'bg-muted text-muted-foreground' },
}

export function ProtocolContent({ slug }: { slug: string }) {
  const { city } = useCity()
  const protocol = getProtocolBySlug(slug)
  if (!protocol) return null

  const pricing = getProtocolPricing(protocol, city.slug)
  const others = getProtocolsForCity(city.slug).filter((p) => p.slug !== protocol.slug)
  // Свои вопросы протокола — первыми, затем общие по имплантации без повторов.
  const faq = [
    ...protocol.faq,
    ...implantationFaq.filter((item) => !protocol.faq.some((own) => own.question === item.question)),
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
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
            <BreadcrumbLink render={<Link href={`/${city.slug}/uslugi/implantaciya/`}>Имплантация</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{protocol.shortName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero */}
      <Reveal delay={0}>
        {/* Иллюстрация — в узкой колонке справа (2/5) и прижата к верху:
            на половину экрана она была слишком крупной и висела посреди
            высокого текстового блока с ценой. */}
        <div className="mb-16 grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-start">
          <div className="flex flex-col gap-5">
            <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {protocol.title} в {city.nameIn}
            </h1>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">{protocol.intro}</p>

            {pricing && (
              <div className="flex flex-col gap-1 rounded-2xl bg-(--panel-lavender) p-5">
                <span className="text-sm font-medium text-muted-foreground">Стоимость в {city.nameIn}</span>
                <span className="font-heading text-3xl font-bold text-foreground">
                  {pricing.from === null ? 'Индивидуально' : `от ${pricing.from.toLocaleString('ru-RU')} BYN`}
                </span>
                <span className="text-sm text-muted-foreground">{pricing.note}</span>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <BookingButton
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                options={{ service: 'implantaciya' }}
              >
                Записаться на консультацию
              </BookingButton>
            </div>
            <p className="text-xs text-muted-foreground">{siteConfig.priceNotice}</p>
          </div>

          <div className="relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-2xl ring-1 ring-foreground/10 md:mx-0 md:ml-auto md:mt-14">
            {protocol.image ? (
              <Image src={protocol.image} alt={protocol.title} fill className="object-cover" />
            ) : (
              <PhotoPlaceholder
                label={protocol.imageHint}
                width={1600}
                height={1200}
                className="h-full rounded-none border-0"
              />
            )}
          </div>
        </div>
      </Reveal>

      {/* Кому подходит + что входит */}
      <Reveal delay={1}>
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Кому подходит</h2>
            <ul className="flex flex-col gap-3">
              {protocol.forWhom.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="mt-1 size-4 shrink-0 text-secondary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Что входит в стоимость</h2>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-card ring-1 ring-primary/10">
              {protocol.included.map((item) => {
                const status = INCLUDED_LABELS[item.status]
                return (
                  <li key={item.name} className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                    >
                      <status.icon className="size-3.5" />
                      {status.label}
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="text-xs text-muted-foreground">
              Позиции «отдельно» врач включает в план, только если они нужны в вашем случае — это видно на 3D-снимке.
            </p>
          </section>
        </div>
      </Reveal>

      {/* Этапы и сроки */}
      <Reveal delay={1}>
        <section className="mb-16 flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Этапы и сроки</h2>
            <span className="text-sm font-medium text-primary">{protocol.durationSummary}</span>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {protocol.steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-2 rounded-2xl bg-card p-5 ring-1 ring-primary/10">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">{step.duration}</span>
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal delay={1}>
        <section className="mb-16">
          <ImplantologistsSection city={city} />
        </section>
      </Reveal>

      <Reveal delay={1}>
        <section className="mb-16">
          <ServiceFaqSection faq={faq} />
        </section>
      </Reveal>

      {others.length > 0 && (
        <Reveal delay={1}>
          <section className="mb-16 flex flex-col gap-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Другие виды имплантации</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <ProtocolCard key={other.slug} protocol={other} citySlug={city.slug} />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      <ServiceFinalCta slug="implantaciya" />
    </div>
  )
}
