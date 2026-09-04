'use client'

import { CalendarCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'

/**
 * Блок записи в конце статьи. Вынесен в отдельный клиентский компонент,
 * чтобы сама страница статьи осталась серверной и попала в статику.
 */
export function BookingCta() {
  const { openBookingModal } = useBookingModal()

  return (
    <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl bg-[linear-gradient(140deg,var(--hero-surface),var(--hero-surface-accent))] p-6 text-white sm:p-8">
      <h2 className="font-heading text-xl font-bold text-balance">Остались вопросы о лечении?</h2>
      <p className="text-pretty leading-relaxed text-white/75">
        Статья описывает общий случай. Что подойдёт именно вам, врач скажет после осмотра —
        консультация бесплатна.
      </p>
      <Button
        size="lg"
        onClick={() => openBookingModal()}
        className="mt-1 bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <CalendarCheck data-icon="inline-start" />
        Записаться на приём
      </Button>
    </div>
  )
}
