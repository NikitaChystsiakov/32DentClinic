"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

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
      className="relative aspect-[4/3] w-full touch-none overflow-hidden rounded-xl border border-border bg-muted select-none"
      onPointerDownCapture={(e) => {
        e.stopPropagation()
        dragging.current = true
        setFromClientX(e.clientX)
      }}
      onMouseDownCapture={(e) => e.stopPropagation()}
      onTouchStartCapture={(e) => e.stopPropagation()}
      onTouchMoveCapture={(e) => e.stopPropagation()}
    >
      {/* After (base) */}
      <Image
        src={after}
        alt="Результат после лечения"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        draggable={false}
      />
      <span className="absolute top-2.5 right-2.5 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground shadow-sm">
        После
      </span>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={before}
          alt="Состояние до лечения"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          draggable={false}
        />
        <span className="absolute top-2.5 left-2.5 rounded-full bg-foreground/80 px-2 py-0.5 text-xs font-medium text-background shadow-sm">
          До
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute inset-y-0 w-0.5 bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-primary shadow-md">
          <ArrowRight className="size-3 -scale-x-100" />
          <ArrowRight className="size-3" />
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