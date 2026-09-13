'use client'

import * as React from 'react'
import { Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import { useCurrentCity } from '@/lib/hooks/use-current-city'

interface BookingOptions {
  service?: string
  doctor?: string
}

/**
 * Единая точка входа для «Записаться». Клиника города может не принимать
 * заявки через сайт (`hasBookingForm: false` в config/cities.ts) — тогда
 * вместо открытия формы возвращается ссылка на телефон клиники. Компоненты
 * не должны решать это сами: получите действие отсюда и отрендерите либо
 * кнопку с onClick, либо <a href>.
 */
export function useBookingAction(options?: BookingOptions) {
  const { openBookingModal } = useBookingModal()
  const city = useCurrentCity()
  const callOnly = city !== null && !city.hasBookingForm

  return {
    /** true — форма для этого города отключена, показываем «Позвонить». */
    callOnly,
    /** Телефон клиники для ссылки tel: (только когда callOnly). */
    phoneHref: callOnly ? city.phoneHref : undefined,
    open: () => openBookingModal(options),
  }
}

type BookingButtonProps = Omit<React.ComponentProps<typeof Button>, 'onClick' | 'render' | 'nativeButton'> & {
  /** Предвыбранная услуга/врач в форме. */
  options?: BookingOptions
  /** Подпись ссылки, когда форма для города отключена. */
  callLabel?: React.ReactNode
  /** Вызывается перед открытием формы или переходом по tel: (закрыть меню и т.п.). */
  onBeforeAction?: () => void
}

/**
 * Кнопка «Записаться». Стиль и размер — как у обычной Button; children —
 * подпись для случая с формой. Для города без формы рендерится ссылка
 * «Позвонить» в том же стиле, чтобы вёрстка не менялась.
 */
export function BookingButton({
  options,
  callLabel = 'Позвонить',
  onBeforeAction,
  children,
  ...buttonProps
}: BookingButtonProps) {
  const { callOnly, phoneHref, open } = useBookingAction(options)

  if (callOnly) {
    return (
      <Button {...buttonProps} render={<a href={phoneHref} onClick={onBeforeAction} />} nativeButton={false}>
        <Phone data-icon="inline-start" />
        {callLabel}
      </Button>
    )
  }

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        onBeforeAction?.()
        open()
      }}
    >
      {children}
    </Button>
  )
}
