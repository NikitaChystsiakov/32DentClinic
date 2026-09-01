'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

interface ParticleFieldProps {
  className?: string
  particleCount?: number
  /** CSS colors, may reference custom properties like 'var(--silver)'. */
  colors?: string[]
  minSize?: number
  maxSize?: number
  speed?: number
  /** How strongly particles drift toward the cursor within `hoverRadius`. */
  hoverPull?: number
  hoverRadius?: number
}

/**
 * Very light decorative particle field on a 2D canvas — no WebGL, no extra
 * dependencies. Particles drift slowly and lean gently toward the cursor.
 * Pauses off-screen and respects prefers-reduced-motion.
 */
export function ParticleField({
  className,
  particleCount = 46,
  colors = ['var(--silver)', 'var(--primary)', 'var(--accent)'],
  minSize = 0.8,
  maxSize = 2.4,
  speed = 0.12,
  hoverPull = 0.35,
  hoverRadius = 150,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let raf = 0
    let visible = true
    const mouse = { x: -9999, y: -9999 }

    function resolveColor(c: string) {
      if (!c.startsWith('var(')) return c
      const name = c.slice(4, -1).trim()
      const resolved = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      return resolved || '#9aa1ab'
    }

    function init() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const resolved = colors.map(resolveColor)
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: minSize + Math.random() * (maxSize - minSize),
        color: resolved[Math.floor(Math.random() * resolved.length)],
        alpha: 0.35 + Math.random() * 0.4,
      }))
    }

    function tick() {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      ctx!.clearRect(0, 0, width, height)

      for (const p of particles) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < hoverRadius && dist > 0.01) {
          p.x += (dx / dist) * hoverPull
          p.y += (dy / dist) * hoverPull
        }

        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.color
        ctx!.globalAlpha = p.alpha
        ctx!.fill()
      }
      ctx!.globalAlpha = 1
    }

    function handleMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function handleLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    init()

    const resizeObserver = new ResizeObserver(() => init())
    resizeObserver.observe(canvas)

    const themeObserver = new MutationObserver(() => init())
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)

    const container = canvas.parentElement
    container?.addEventListener('pointermove', handleMove)
    container?.addEventListener('pointerleave', handleLeave)

    if (!prefersReducedMotion) raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      io.disconnect()
      container?.removeEventListener('pointermove', handleMove)
      container?.removeEventListener('pointerleave', handleLeave)
    }
  }, [particleCount, colors, minSize, maxSize, speed, hoverPull, hoverRadius])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
