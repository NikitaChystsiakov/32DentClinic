'use client'

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
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

const MILESTONE_PHOTO_HINTS: Record<string, string> = {
  Консультация: 'Фото приёма: врач и пациент в кабинете консультации',
  'Установка имплантов': 'Фото хирургического кабинета или стерильного набора инструментов (без открытой процедуры)',
  'Финальные коронки': 'Фото зуботехнической лаборатории или готовой работы на модели',
  'Лечение кариеса или пульпита': 'Фото стоматологического кабинета или оборудования во время лечения (без открытой полости зуба)',
  'Пломбирование и реставрация': 'Фото готовой реставрации на модели или крупный план улыбки после лечения',
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
          ? // Заливка непрозрачная: при bg-accent/5 сквозь карточку просвечивала
            // indigo-панель и тёмный текст на ней читался плохо. Оттенок акцента
            // сохранён, но подмешан в непрозрачный --card.
            'border-accent bg-[color-mix(in_oklch,var(--card),var(--accent)_8%)] ring-1 ring-accent/20'
          : 'border-border bg-card'
      )}
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 [background:radial-gradient(140px_circle_at_var(--mx)_var(--my),color-mix(in_oklch,var(--silver),transparent_55%),transparent_70%)]"
      />
      {/* Крупный номер шага — decor watermark. Смещён дальше от карточки (85%,
          не 70%), чтобы не проваливаться под полупрозрачные полоски
          PhotoPlaceholder, и залит белым, а не --silver: на indigo-панели
          светло-серый почти сливался с фоном, белый/25 держит контраст. */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-2 hidden select-none font-heading text-7xl leading-none font-bold text-white/25 md:block',
          isLeft ? 'right-0 translate-x-[85%]' : 'left-0 -translate-x-[85%]'
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
                isMilestone ? 'text-accent' : 'text-(--panel-body)'
              )}
            >
              Шаг {step.step}
            </span>
            <span
              className={cn(
                'font-heading font-bold',
                isMilestone
                  ? 'text-base text-accent sm:text-lg'
                  : 'text-sm text-(--panel-body)'
              )}
            >
              {step.duration}
            </span>
          </div>

          <h3
            className={cn(
              'font-heading font-semibold text-(--panel-heading)',
              isMilestone ? 'text-lg sm:text-xl' : 'text-base'
            )}
          >
            {step.title}
          </h3>

          <p
            className={cn(
              'mt-1 leading-relaxed text-(--panel-body)',
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
        className="mx-auto h-14 w-10 text-white/55"
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
    <svg viewBox="0 0 100 26" preserveAspectRatio="none" className="h-14 w-full text-white/55" fill="none" aria-hidden>
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

type OrbTone = 'silver' | 'accent' | 'primary' | 'secondary' | 'white'

const ORB_GRADIENTS: Record<OrbTone, string> = {
  silver: 'radial-gradient(circle at 30% 28%, color-mix(in oklch, var(--silver), white 55%), var(--silver) 80%)',
  accent: 'radial-gradient(circle at 30% 28%, color-mix(in oklch, var(--accent), white 40%), var(--accent) 75%)',
  primary: 'radial-gradient(circle at 30% 28%, color-mix(in oklch, var(--primary), white 45%), var(--primary) 78%)',
  secondary:
    'radial-gradient(circle at 30% 28%, color-mix(in oklch, var(--secondary), white 45%), var(--secondary) 78%)',
  white: 'radial-gradient(circle at 30% 28%, white, color-mix(in oklch, white, transparent 30%) 80%)',
}

// Маленький глянцевый шарик — чисто декоративный акцент, без попытки быть
// "фото" (на таком размере фото всё равно не читается). Шарики у стрелок-
// коннекторов статичны (animate не передан); фоновая россыпь (BackgroundOrbs)
// включает animate — те же координаты, что и весь фон, просто мягко дрейфуют.
function Orb({
  size,
  tone = 'silver',
  animate = false,
  delay = 0,
  duration = 14,
}: {
  size: number
  tone?: OrbTone
  animate?: boolean
  delay?: number
  duration?: number
}) {
  return (
    <span
      className={cn('block rounded-full shadow-md ring-1 ring-white/50', animate && 'animate-orb-float')}
      style={{
        width: size,
        height: size,
        background: ORB_GRADIENTS[tone],
        ...(animate ? { animationDelay: `${delay}s`, animationDuration: `${duration}s` } : {}),
      }}
    />
  )
}

// Стрелка-коннектор + небольшая россыпь декоративных шариков вокруг неё.
function GapConnector({ direction }: { direction: 'toRight' | 'toLeft' | 'down' }) {
  return (
    <div className="relative flex items-center justify-center">
      <ArcConnector direction={direction} />
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-end gap-2">
        <Orb size={9} />
        <Orb size={20} tone="accent" />
        <Orb size={13} />
      </div>
    </div>
  )
}

// Немного шариков просто в фоне секции — не привязаны к карточкам или стрелкам,
// разбросаны по всей высоте, чтобы оживить пустые места. Каждый мягко дрейфует
// (animate-glow-drift), delay/duration разные — чтобы не двигались синхронно.
const BACKGROUND_ORBS: { top: string; left: string; size: number; tone?: OrbTone; delay: number; duration: number }[] = [
  { top: '3%', left: '47%', size: 13, tone: 'white', delay: 0, duration: 15 },
  { top: '5%', left: '76%', size: 8, tone: 'primary', delay: 4.1, duration: 16 },
  { top: '7%', left: '11%', size: 11, tone: 'accent', delay: 8.4, duration: 14 },
  { top: '9%', left: '22%', size: 9, tone: 'secondary', delay: 3.4, duration: 18 },
  { top: '12%', left: '58%', size: 7, delay: 6.1, duration: 13 },
  { top: '14%', left: '93%', size: 20, tone: 'accent', delay: 1.2, duration: 16 },
  { top: '17%', left: '38%', size: 12, tone: 'white', delay: 9.3, duration: 17 },
  { top: '19%', left: '65%', size: 8, tone: 'primary', delay: 5.6, duration: 13 },
  { top: '22%', left: '82%', size: 10, tone: 'secondary', delay: 2.4, duration: 19 },
  { top: '24%', left: '6%', size: 10, delay: 2.1, duration: 17 },
  { top: '27%', left: '49%', size: 15, tone: 'accent', delay: 7.8, duration: 15 },
  { top: '30%', left: '78%', size: 14, tone: 'white', delay: 6.8, duration: 14 },
  { top: '33%', left: '24%', size: 8, tone: 'primary', delay: 3.1, duration: 18 },
  { top: '35%', left: '53%', size: 16, tone: 'primary', delay: 0.8, duration: 19 },
  { top: '38%', left: '95%', size: 9, tone: 'white', delay: 9.7, duration: 13 },
  { top: '41%', left: '30%', size: 11, tone: 'secondary', delay: 4.3, duration: 15 },
  { top: '44%', left: '68%', size: 13, tone: 'accent', delay: 1.9, duration: 17 },
  { top: '47%', left: '90%', size: 11, delay: 7.5, duration: 16 },
  { top: '50%', left: '42%', size: 8, tone: 'white', delay: 5.4, duration: 14 },
  { top: '52%', left: '17%', size: 19, tone: 'accent', delay: 2.9, duration: 18 },
  { top: '55%', left: '73%', size: 10, tone: 'secondary', delay: 8.8, duration: 15 },
  { top: '58%', left: '13%', size: 22, tone: 'accent', delay: 5.2, duration: 14 },
  { top: '61%', left: '88%', size: 12, tone: 'primary', delay: 0.5, duration: 19 },
  { top: '63%', left: '61%', size: 9, tone: 'white', delay: 1.6, duration: 17 },
  { top: '66%', left: '27%', size: 14, tone: 'secondary', delay: 6.5, duration: 13 },
  { top: '69%', left: '46%', size: 9, tone: 'primary', delay: 8.1, duration: 15 },
  { top: '72%', left: '7%', size: 11, tone: 'white', delay: 3.9, duration: 18 },
  { top: '74%', left: '85%', size: 13, tone: 'secondary', delay: 3.7, duration: 19 },
  { top: '77%', left: '57%', size: 8, tone: 'accent', delay: 9.1, duration: 16 },
  { top: '80%', left: '86%', size: 15, delay: 0.3, duration: 16 },
  { top: '83%', left: '20%', size: 10, tone: 'primary', delay: 5.9, duration: 14 },
  { top: '85%', left: '35%', size: 10, tone: 'white', delay: 6.2, duration: 13 },
  { top: '88%', left: '66%', size: 12, tone: 'secondary', delay: 2.7, duration: 18 },
  { top: '91%', left: '9%', size: 12, delay: 4.9, duration: 18 },
  { top: '93%', left: '92%', size: 9, tone: 'accent', delay: 7.9, duration: 15 },
  { top: '95%', left: '70%', size: 8, tone: 'primary', delay: 2.5, duration: 15 },
  { top: '97%', left: '31%', size: 14, tone: 'white', delay: 1.1, duration: 17 },
  { top: '98%', left: '55%', size: 18, tone: 'accent', delay: 7.2, duration: 17 },
]

// Насколько далеко курсор ещё «цепляет» шарик и на сколько пикселей утягивает.
const ORB_PULL_RADIUS = 340
const ORB_PULL_STRENGTH = 34

function BackgroundOrbs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbRefs = useRef<(HTMLSpanElement | null)[]>([])
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function update() {
      frame.current = null
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const p = pointer.current

      BACKGROUND_ORBS.forEach((orb, i) => {
        const el = orbRefs.current[i]
        if (!el) return

        let x = 0
        let y = 0
        if (p) {
          // Опорная точка считается из процентов, а не из getBoundingClientRect:
          // иначе к позиции примешался бы уже применённый transform и притяжение
          // само себя раскачивало бы.
          const baseX = rect.left + (parseFloat(orb.left) / 100) * rect.width
          const baseY = rect.top + (parseFloat(orb.top) / 100) * rect.height
          const dx = p.x - baseX
          const dy = p.y - baseY
          const distance = Math.hypot(dx, dy)
          if (distance > 1 && distance < ORB_PULL_RADIUS) {
            const pull = (1 - distance / ORB_PULL_RADIUS) * ORB_PULL_STRENGTH
            x = (dx / distance) * pull
            y = (dy / distance) * pull
          }
        }
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      })
    }

    function schedule() {
      if (frame.current === null) frame.current = requestAnimationFrame(update)
    }

    function onPointerMove(e: PointerEvent) {
      pointer.current = { x: e.clientX, y: e.clientY }
      schedule()
    }

    function onPointerOut(e: PointerEvent) {
      // Курсор ушёл за пределы окна — отпускаем шарики по домам.
      if (e.relatedTarget === null) {
        pointer.current = null
        schedule()
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerOut)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div ref={containerRef} aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      {BACKGROUND_ORBS.map((orb, i) => (
        <div key={i} className="absolute" style={{ top: orb.top, left: orb.left }}>
          {/* Три слоя трансформаций, чтобы они не затирали друг друга:
              позиция (этот div) → притяжение к курсору (span ниже) → дрейф (Orb). */}
          <span
            ref={(el) => {
              orbRefs.current[i] = el
            }}
            className="block transition-transform duration-500 ease-out will-change-transform"
          >
            <Orb size={orb.size} tone={orb.tone} animate delay={orb.delay} duration={orb.duration} />
          </span>
        </div>
      ))}
    </div>
  )
}

function GapLabelCard({ gap }: { gap: TreatmentTimelineGapLabel }) {
  const Icon = gap.icon ? iconMap[gap.icon] : null

  return (
    <div className="flex items-center gap-2 rounded-full border border-dashed border-accent/40 bg-[color-mix(in_oklch,var(--card),var(--accent)_8%)] px-4 py-2 text-sm text-accent">
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
    <>
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
      <BackgroundOrbs />
      <div className="relative">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-(--panel-eyebrow)">Путь пациента</span>
            {/* Только этот h2 — белый, а не --panel-heading: у крупного bold-заголовка
                контраст с indigo-фоном достаточный, в отличие от мелких заголовков
                карточек ниже, которым нужен тёмный текст. */}
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white [text-shadow:0_1px_10px_rgb(20_16_60/0.3)]">
              Этапы лечения
            </h2>
            <p className="max-w-xl text-pretty text-(--panel-body)">
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
                stroke="var(--accent)"
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
                      <GapConnector direction="down" />
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
                      <GapConnector direction={isLeft ? 'toRight' : 'toLeft'} />
                    )
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
