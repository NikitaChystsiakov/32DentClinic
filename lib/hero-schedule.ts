// Расчёт обратного отсчёта активной акции в hero. Сайт собирается как
// статика, поэтому считать на сервере нельзя — значение застыло бы на дате
// сборки. Считается в браузере через usePromoCountdown (обновление раз в
// минуту); до первого рендера на клиенте таймер не показывается вовсе, чтобы
// разметка сервера и клиента совпадала.
import * as React from 'react'

/** «Осталось 27д 5ч» — или undefined, если акция уже закончилась. */
export function formatPromoCountdown(endsAt: string, now: Date = new Date()): string | undefined {
  const diff = new Date(endsAt).getTime() - now.getTime()
  if (!Number.isFinite(diff) || diff <= 0) return undefined

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  return `Осталось ${days}д ${hours}ч`
}

/** Живой отсчёт до endsAt; undefined — пока не смонтировались или акция прошла. */
export function usePromoCountdown(endsAt: string | undefined): string | undefined {
  const [value, setValue] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (!endsAt) {
      setValue(undefined)
      return
    }
    const tick = () => setValue(formatPromoCountdown(endsAt))
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [endsAt])

  return value
}
