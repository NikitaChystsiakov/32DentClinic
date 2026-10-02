import type { ReactNode } from 'react'
import {
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  CircleSlash,
  Download,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react'

import { BookingButton } from '@/components/booking-button'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { Button } from '@/components/ui/button'
import type { City } from '@/config/cities'
import type { GuaranteePolicy, GuaranteeTable } from '@/config/guarantees'

/*
 * Страница «Гарантии»: выжимка из Положения о гарантийных сроках и сроках
 * службы плюс ссылка на сам PDF. Все тексты и сроки — в config/guarantees.ts.
 *
 * Серверный компонент: интерактива нет, кроме кнопки записи (она сама —
 * клиентский островок), так что в JS страницы ничего из этого не попадает.
 */

function PdfButtons({ pdf, inverse = false }: { pdf: string; inverse?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="lg"
        variant={inverse ? 'inverse' : 'default'}
        render={<a href={pdf} target="_blank" rel="noopener noreferrer" />}
        nativeButton={false}
      >
        <FileText data-icon="inline-start" />
        Полный текст положения
        <ArrowUpRight data-icon="inline-end" />
      </Button>
      {!inverse && (
        <Button size="lg" variant="outline" render={<a href={pdf} download />} nativeButton={false}>
          Скачать PDF
          <Download data-icon="inline-end" />
        </Button>
      )}
    </div>
  )
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <span className="text-sm font-medium text-(--panel-eyebrow)">{eyebrow}</span>
      <h2 className="font-heading text-2xl font-bold tracking-tight text-balance text-(--panel-heading) sm:text-3xl">
        {title}
      </h2>
      {children && <p className="max-w-2xl text-pretty text-(--panel-body)">{children}</p>}
    </div>
  )
}

/*
 * Таблица сроков списком, а не <table>: на телефоне три колонки не влезают,
 * и строки складываются в карточку — название сверху, сроки под ним.
 */
function TermsTable({ table }: { table: GuaranteeTable }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-silver/25">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border px-5 py-4 sm:px-6">
        <h3 className="font-heading text-lg font-bold text-foreground">{table.title}</h3>
        <span className="text-xs text-muted-foreground">{table.source} к положению</span>
      </div>
      <div className="hidden grid-cols-[1fr_9rem_9rem] gap-4 border-b border-border px-6 py-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid">
        <span>Вид работы</span>
        <span>Гарантия</span>
        <span>Срок службы</span>
      </div>
      <ul className="divide-y divide-border">
        {table.rows.map((row) => (
          <li
            key={row.name}
            className="grid gap-1.5 px-5 py-3.5 sm:grid-cols-[1fr_9rem_9rem] sm:items-baseline sm:gap-4 sm:px-6"
          >
            <span className="flex flex-col">
              <span className="text-foreground">{row.name}</span>
              {row.note && <span className="text-sm text-muted-foreground">{row.note}</span>}
            </span>
            <span className="text-sm sm:text-base">
              <span className="text-muted-foreground sm:hidden">Гарантия: </span>
              <span className="font-semibold text-foreground tabular-nums">{row.term}</span>
            </span>
            <span className="text-sm text-muted-foreground sm:text-base">
              <span className="sm:hidden">Срок службы: </span>
              <span className="tabular-nums">{row.serviceLife}</span>
            </span>
          </li>
        ))}
      </ul>
      {table.footnote && (
        <p className="border-t border-border bg-muted/40 px-5 py-3.5 text-sm text-pretty text-muted-foreground sm:px-6">
          {table.footnote}
        </p>
      )}
    </div>
  )
}

