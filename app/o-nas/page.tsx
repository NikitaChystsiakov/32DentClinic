import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Cpu, FlaskConical, HeartHandshake, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlaceholderGallery } from '@/components/about/placeholder-gallery'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `О клинике Dent32 — стоматология в ${siteConfig.city}`,
  description:
    'Стоматология Dent32 работает в Рогачёве и известна пациентам благодаря собственной зуботехнической лаборатории, современному оборудованию и вниманию к каждому пациенту.',
}

const infoBlocks = [
  {
    icon: HeartHandshake,
    title: 'История',
    body: `Клиника Dent32 работает в Рогачёве с ${siteConfig.foundedYear}.`,
  },
  {
    icon: FlaskConical,
    title: 'Собственная лаборатория',
    body: 'Протезы и коронки изготавливаются в собственной зуботехнической лаборатории клиники — это ускоряет сроки лечения и позволяет контролировать качество на каждом этапе.',
  },
  {
    icon: ShieldCheck,
    title: 'Сотрудничество со страховой',
    body: `Dent32 сотрудничает со страховой компанией «${siteConfig.insurancePartner}».`,
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          О клинике Dent32
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
          Стоматология Dent32 работает в Рогачёве и известна пациентам благодаря собственной зуботехнической
          лаборатории, современному оборудованию и вниманию к каждому пациенту.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          {infoBlocks.map((block) => {
            const Icon = block.icon
            return (
              <div key={block.title} className="flex flex-col gap-3 border-t border-border pt-8 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="font-heading text-xl font-semibold text-foreground">{block.title}</h2>
                </div>
                <p className="text-pretty leading-relaxed text-muted-foreground">{block.body}</p>
              </div>
            )
          })}

          <div className="flex flex-col gap-3 border-t border-border pt-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Cpu className="size-5" />
              </span>
              <h2 className="font-heading text-xl font-semibold text-foreground">Оборудование</h2>
            </div>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              В клинике установлено современное стоматологическое оборудование от американских производителей,
              включая щадящее рентген-оборудование с широким диапазоном возможностей.
            </p>
            <div className="mt-2">
              <PlaceholderGallery count={3} caption="Фотографии оборудования добавляются" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="size-5" />
            </span>
            <div>
              <p className="font-heading text-base font-semibold text-foreground">Документы и лицензии</p>
              <p className="text-sm text-muted-foreground">Юридическая информация о клинике</p>
            </div>
          </div>
          <Button variant="outline" render={<Link href="/o-nas/dokumenty-i-licenzii/" />} nativeButton={false}>
            Смотреть документы
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>
    </>
  )
}
