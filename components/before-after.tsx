"use client"

import * as React from "react"
import { Clock, Wallet, Stethoscope, ArrowRight } from "lucide-react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LinkButton } from "@/components/link-button"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

type Case = {
  id: string
  category: string
  before: string
  after: string
  procedure: string
  duration: string
  cost: string
}

export const CASES: Case[] = [
  {
    id: "all-on-4",
    category: "All-on-4 / All-on-6",
    before: "/cases/case-1-before.png",
    after: "/cases/case-1-after.png",
    procedure: "Полное протезирование на 4 имплантах",
    duration: "1 день (временный протез)",
    cost: "от 290 000 ₽",
  },
  {
    id: "single",
    category: "Одиночная имплантация",
    before: "/cases/case-2-before.png",
    after: "/cases/case-2-after.png",
    procedure: "Имплант Nobel Biocare + коронка",
    duration: "3–4 месяца",
    cost: "от 45 000 ₽",
  },
  {
    id: "veneers",
    category: "Виниры E-max",
    before: "/cases/case-3-before.png",
    after: "/cases/case-3-after.png",
    procedure: "10 керамических виниров E-max",
    duration: "2–3 недели",
    cost: "от 340 000 ₽",
  },
]

export function Compare({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = React.useState(50)
  const ref = React.useRef<HTMLDivElement>(null)
  const dragging = React.useRef(false)

  const setFromClientX = React.useCallback((clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, next)))
  }, [])

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return
      setFromClientX(e.clientX)
    }
    const onUp = () => (dragging.current = false)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [setFromClientX])

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full touch-none overflow-hidden rounded-2xl border border-border bg-muted select-none"
      onPointerDown={(e) => {
        dragging.current = true
        setFromClientX(e.clientX)
      }}
    >
      {/* After (base) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt="Результат после лечения"
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <span className="absolute top-3 right-3 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground shadow-sm">
        После
      </span>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt="Состояние до лечения"
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
        <span className="absolute top-3 left-3 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background shadow-sm">
          До
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 w-0.5 bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-primary shadow-md">
          <ArrowRight className="size-3.5 -scale-x-100" />
          <ArrowRight className="size-3.5" />
        </span>
      </div>

      <label className="sr-only" htmlFor={`compare-${before}`}>
        Сравнение до и после
      </label>
      <input
        id={`compare-${before}`}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
        aria-label="Передвиньте, чтобы сравнить до и после"
      />
    </div>
  )
}

export function BeforeAfter() {
  return (
    <section id="before-after" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Результаты лечения"
          title="Реальные результаты наших пациентов"
          subtitle="Передвиньте ползунок, чтобы увидеть, как меняется улыбка после лечения в DENT PRO."
        />

        <Reveal delay={1}>
          <Tabs defaultValue={CASES[0].id} className="mt-12">
            <TabsList className="mx-auto flex h-auto flex-wrap justify-center gap-1 p-1.5">
              {CASES.map((c) => (
                <TabsTrigger key={c.id} value={c.id} className="h-9 px-4">
                  {c.category}
                </TabsTrigger>
              ))}
            </TabsList>

            {CASES.map((c) => (
              <TabsContent key={c.id} value={c.id} className="mt-8">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <Compare before={c.before} after={c.after} />

                  <div className="max-w-md">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {c.category}
                    </span>
                    <h3 className="mt-4 font-heading text-2xl font-bold text-foreground">
                      {c.procedure}
                    </h3>
                    <dl className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <Stethoscope className="size-5" />
                        </span>
                        <div>
                          <dt className="text-xs text-muted-foreground">Процедура</dt>
                          <dd className="text-sm font-medium text-foreground">{c.procedure}</dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <Clock className="size-5" />
                        </span>
                        <div>
                          <dt className="text-xs text-muted-foreground">Срок лечения</dt>
                          <dd className="text-sm font-medium text-foreground">{c.duration}</dd>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <Wallet className="size-5" />
                        </span>
                        <div>
                          <dt className="text-xs text-muted-foreground">Стоимость под ключ</dt>
                          <dd className="text-sm font-medium text-foreground">{c.cost}</dd>
                        </div>
                      </div>
                    </dl>
                    <LinkButton
                      href="#lead"
                      size="lg"
                      className="mt-6 h-12 px-6 text-sm font-medium"
                    >
                      Хочу такой результат
                      <ArrowRight className="size-4" data-icon="inline-end" />
                    </LinkButton>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  )
}
