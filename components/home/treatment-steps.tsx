'use client'

import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, type Variants } from 'motion/react'
import { ParticleField } from '@/components/particle-field'
import {
  Stethoscope,
  ScanLine,
  ClipboardList,
  Syringe,
  Clock,
  Wrench,
  Crown,
  Sparkles,
  Hourglass,
  type LucideIcon,
} from 'lucide-react'
import { useCity } from '@/lib/contexts/city-context'
import { cn } from '@/lib/utils'
import { PhotoPlaceholder } from '@/components/photo-placeholder'
import { getDoctorsForCity, type Doctor, type DoctorCategory } from '@/config/doctors'
import type { TreatmentTimelineStep, TreatmentTimelineGapLabel } from '@/content/types'

const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  ScanLine,
  ClipboardList,
  Syringe,
  Clock,
  Wrench,
  Crown,
  Sparkles,
  Hourglass,
}

// Реальные фото клиники, которые уже есть в проекте — используем как небольшие
// живые миниатюры между карточками этапов, вместо ещё одних заглушек.
const GAP_PHOTOS = [
  '/clinic/equipment.jpg',
  '/clinic/office.jpg',
  '/clinic/laboratory.jpg',
  '/clinic/office2.jpg',
  '/clinic/reception.jpg',
]

const MILESTONE_PHOTO_HINTS: Record<string, string> = {
  Консультация: 'Фото приёма: врач и пациент в кабинете консультации',
  'Установка имплантов': 'Фото хирургического кабинета или стерильного набора инструментов (без открытой процедуры)',
  'Финальные коронки': 'Фото зуботехнической лаборатории или готовой работы на модели',
}

// Небольшая, но узнаваемая подборка врачей клиники для фото-кластера у вступления:
// по одному из каждого профиля, если это есть в городе, иначе — просто первые доступные.
function pickDoctorCluster(doctors: Doctor[]): Doctor[] {
  const preferredOrder: DoctorCategory[] = ['terapevt', 'hirurg', 'ortoped']
  const picked: Doctor[] = []
  for (const category of preferredOrder) {
    const found = doctors.find((d) => d.categories.includes(category) && !picked.includes(d))
    if (found) picked.push(found)
  }
  for (const doctor of doctors) {
    if (picked.length >= 3) break
    if (!picked.includes(doctor)) picked.push(doctor)
  }
  return picked.slice(0, 3)
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
  },
}

function generateWavyPath(): string {
  const segments: string[] = ['M 12 0']
  const amplitude = 3
  const period = 16
  const totalHeight = 1600

  for (let y = 0; y < totalHeight; y += period) {
    const cpX = y % (period * 2) === 0 ? 12 + amplitude : 12 - amplitude
    segments.push(`Q ${cpX} ${y + period / 2} 12 ${y + period}`)
  }

  return segments.join(' ')
}

// Крупный, заметный кластер фото врачей рядом со вступительной фразой секции —
// не бейдж на карточке, а самостоятельный визуальный элемент.
function DoctorCluster({ doctors }: { doctors: Doctor[] }) {
  if (!doctors.length) return null

  const styles = [
    { size: 'size-[100px]', rotate: '-rotate-6', shift: 'translate-y-2', z: 1 },
    { size: 'size-[120px]', rotate: 'rotate-3', shift: '-translate-y-1', z: 3 },
    { size: 'size-[100px]', rotate: '-rotate-3', shift: 'translate-y-3', z: 2 },
  ]

  return (
    <div className="flex items-end -space-x-9 sm:-space-x-11">
      {doctors.map((doctor, i) => {
        const style = styles[i]
        return (
          <div
            key={doctor.slug}
            style={{ zIndex: style.z }}
            className={cn(
              'group relative shrink-0 overflow-hidden rounded-2xl ring-4 ring-background shadow-xl transition-transform duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:rotate-0',
              style.size,
              style.rotate,
              style.shift
            )}
          >
            <Image
              src={doctor.photo}
              alt={doctor.name}
              fill
              sizes="120px"
              className="object-cover"
            />
          </div>
        )
      })}
    </div>
  )
}

