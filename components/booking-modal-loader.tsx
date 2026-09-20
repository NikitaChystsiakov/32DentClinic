'use client'

import * as React from 'react'

import { useBookingModal } from '@/components/booking-modal-provider'

/*
 * Модалка записи — самый тяжёлый клиентский кусок сайта (base-ui Dialog и
 * Select, форма, список врачей — ~60 КБ gz в четырёх чанках). Раньше
 * React.lazy стоял в дереве всегда, и чанки тянулись сразу после гидрации
 * на каждой странице, хотя до клика по «Записаться» они не нужны: PageSpeed
 * записывал их в «неиспользуемый JS», а на мобильном они шли в общей очереди
 * с картинками первого экрана.
 *
 * Теперь компонент монтируется при первом открытии и дальше живёт в дереве
 * (чтобы закрытие/повторное открытие анимировались как обычно). Чтобы при
 * первом тапе не ждать сеть, модуль подтягивается заранее при первом же
 * действии посетителя — касании, клике или клавише; на телефоне это обычно
 * первый скролл, и к моменту нажатия на кнопку код уже на месте.
 */
const loadBookingModal = () => import('@/components/booking-modal')

const BookingModal = React.lazy(() =>
  loadBookingModal().then((mod) => ({ default: mod.BookingModal }))
)

const WARMUP_EVENTS = ['pointerdown', 'touchstart', 'keydown'] as const

export function BookingModalLoader() {
  const { isOpen } = useBookingModal()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) setMounted(true)
  }, [isOpen])

  React.useEffect(() => {
    if (mounted) return
    let done = false
    const warmUp = () => {
      if (done) return
      done = true
      for (const type of WARMUP_EVENTS) window.removeEventListener(type, warmUp)
      void loadBookingModal()
    }
    for (const type of WARMUP_EVENTS) {
      window.addEventListener(type, warmUp, { passive: true })
    }
    return () => {
      for (const type of WARMUP_EVENTS) window.removeEventListener(type, warmUp)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <React.Suspense fallback={null}>
      <BookingModal />
    </React.Suspense>
  )
}
