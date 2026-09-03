'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CarFront,
  ClipboardList,
  Clock,
  Cpu,
  FileText,
  FlaskConical,
  HeartHandshake,
  MapPin,
  Phone,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Syringe,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { PhotoPlaceholder } from '@/components/photo-placeholder'
import { useBookingModal } from '@/components/booking-modal-provider'
import { useCity } from '@/lib/contexts/city-context'
import { getRealDoctorsForCity } from '@/config/doctors'
import { cn } from '@/lib/utils'
import type { AboutBlock, AboutPhoto } from '@/content/types'

// Иконки принципов приходят из контента города строкой (см. AboutPrinciple),
// потому что content/*.ts — данные, а не React: держать в них импорты
// компонентов нельзя.
const iconMap: Record<string, LucideIcon> = {
  ClipboardList,
  Clock,
  FlaskConical,
  ShieldCheck,
  Syringe,
  CarFront,
  ScanLine,
  Sparkles,
  HeartHandshake,
  Cpu,
}

function pluralizeDoctors(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'врач'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'врача'
  return 'врачей'
}

/**
 * Фото клиники. Пока реального снимка нет (photo.src не задан), на его месте
 * стоит заглушка с брифом на съёмку — так список нужных фото виден прямо на
 * странице. Появился файл — достаточно дописать src в контенте города.
 *
 * Заглушке намеренно не задаётся aspect-ratio (в отличие от готового фото):
 * бриф — это несколько строк текста, и в фиксированной пропорции он
 * переполнял бы блок и наезжал на секцию ниже. Поэтому здесь min-height и
 * высота по содержимому.
 *
 * tone='dark' — для тёмной панели-шапки: у PhotoPlaceholder цвета завязаны на
 * --muted-foreground, то есть тёмные, и на тёмном фоне бриф не читался.
 */
function ClinicPhoto({
  photo,
  className,
  tone = 'light',
}: {
  photo: AboutPhoto
  className?: string
  tone?: 'light' | 'dark'
}) {
  if (!photo.src) {
    return (
      <PhotoPlaceholder
        label={photo.hint}
        width={photo.width}
        height={photo.height}
        className={cn(
          'min-h-56 py-10 sm:min-h-64',
          tone === 'dark' &&
            'border-white/35 bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,rgb(255_255_255/0.08)_8px,rgb(255_255_255/0.08)_16px)] [&_p]:text-white/85 [&_svg]:text-white/70',
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'relative aspect-4/3 overflow-hidden rounded-2xl ring-1 ring-silver/25',
        className
      )}
    >
      <Image
        src={photo.src}
        alt={photo.hint}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  )
}

// Текст + фото в две колонки. side задаёт, с какой стороны стоит фото —
// блоки на странице чередуются, чтобы полотно не читалось как один столбец.
function TextWithPhoto({
  block,
  icon: Icon,
  side,
}: {
  block: AboutBlock
  icon: LucideIcon
  side: 'left' | 'right'
}) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
      <div className={cn('flex flex-col gap-4', side === 'left' && 'md:order-2')}>
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/20">
            <Icon className="size-5" />
          </span>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-(--panel-heading)">
            {block.title}
          </h2>
        </div>
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-pretty leading-relaxed text-(--panel-body)">
            {paragraph}
          </p>
        ))}
      </div>

      <ClinicPhoto photo={block.photo} className={cn(side === 'left' && 'md:order-1')} />
    </div>
  )
}