function IconList({
  items,
  icon: Icon,
  iconClassName,
}: {
  items: string[]
  icon: typeof CircleCheck
  iconClassName: string
}) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-pretty text-foreground">
          <Icon className={`mt-0.5 size-5 shrink-0 ${iconClassName}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function GuaranteePolicyPage({ city, policy }: { city: City; policy: GuaranteePolicy }) {
  return (
    <>
      <Reveal delay={0}>
        <SectionPanel variant="neutral">
          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium text-secondary">Пациентам</span>
            <h1 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              Гарантии и сроки службы
            </h1>
            <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              Коротко о главном из Положения о гарантийных сроках и сроках службы клиники {city.brandName} в{' '}
              {city.nameIn}: на что даётся гарантия, на какой срок и что нужно, чтобы она сохранилась.
            </p>
            <p className="text-sm text-muted-foreground">
              {policy.entityName} · положение утверждено {policy.approvedAt}
            </p>
            <div className="mt-2">
              <PdfButtons pdf={policy.pdf} />
            </div>
          </div>

          <dl className="mt-10 grid gap-4 md:grid-cols-3">
            {policy.highlights.map((item) => (
              <div key={item.label} className="flex flex-col gap-3 rounded-2xl bg-(--panel-ice) p-5 sm:p-6">
                <dt className="flex flex-col">
                  <span className="font-heading text-3xl leading-none font-bold text-foreground">{item.value}</span>
                  <span className="mt-1.5 text-sm font-medium text-primary">{item.label}</span>
                </dt>
                <dd className="text-sm leading-relaxed text-pretty text-muted-foreground">{item.description}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 flex gap-2 text-sm text-pretty text-muted-foreground">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            Это пересказ простыми словами. Если формулировки расходятся, действует полный текст положения.
          </p>
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="ice">
          <SectionHeading eyebrow="Сроки" title="На что и на сколько даётся гарантия">
            Гарантия — срок, в который мы бесплатно исправим недостаток работы. Срок службы — срок, в который работа
            должна служить по назначению, а за недостатки по нашей вине мы отвечаем. Точный срок врач указывает в
            медицинской карте: он может быть больше или меньше среднего в зависимости от ситуации во рту.
          </SectionHeading>
          <div className="flex flex-col gap-6">
            {policy.tables.map((table) => (
              <TermsTable key={table.title} table={table} />
            ))}
          </div>
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="lavender">
          <SectionHeading eyebrow="Имплантация" title="Три вида гарантии на имплантацию" />
          <div className="grid gap-4 md:grid-cols-3">
            {policy.implants.map((item) => (
              <div key={item.title} className="flex flex-col gap-2 rounded-2xl bg-card p-5 ring-1 ring-silver/25 sm:p-6">
                <h3 className="font-heading text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-card/70 p-5 ring-1 ring-silver/25 sm:p-6">
            <h3 className="mb-4 font-heading text-lg font-bold text-foreground">Брекеты и каппы</h3>
            <IconList items={policy.orthodontics} icon={CircleCheck} iconClassName="text-primary" />
          </div>
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="mint">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <SectionHeading eyebrow="Условия" title="Как сохранить гарантию" />
              <ol className="flex flex-col gap-4">
                {policy.conditions.map((item, index) => (
                  <li key={item} className="flex gap-4 text-pretty text-foreground">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card font-heading text-sm font-bold text-primary ring-1 ring-primary/15">
                      {index + 1}
                    </span>
                    <span className="pt-1">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <SectionHeading eyebrow="Сокращение срока" title="Когда срок гарантии меньше">
                Срок зависит от состояния зубов и гигиены — врач оценивает их на осмотре.
              </SectionHeading>
              <dl className="flex flex-col gap-3">
                {policy.reductions.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-silver/25 sm:flex-row sm:items-baseline sm:gap-4 sm:p-5">
                    <dt className="shrink-0 sm:w-28 font-heading text-xl font-bold whitespace-nowrap text-foreground tabular-nums">
                      {item.value}
                    </dt>
                    <dd className="text-sm leading-relaxed text-pretty text-muted-foreground">{item.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="neutral">
          <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
            <div>
              <SectionHeading eyebrow="Исключения" title="На что гарантия не даётся">
                Здесь результат зависит от организма больше, чем от работы врача, или у работы нет «вещественного»
                результата. Полный перечень — в разделе 4 положения.
              </SectionHeading>
              <IconList items={policy.exclusions} icon={CircleSlash} iconClassName="text-muted-foreground" />
            </div>
            <div>
              <SectionHeading eyebrow="Прекращение" title="Когда гарантия прекращается" />
              <IconList items={policy.terminations} icon={CircleAlert} iconClassName="text-muted-foreground" />
            </div>
          </div>
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="dark">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <SectionHeading eyebrow="Если что-то беспокоит" title="Как обратиться по гарантии">
                При боли, дискомфорте или поломке в гарантийный срок позвоните или напишите в клинику — администратор
                запишет вас к лечащему врачу. Переписка с врачом в личных мессенджерах обращением не считается.
              </SectionHeading>
              <ul className="flex flex-col gap-3">
                {policy.contacts.phones.map((phone) => (
                  <li key={phone.href}>
                    <a
                      href={phone.href}
                      className="inline-flex items-center gap-3 font-medium text-white tabular-nums hover:underline"
                    >
                      <Phone className="size-4" />
                      {phone.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${policy.contacts.email}`}
                    className="inline-flex items-center gap-3 font-medium text-white hover:underline"
                  >
                    <Mail className="size-4" />
                    {policy.contacts.email}
                  </a>
                </li>
              </ul>
              <BookingButton variant="inverse" className="mt-8 w-fit">
                Записаться к врачу
              </BookingButton>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 sm:p-6">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
                <ShieldCheck className="size-5" />
                Ваши права в гарантийный срок
              </h3>
              <p className="mt-2 text-sm text-(--panel-body)">
                По Закону «О защите прав потребителей» при недостатке работы вы вправе по своему выбору потребовать:
              </p>
              <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-(--panel-body) marker:text-white/60">
                {policy.rights.map((item) => (
                  <li key={item} className="text-pretty">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-(--panel-body)">
                Гарантия считается со дня, когда работа передана вам: это подтверждает запись в медкарте, акт или чек.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-pretty text-(--panel-body)">
              Полный текст положения — с определениями, перечнем исключений и порядком рассмотрения обращений.
            </p>
            <PdfButtons pdf={policy.pdf} inverse />
          </div>
        </SectionPanel>
      </Reveal>
    </>
  )
}
