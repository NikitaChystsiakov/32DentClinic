'use client'

import { CalendarCheck } from 'lucide-react'

import { BookingButton } from '@/components/booking-button'

/**
 * Блок записи в конце статьи. Вынесен в отдельный клиентский компонент,
 * чтобы сама страница статьи осталась серверной и попала в статику.
 */
export function BookingCta() {

  return (
    <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl bg-[linear-gradient(140deg,var(--hero-surface),var(--hero-surface-accent))] p-6 text-white sm:p-8">
      <h2 className="font-heading text-xl font-bold text-balance">Остались вопросы о лечении?</h2>
      <p className="text-pretty leading-relaxed text-white/90">
        Статья описывает общий случай. Что подойдёт именно вам, врач скажет после осмотра
        в клинике вашего города.
      </p>
      <BookingButton size="lg" variant="inverse" className="mt-1">
        <CalendarCheck data-icon="inline-start" />
        Записаться на приём
      </BookingButton>
    </div>
  )
}