export function AboutContent() {
  const { city, content } = useCity()
  const { openBookingModal } = useBookingModal()
  const about = content.about
  // Только реальные врачи: у Минска и Жлобина в конфиге пока карточки-заглушки
  // с выдуманными именами и чужими фото (см. isPlaceholder в config/doctors.ts).
  // Показывать их здесь как живых людей нельзя.
  const doctors = getRealDoctorsForCity(city.slug)

  // Количество врачей не хранится в контенте — считаем по конфигу, чтобы
  // цифра не разъезжалась с составом команды на странице врачей. Если реальных
  // карточек ещё нет, цифру не показываем вовсе, а не выдаём число заглушек
  // за факт.
  const stats = doctors.length
    ? [
        {
          value: String(doctors.length),
          label: `${pluralizeDoctors(doctors.length)} принимают пациентов`,
        },
        ...about.stats,
      ]
    : about.stats

  return (
    <>
      {/* Шапка: тёмная карточка, как в hero главной — страница сразу узнаётся
          частью того же сайта, а не отдельным документом. */}
      <Reveal delay={0}>
        <SectionPanel variant="dark">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
            <div className="flex flex-col gap-5">
              <span className="text-sm font-medium text-(--panel-eyebrow)">{about.eyebrow}</span>
              <h1 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-balance text-(--panel-heading) sm:text-4xl xl:text-5xl">
                {about.title}
              </h1>
              <p className="max-w-xl text-pretty leading-relaxed text-(--panel-body)">
                {about.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85 ring-1 ring-white/15">
                  <MapPin className="size-3.5" />
                  {city.address}
                </span>
                <a
                  href={city.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85 ring-1 ring-white/15 transition-colors hover:bg-white/20"
                >
                  <Phone className="size-3.5" />
                  {city.phone}
                </a>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => openBookingModal()}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Записаться на приём
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  render={<Link href={`/${city.slug}/kontakty/`} />}
                  nativeButton={false}
                >
                  Как добраться
                </Button>
              </div>
            </div>

            <ClinicPhoto photo={about.heroPhoto} tone="dark" className="lg:min-h-80" />
          </div>

          {/* Полоса фактов: сетка с разделителями в 1px, как под hero главной.
              Ячейки полупрозрачные (bg-white/6), а не со своим градиентом:
              иначе каждая рисовала бы линейный градиент заново по своей ширине,
              и полоса читалась бы лоскутами разной яркости. */}
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-3 bg-white/6 px-5 py-4">
                <span className="font-heading text-2xl font-bold text-accent">{stat.value}</span>
                <span className="text-sm leading-tight text-white/75">{stat.label}</span>
              </div>
            ))}
          </div>
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="cool-1">
          <TextWithPhoto block={about.history} icon={HeartHandshake} side="right" />
        </SectionPanel>
      </Reveal>

      {/* Принципы: карточки на bg-card внутри цветной панели — внутри карточки
          цвета берутся обычные (foreground/muted), а не --panel-*. */}
      <Reveal delay={1}>
        <SectionPanel variant="indigo-light">
          <div className="mb-8 flex flex-col gap-2">
            <span className="text-sm font-medium text-(--panel-eyebrow)">Принципы работы</span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
              {about.principles.title}
            </h2>
            <p className="max-w-2xl text-pretty text-(--panel-body)">{about.principles.subtitle}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {about.principles.items.map((item) => {
              const Icon = iconMap[item.icon] ?? ShieldCheck
              return (
                <div
                  key={item.title}
                  className="group flex gap-4 rounded-2xl bg-card p-6 ring-1 ring-silver/25 transition-shadow duration-300 hover:shadow-lg"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-heading text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="warm-1">
          <TextWithPhoto block={about.equipment} icon={Cpu} side="left" />
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="mint-1">
          <TextWithPhoto block={about.laboratory} icon={FlaskConical} side="right" />
        </SectionPanel>
      </Reveal>

      {/* Команда: единственный блок страницы, где фото могут быть настоящими —
          портреты врачей Рогачёва уже сняты и лежат в config/doctors.ts. Для
          городов, где реальных карточек ещё нет, вместо людей показываем бриф
          на съёмку — как и в остальных блоках страницы. */}
      <Reveal delay={1}>
          <SectionPanel variant="rose-1">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-12">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/20">
                    <Users className="size-5" />
                  </span>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-(--panel-heading)">
                    {about.team.title}
                  </h2>
                </div>
                <p className="text-pretty leading-relaxed text-(--panel-body)">
                  {about.team.description}
                </p>
                <Button
                  variant="outline"
                  className="w-fit"
                  render={<Link href={`/${city.slug}/vrachi/`} />}
                  nativeButton={false}
                >
                  Все врачи клиники
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>

              {doctors.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {doctors.slice(0, 4).map((doctor) => (
                    <Link
                      key={doctor.slug}
                      href={`/${city.slug}/vrachi/${doctor.slug}/`}
                      className="group relative aspect-3/4 w-[calc(50%-0.375rem)] overflow-hidden rounded-2xl ring-1 ring-silver/30 transition-shadow duration-300 hover:shadow-lg"
                    >
                      <Image
                        src={doctor.photo}
                        alt={doctor.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 200px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <p className="text-xs leading-tight font-semibold text-white drop-shadow-sm">
                          {doctor.name}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-tight text-white/75">
                          {doctor.experienceYears} лет практики
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <PhotoPlaceholder
                  label={`Портреты врачей клиники в городе ${city.name}: поясной портрет в халате на светлом фоне клиники, по одному кадру на врача. Нужны вместе с именами и специализациями — сейчас в конфиге стоят выдуманные карточки`}
                  width={800}
                  height={1000}
                  className="min-h-64 py-10"
                />
              )}
            </div>
          </SectionPanel>
      </Reveal>

      {/* Страховая и документы — юридический «хвост» страницы. */}
      <Reveal delay={1}>
        <SectionPanel variant="lavender-1">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-silver/25 sm:p-8">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/20">
                <ShieldCheck className="size-5" />
              </span>
              <h2 className="font-heading text-xl font-bold text-foreground">{about.insurance.title}</h2>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {about.insurance.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-silver/25 sm:p-8">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/20">
                <FileText className="size-5" />
              </span>
              <h2 className="font-heading text-xl font-bold text-foreground">{content.documents.title}</h2>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {content.documents.description}
              </p>
              <Button
                variant="outline"
                className="mt-auto w-fit"
                render={<Link href={`/${city.slug}/o-nas/dokumenty-i-licenzii/`} />}
                nativeButton={false}
              >
                Смотреть документы
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </SectionPanel>
      </Reveal>
    </>
  )
}
