'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Download, Expand, ExternalLink, FileText, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SectionPanel } from '@/components/section-panel'
import { Reveal } from '@/components/reveal'
import { Lightbox } from '@/components/home/clinic-gallery-section'
import type { City, ClinicPhoto } from '@/config/cities'
import { legalDocuments, legalDocHref } from '@/config/legal'

/*
 * Страница «Документы и лицензии»: реквизиты лицензии из config/cities.ts
 * (city.legal.license) и сканы документов постранично. Ничего из этого не
 * хранится в тексте страницы — правится только конфиг города.
 *
 * Единый реестр лицензий — официальный источник, по которому пациент может
 * проверить лицензию сам: подтверждения из реестра клиники и показывают.
 */
const LICENSE_REGISTRY_URL = 'https://license.gov.by/'

function RequisiteRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[13rem_1fr] sm:gap-6">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  )
}

export function LicenseDocuments({ city }: { city: City }) {
  const { legal } = city
  const { license } = legal

  // Все страницы всех документов — один список для просмотра: стрелки листают
  // документ насквозь, а не только внутри одного. У каждого документа —
  // смещение его первой страницы в этом списке.
  const tiles = React.useMemo<ClinicPhoto[]>(
    () => license.documents.flatMap((doc) => doc.pages),
    [license.documents]
  )
  const offsets = React.useMemo(() => {
    let sum = 0
    return license.documents.map((doc) => {
      const offset = sum
      sum += doc.pages.length
      return offset
    })
  }, [license.documents])

  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const close = React.useCallback(() => setOpenIndex(null), [])
  const step = React.useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
        current === null ? current : (current + delta + tiles.length) % tiles.length
      )
    },
    [tiles.length]
  )

  return (
    <>
      <Reveal delay={0}>
        <SectionPanel variant="neutral">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-secondary">О клинике</span>
            <h1 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              Документы и лицензии
            </h1>
            <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              Стоматология {city.brandName} в {city.nameIn} работает по лицензии Министерства
              здравоохранения на медицинскую деятельность. Ниже — реквизиты лицензии и сканы
              документов; актуальность лицензии можно проверить в Едином реестре лицензий по
              номеру или УНП.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_18rem]">
            <dl className="divide-y divide-border rounded-2xl bg-background/60 px-5 ring-1 ring-border sm:px-6">
              <RequisiteRow label="Лицензиат">{legal.entityName}</RequisiteRow>
              <RequisiteRow label="УНП">{legal.unp}</RequisiteRow>
              <RequisiteRow label="Номер лицензии">
                <span className="font-medium tabular-nums">{license.number}</span>
              </RequisiteRow>
              <RequisiteRow label="Кем выдана">{license.issuedBy}</RequisiteRow>
              <RequisiteRow label="Действует">
                с {license.issuedAt}
                {license.validUntil ? ` по ${license.validUntil}` : ', бессрочно'}
              </RequisiteRow>
              <RequisiteRow label="Место осуществления деятельности">{license.activityAddress}</RequisiteRow>
              <RequisiteRow label="Работы и услуги">
                <ul className="flex flex-wrap gap-1.5">
                  {license.services.map((service) => (
                    <li
                      key={service}
                      className="rounded-full bg-accent/10 px-2.5 py-1 text-sm text-foreground ring-1 ring-accent/20"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </RequisiteRow>
            </dl>

            <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-silver/25">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/20">
                <ShieldCheck className="size-5" />
              </span>
              <h2 className="font-heading text-lg font-bold text-foreground">Проверить лицензию</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Единый реестр лицензий Республики Беларусь: введите номер лицензии или УНП
                лицензиата — реестр покажет статус и перечень работ и услуг.
              </p>
              <Button
                variant="outline"
                className="mt-auto w-fit"
                render={<a href={LICENSE_REGISTRY_URL} target="_blank" rel="noopener noreferrer" />}
                nativeButton={false}
              >
                Открыть реестр
                <ExternalLink data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </SectionPanel>
      </Reveal>

      {license.documents.map((doc, docIndex) => (
        <Reveal key={doc.title} delay={1}>
          <SectionPanel variant={docIndex % 2 === 0 ? 'ice' : 'lavender'}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/20">
                    <FileText className="size-5" />
                  </span>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-(--panel-heading)">
                    {doc.title}
                  </h2>
                </div>
                {doc.note && <p className="max-w-2xl text-pretty text-(--panel-body)">{doc.note}</p>}
                <p className="text-sm text-(--panel-body)">Нажмите на страницу, чтобы открыть её на весь экран.</p>
              </div>
              {doc.pdf && (
                <Button
                  variant="outline"
                  className="shrink-0"
                  render={<a href={doc.pdf} download />}
                  nativeButton={false}
                >
                  Скачать PDF
                  <Download data-icon="inline-end" />
                </Button>
              )}
            </div>

            {/* Пропорция листа A4; страница вписывается целиком, без обрезки —
                документ обрезать нельзя, даже в превью. */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doc.pages.map((page, pageIndex) => (
                <button
                  key={page.src}
                  type="button"
                  aria-label={`Открыть: ${page.alt}`}
                  onClick={() => setOpenIndex(offsets[docIndex] + pageIndex)}
                  className="group relative aspect-[1/1.3] overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-silver/25 transition-shadow duration-300 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Image
                    src={page.src}
                    alt={page.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain object-top p-2 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  <span className="pointer-events-none absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-brand-ink/80 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Expand className="size-4" />
                  </span>
                  <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-brand-ink/80 px-2.5 py-1 text-xs text-white">
                    Страница {pageIndex + 1} из {doc.pages.length}
                  </span>
                </button>
              ))}
            </div>
          </SectionPanel>
        </Reveal>
      ))}

      {/* Документы по персональным данным (config/legal.ts) — те же, что в
          подвале; здесь, чтобы «Документы» были действительно все в одном месте. */}
      <Reveal delay={1}>
        <SectionPanel variant="neutral">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-xl font-bold text-foreground">Персональные данные</h2>
            <p className="max-w-2xl text-pretty text-muted-foreground">
              Как клиника обрабатывает персональные данные пациентов и посетителей сайта.
            </p>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {legalDocuments.map((doc) => (
              <li key={doc.slug}>
                <Link
                  href={legalDocHref(doc.slug, city.slug)}
                  className="group flex h-full items-start gap-3 rounded-2xl bg-card p-5 ring-1 ring-silver/25 transition-shadow duration-300 hover:shadow-lg"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent ring-1 ring-accent/20">
                    <FileText className="size-4" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{doc.shortTitle}</span>
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary">
                      Читать
                      <ArrowRight className="size-3.5" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </SectionPanel>
      </Reveal>

      {openIndex !== null && <Lightbox tiles={tiles} index={openIndex} onClose={close} onStep={step} />}
    </>
  )
}
