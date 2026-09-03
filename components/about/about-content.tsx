'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Cpu, FlaskConical, HeartHandshake, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { useCity } from '@/lib/contexts/city-context'

function BlockHeading({ icon: Icon, children }: { icon: typeof HeartHandshake; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <h2 className="font-heading text-xl font-semibold text-foreground">{children}</h2>
    </div>
  )
}

function ClinicImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-foreground/10">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  )
}

export function AboutContent() {
  const { city, content } = useCity()

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Reveal delay={0}>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.about.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {content.about.description}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* История */}
        <Reveal delay={0}>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <BlockHeading icon={HeartHandshake}>История</BlockHeading>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {content.about.history}
              </p>
            </div>
            <ClinicImage src="/clinic/reception.jpg" alt="Ресепшн стоматологии 32Дент" />
          </div>
        </Reveal>

        {/* Оборудование */}
        <Reveal delay={0}>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <ClinicImage src="/clinic/equipment.jpg" alt="Современное оборудование в клинике 32Дент" />
            <div className="flex flex-col gap-3">
              <BlockHeading icon={Cpu}>Оборудование</BlockHeading>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {content.about.equipment}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Лаборатория */}
        <Reveal delay={0}>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <BlockHeading icon={FlaskConical}>{content.about.laboratoryTitle}</BlockHeading>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {content.about.laboratory}
              </p>
            </div>
            <ClinicImage src="/clinic/laboratory.jpg" alt="Зуботехническая лаборатория 32Дент" />
          </div>
        </Reveal>

        {/* Страховая */}
        <Reveal delay={0}>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-foreground/10">
                <Image
                  src="/clinic/office.jpg"
                  alt="Лечебный кабинет клиники 32Дент"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-foreground/10">
                <Image
                  src="/clinic/office2.jpg"
                  alt="Холл клиники 32Дент"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <BlockHeading icon={ShieldCheck}>Сотрудничество со страховой</BlockHeading>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {content.about.insurance}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal delay={0}>
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
            <Button variant="outline" render={<Link href={`/${city.slug}/o-nas/dokumenty-i-licenzii/`} />} nativeButton={false}>
              Смотреть документы
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  )
}
