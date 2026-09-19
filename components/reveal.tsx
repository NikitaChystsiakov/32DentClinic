'use client'

import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

/*
 * Плавное появление блоков при прокрутке — на CSS, а не на `motion`.
 *
 * Раньше это был motion.div с initial="hidden": на сервере он рендерился со
 * style="opacity:0", и пока не загрузятся ~340 КБ JS, страница стояла
 * пустой — включая hero с H1. PageSpeed на мобильном давал LCP 6 с.
 *
 * Теперь HTML приходит полностью видимым. После гидрации прячем только то,
 * что ниже первого экрана, и показываем IntersectionObserver-ом (стили —
 * [data-reveal] в globals.css). Блоки, которые уже в кадре, не трогаем
 * вовсе: первый экран не должен «моргать», и именно он считается в LCP.
 * Без JS и при prefers-reduced-motion всё просто видно.
 *
 * Состояние держим в data-атрибуте, а не в className: React при
 * ре-рендере перезаписывает className целиком и стёр бы наш класс. Когда
 * переход отыграл, атрибут снимаем — дальше элемент живёт по своим
 * transition-утилитам (например, наклон карточки в treatment-steps.tsx).
 *
 * На странице таких блоков ~40, и все их эффекты срабатывают подряд после
 * гидрации. Если каждый сам мерил getBoundingClientRect() и тут же ставил
 * атрибут, браузер пересчитывал бы layout 40 раз (чтение → запись →
 * чтение…). Поэтому регистрация идёт через общую очередь: один проход
 * чтений, затем один проход записей, и один IntersectionObserver на всех.
 */

type Pending = { el: HTMLElement; delaySeconds: number }

let queue: Pending[] = []
let scheduled = false
let observer: IntersectionObserver | null = null
const enterHandlers = new WeakMap<Element, () => void>()

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          enterHandlers.get(entry.target)?.()
          enterHandlers.delete(entry.target)
          observer?.unobserve(entry.target)
        }
      },
      // Как у motion viewport={{ margin: '-80px' }}: блок «входит», когда
      // на 80px зашёл в экран, а не по первому пикселю.
      { rootMargin: '-80px 0px' },
    )
  }
  return observer
}

function flush() {
  scheduled = false
  const batch = queue
  queue = []
  const viewportHeight = window.innerHeight
  // Сначала все измерения — layout считается один раз.
  const below = batch.filter(({ el }) => el.isConnected && el.getBoundingClientRect().top >= viewportHeight)
  // Потом все записи.
  for (const { el, delaySeconds } of below) {
    el.style.setProperty('--reveal-delay', `${delaySeconds}s`)
    el.dataset.reveal = 'pending'
    enterHandlers.set(el, () => {
      const onEnd = (e: TransitionEvent) => {
        if (e.target !== el || e.propertyName !== 'opacity') return
        delete el.dataset.reveal
        el.removeEventListener('transitionend', onEnd)
      }
      el.addEventListener('transitionend', onEnd)
      el.dataset.reveal = 'in'
    })
    getObserver().observe(el)
  }
}

export function useReveal(ref: RefObject<HTMLElement | null>, delaySeconds = 0) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    queue.push({ el, delaySeconds })
    if (!scheduled) {
      scheduled = true
      requestAnimationFrame(flush)
    }
    return () => {
      queue = queue.filter((item) => item.el !== el)
      enterHandlers.delete(el)
      observer?.unobserve(el)
    }
  }, [ref, delaySeconds])
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  /** Шаг задержки каскада, как раньше в motion: delay × 80 мс. */
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'span'
}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveal(ref, delay * 0.08)

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  )
}
