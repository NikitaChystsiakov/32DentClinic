import Image from 'next/image'
import {
  ArrowUpRight,
  Banknote,
  CalendarClock,
  CreditCard,
  FileText,
  Landmark,
  ShieldCheck,
  Sparkles,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import { MedTourismHeading } from '@/components/medtourism/medtourism-heading'
import type { City } from '@/config/cities'
import type { PaymentContent } from '@/content/payment'

/*
 * Секции страницы «Оплата, рассрочка и кредит». Все серверные: интерактивных
 * частей нет, кроме кнопки записи (она клиентский островок сама по себе).
 * Заголовки секций — общий MedTourismHeading: тот же ритм и цвета панели.
 */

const iconMap: Record<string, LucideIcon> = { Banknote, CalendarClock, CreditCard, FileText, Landmark }

export function PaymentHero({ city, content }: { city: City; content: PaymentContent }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <Image src={city.photos.hero} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/45" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-background/70 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-silver/25 backdrop-blur">
            <Wallet className="size-4 text-secondary" />
            <span>
              {content.hero.eyebrow} · {city.brandName} {city.name}
            </span>
          </div>
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">{content.hero.subtitle}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              render={<a href="#rassrochka" />}
              nativeButton={false}
            >
              <CalendarClock data-icon="inline-start" />
              Карты рассрочки
            </Button>
            <Button size="lg" variant="outline" render={<a href="#kredit" />} nativeButton={false}>
              <Landmark data-icon="inline-start" />
              Кредит на лечение
            </Button>
          </div>
        </div>

        <div className="flex max-w-3xl flex-wrap items-center gap-x-8 gap-y-4 border-t border-silver/25 pt-6">
          {content.hero.facts.map((fact, index) => (
            <div key={fact.label} className="contents">
              {index > 0 && <div aria-hidden className="hidden h-9 w-px bg-silver/30 sm:block" />}
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl font-bold whitespace-nowrap text-foreground">{fact.value}</span>
                <span className="max-w-36 text-xs leading-tight text-muted-foreground">{fact.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PaymentMethods({ content }: { content: PaymentContent }) {
  return (
    <>
      <MedTourismHeading
        eyebrow="Способы оплаты"
        title="Как можно оплатить лечение"
        subtitle="Выбирайте удобный способ — их можно совмещать: часть оплатить сразу, остальное в рассрочку или кредит."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {content.methods.map((method) => {
          const Icon = iconMap[method.icon] ?? Sparkles
          const inner = (
            <>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="font-heading text-base font-semibold text-foreground">{method.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{method.description}</p>
              {method.anchor && (
                <span className="mt-auto pt-1 text-sm font-medium text-primary">Подробнее ↓</span>
              )}
            </>
          )
          const className = 'flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-border'
          return method.anchor ? (
            <a
              key={method.title}
              href={`#${method.anchor}`}
              className={`${className} transition-shadow hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/30`}
            >
              {inner}
            </a>
          ) : (
            <div key={method.title} className={className}>
              {inner}
            </div>
          )
        })}
      </div>
    </>
  )
}

function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  const columns = steps.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2'
  return (
    <ol className={`mt-6 grid gap-4 ${columns}`}>
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-2 rounded-2xl bg-card/70 p-5 ring-1 ring-border">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <h3 className="font-heading text-base font-semibold text-foreground">{step.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

export function PaymentInstallment({ content }: { content: PaymentContent }) {
  const { installment } = content
  return (
    <>
      <MedTourismHeading eyebrow="Рассрочка" title={installment.title} subtitle={installment.subtitle} />
      <div className="grid gap-4 md:grid-cols-2">
        {installment.cards.map((card) => (
          <div
            key={card.name}
            className="flex flex-col gap-5 rounded-3xl bg-[linear-gradient(140deg,var(--card),var(--panel-sky))] p-6 ring-1 ring-primary/12 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">Карта рассрочки · {card.bank}</span>
                <h3 className="font-heading text-2xl font-bold text-foreground">{card.name}</h3>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="font-heading text-3xl leading-none font-bold text-primary">{card.term}</span>
                <span className="mt-1 max-w-28 text-xs leading-tight text-muted-foreground">{card.termLabel}</span>
              </div>
            </div>
            <ul className="flex flex-col gap-2">
              {card.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-secondary" />
                  {point}
                </li>
              ))}
            </ul>
            <a
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Условия на сайте {card.bank}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        ))}
      </div>
      <Steps steps={installment.steps} />
    </>
  )
}

export function PaymentCredit({ content }: { content: PaymentContent }) {
  const { credit } = content
  return (
    <>
      <MedTourismHeading eyebrow="Кредит" title={credit.title} subtitle={credit.subtitle} />
      <div className="grid gap-4 sm:grid-cols-2">
        {credit.offers.map((offer) => (
          <div key={offer.bank} className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-border">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Landmark className="size-5" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">{offer.bank}</span>
                <h3 className="font-heading text-lg leading-tight font-semibold text-foreground">{offer.name}</h3>
              </div>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              {offer.terms.map((term) => (
                <div key={term.label} className="contents">
                  <dt className="text-muted-foreground">{term.label}</dt>
                  <dd className="font-medium text-foreground">{term.value}</dd>
                </div>
              ))}
            </dl>
            {offer.note && <p className="text-sm leading-relaxed text-muted-foreground">{offer.note}</p>}
            <a
              href={offer.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Сайт банка
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Условия банков указаны на {content.checkedAt} и могут меняться — актуальные уточняйте на сайте банка. Кредит
        предоставляет банк, решение о выдаче принимает банк.
      </p>
      <Steps steps={credit.steps} />
    </>
  )
}

export function PaymentRequisites({ city, content }: { city: City; content: PaymentContent }) {
  const { requisites } = content
  const rows = [
    { label: 'Получатель', value: city.legal.entityName },
    { label: 'УНП', value: city.legal.unp },
    { label: 'Юридический адрес', value: city.legal.legalAddress },
    ...(requisites.bankAccount
      ? [
          { label: 'Расчётный счёт', value: requisites.bankAccount.iban },
          { label: 'Банк', value: requisites.bankAccount.bankName },
          { label: 'БИК', value: requisites.bankAccount.bic },
        ]
      : []),
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
      <div>
        <MedTourismHeading eyebrow="Безналичный расчёт" title={requisites.title} subtitle={requisites.subtitle} />
        <BookingButton className="bg-accent text-accent-foreground hover:bg-accent/90">Оставить заявку на счёт</BookingButton>
      </div>
      <div className="rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
        <dl className="flex flex-col divide-y divide-border">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-6">
              <dt className="w-44 shrink-0 text-sm text-muted-foreground">{row.label}</dt>
              <dd className="font-medium text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
        {!requisites.bankAccount && (
          <p className="mt-5 rounded-xl bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
            Номер счёта и сумму к оплате администратор пришлёт вместе со счётом — оставьте заявку или позвоните{' '}
            <a href={city.phoneHref} className="font-medium whitespace-nowrap text-primary hover:underline">
              {city.phone}
            </a>
            .
          </p>
        )}
      </div>
    </div>
  )
}
