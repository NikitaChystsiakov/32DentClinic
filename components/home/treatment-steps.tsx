'use client'

import Image from 'next/image'
import { motion, type Variants } from 'motion/react'
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

function StepCard({
  step,
  index,
}: {
  step: TreatmentTimelineStep
  index: number
}) {
  const Icon = iconMap[step.icon]
  const isMilestone = step.isMilestone

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={cn(
        'relative flex items-start gap-3 rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md sm:gap-4 sm:p-5',
        isMilestone
          ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
          : 'border-border bg-card'
      )}
    >
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg sm:size-12',
          isMilestone ? 'bg-accent text-accent-foreground' : 'bg-primary/10 text-primary'
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

      {step.photo && (
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg sm:size-32">
          <Image
            src={step.photo}
            alt={step.title}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover"
          />
        </div>
      )}
    </motion.div>
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
  const { content } = useCity()
  const timeline = content.treatmentTimeline

  if (!timeline?.steps?.length) return null

  const { steps, gapLabels = [] } = timeline
  const getGapAfter = (stepNum: number) =>
    gapLabels.find((g) => g.afterStep === stepNum)

  const wavyPath = generateWavyPath()

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary">Путь пациента</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Этапы лечения
          </h2>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            От первого визита до улыбки мечты — каждый этап под контролем наших врачей.
          </p>
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

          <div className="flex flex-col gap-6 pl-14">
            {steps.map((step, i) => {
              const gap = getGapAfter(step.step)
              const nextStep = steps[i + 1]
              const extraGap =
                step.isMilestone && nextStep ? 'mb-2' : ''

              return (
                <div key={step.step} className={extraGap}>
                  <StepCard step={step} index={i} />
                  {gap && (
                    <div className="mt-3 flex justify-center">
                      <GapLabelCard gap={gap} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop layout: zigzag with centered line */}
        <div className="relative hidden md:block">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 h-full -translate-x-1/2">
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

          <div className="flex flex-col gap-8">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0
              const gap = getGapAfter(step.step)
              const nextStep = steps[i + 1]
              const extraGap =
                step.isMilestone && nextStep ? 'mb-4' : ''

              return (
                <div key={step.step} className={extraGap}>
                  <div className="grid grid-cols-12 items-start gap-6">
                    <div className="col-span-5">
                      {isLeft && (
                        <StepCard step={step} index={i} />
                      )}
                    </div>
                    <div className="col-span-2" />
                    <div className="col-span-5 col-start-8">
                      {!isLeft && (
                        <StepCard step={step} index={i} />
                      )}
                    </div>
                  </div>

                  {gap && (
                    <div className="relative z-10 mt-4 flex justify-center">
                      <GapLabelCard gap={gap} />
                    </div>
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