function StepCard({
  step,
  index,
  isLeft = true,
}: {
  step: TreatmentTimelineStep
  index: number
  isLeft?: boolean
}) {
  const Icon = iconMap[step.icon]
  const isMilestone = step.isMilestone
  const photoHint = isMilestone ? MILESTONE_PHOTO_HINTS[step.title] : undefined

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 260, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 260, damping: 22 })
  const glowRef = useRef<HTMLDivElement>(null)

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * 6)
    rotateX.set((0.5 - py) * 6)
    if (glowRef.current) {
      glowRef.current.style.setProperty('--mx', `${px * 100}%`)
      glowRef.current.style.setProperty('--my', `${py * 100}%`)
      glowRef.current.style.opacity = '1'
    }
  }

  function handlePointerLeave() {
    rotateX.set(0)
    rotateY.set(0)
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
      className={cn(
        'relative flex flex-col rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5',
        isMilestone
          ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
          : 'border-border bg-card'
      )}
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 [background:radial-gradient(140px_circle_at_var(--mx)_var(--my),color-mix(in_oklch,var(--silver),transparent_55%),transparent_70%)]"
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-2 hidden select-none font-heading text-8xl leading-none font-bold text-silver/25 md:block',
          isLeft ? 'right-0 translate-x-[70%]' : 'left-0 -translate-x-[70%]'
        )}
      >
        {String(step.step).padStart(2, '0')}
      </span>

      <div className="relative flex items-start gap-3 sm:gap-4">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg sm:size-12',
            isMilestone
              ? 'bg-accent text-accent-foreground'
              : 'silver-sheen bg-linear-to-b from-silver-muted to-silver/25 text-silver-foreground ring-1 ring-silver/30 dark:text-foreground'
          )}
        >
          {Icon && <Icon className={cn('size-5', isMilestone && 'sm:size-6')} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span
              className={cn(
                'text-xs font-semibold uppercase tracking-wider',
                isMilestone ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              Шаг {step.step}
            </span>
            <span
              className={cn(
                'font-heading font-bold',
                isMilestone
                  ? 'text-base text-accent sm:text-lg'
                  : 'text-sm text-muted-foreground'
              )}
            >
              {step.duration}
            </span>
          </div>

          <h3
            className={cn(
              'font-heading font-semibold text-foreground',
              isMilestone ? 'text-lg sm:text-xl' : 'text-base'
            )}
          >
            {step.title}
          </h3>

          <p
            className={cn(
              'mt-1 leading-relaxed text-muted-foreground',
              isMilestone ? 'text-sm sm:text-base' : 'text-sm'
            )}
          >
            {step.description}
          </p>
        </div>
      </div>

      {step.photo ? (
        <div className="relative z-10 mt-4 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={step.photo}
            alt={step.title}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
          />
        </div>
      ) : (
        photoHint && (
          <PhotoPlaceholder
            label={photoHint}
            width={1600}
            height={900}
            className="relative z-10 mt-4 aspect-video"
          />
        )
      )}
    </motion.div>
  )
}

// Дуговая пунктирная стрелка между блоками. viewBox в процентах + non-scaling
// stroke, чтобы кривая растягивалась на всю ширину ряда, а толщина линии не плыла.
function ArcConnector({ direction }: { direction: 'toRight' | 'toLeft' | 'down' }) {
  if (direction === 'down') {
    return (
      <svg
        viewBox="0 0 40 56"
        className="mx-auto h-14 w-10 text-silver"
        fill="none"
        aria-hidden
      >
        <path
          d="M18,2 C36,16 4,30 18,44"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeDasharray="4 3.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path d="M12,40 L18,50 L24,40" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>
    )
  }

  const toRight = direction === 'toRight'
  const d = toRight ? 'M23,3 C48,1 52,25 76,18' : 'M77,3 C52,1 48,25 24,18'
  const headX = toRight ? 76 : 24
  const arrowPath = toRight
    ? `M${headX - 5},13 L${headX + 3},18 L${headX - 5},23`
    : `M${headX + 5},13 L${headX - 3},18 L${headX + 5},23`

  return (
    <svg viewBox="0 0 100 26" preserveAspectRatio="none" className="h-14 w-full text-silver" fill="none" aria-hidden>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3.5 3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={arrowPath}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        fill="none"
      />
    </svg>
  )
}

// Стрелка-коннектор + маленькое круглое фото клиники поверх неё.
function GapConnector({
  direction,
  photo,
}: {
  direction: 'toRight' | 'toLeft' | 'down'
  photo: string
}) {
  return (
    <div className="relative flex items-center justify-center">
      <ArcConnector direction={direction} />
      <div className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-4 ring-background shadow-md sm:size-14">
        <Image src={photo} alt="" fill sizes="56px" className="object-cover" />
      </div>
    </div>
  )
}

function GapLabelCard({ gap }: { gap: TreatmentTimelineGapLabel }) {
  const Icon = gap.icon ? iconMap[gap.icon] : null

  return (
    <div className="flex items-center gap-2 rounded-full border border-dashed border-accent/40 bg-accent/5 px-4 py-2 text-sm text-accent">
      {Icon && <Icon className="size-4" />}
      <span className="font-medium">{gap.label}</span>
    </div>
  )
}

export function TreatmentSteps() {
  const { city, content } = useCity()
  const timeline = content.treatmentTimeline

  if (!timeline?.steps?.length) return null

  const { steps, gapLabels = [] } = timeline
  const getGapAfter = (stepNum: number) =>
    gapLabels.find((g) => g.afterStep === stepNum)

  const wavyPath = generateWavyPath()
  const clusterDoctors = pickDoctorCluster(getDoctorsForCity(city.slug))

  return (
    <section className="relative overflow-hidden border-y border-silver/25 bg-silver-muted">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,color-mix(in_oklch,var(--primary),transparent_92%),transparent_50%),radial-gradient(circle_at_85%_60%,color-mix(in_oklch,var(--accent),transparent_93%),transparent_45%),radial-gradient(circle_at_30%_90%,color-mix(in_oklch,var(--secondary),transparent_94%),transparent_50%)]"
      />
      <ParticleField
        className="pointer-events-none absolute inset-0 size-full"
        particleCount={180}
        minSize={1.6}
        maxSize={4.5}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-secondary">Путь пациента</span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Этапы лечения
            </h2>
            <p className="max-w-xl text-pretty text-muted-foreground">
              От первого визита до улыбки мечты — каждый этап под контролем наших врачей.
            </p>
          </div>
          <div className="sm:mt-8">
            <DoctorCluster doctors={clusterDoctors} />
          </div>
        </div>

        {/* Mobile layout: line left, cards right */}
        <div className="relative md:hidden">
          <div className="absolute left-[18px] top-0 h-full sm:left-[22px]">
            <svg
              width="24"
              height="100%"
              viewBox="0 0 24 1600"
              preserveAspectRatio="none"
              fill="none"
              className="h-full"
            >
              <motion.path
                d={wavyPath}
                stroke="hsl(var(--accent))"
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeLinecap="round"
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
            </svg>
          </div>

          <div className="flex flex-col gap-2 pl-14">
            {steps.map((step, i) => {
              const gap = getGapAfter(step.step)
              const nextStep = steps[i + 1]
              const extraGap = step.isMilestone && nextStep ? 'mb-1' : ''

              return (
                <div key={step.step} className={extraGap}>
                  <StepCard step={step} index={i} />
                  {gap ? (
                    <div className="mt-3 flex justify-center">
                      <GapLabelCard gap={gap} />
                    </div>
                  ) : (
                    nextStep && (
                      <GapConnector direction="down" photo={GAP_PHOTOS[i % GAP_PHOTOS.length]} />
                    )
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop layout: zigzag, connected by arcing arrows */}
        <div className="hidden md:block">
          <div className="flex flex-col">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0
              const gap = getGapAfter(step.step)
              const nextStep = steps[i + 1]

              return (
                <div key={step.step}>
                  <div className="grid grid-cols-11 items-start gap-4">
                    <div className="col-span-5">
                      {isLeft && <StepCard step={step} index={i} isLeft />}
                    </div>
                    <div className="col-span-1" />
                    <div className="col-span-5">
                      {!isLeft && <StepCard step={step} index={i} isLeft={false} />}
                    </div>
                  </div>

                  {gap ? (
                    <div className="relative z-10 my-2 flex justify-center">
                      <GapLabelCard gap={gap} />
                    </div>
                  ) : (
                    nextStep && (
                      <GapConnector
                        direction={isLeft ? 'toRight' : 'toLeft'}
                        photo={GAP_PHOTOS[i % GAP_PHOTOS.length]}
                      />
                    )
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
