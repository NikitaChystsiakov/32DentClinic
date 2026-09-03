// Расчёт обратного отсчёта активной акции в hero. Считается на сервере,
// страница пересобирается раз в час (revalidate), чтобы значение не
// «застывало» на времени сборки.

/** «Осталось 27д 5ч» — или undefined, если акция уже закончилась. */
export function formatPromoCountdown(endsAt: string, now: Date = new Date()): string | undefined {
  const diff = new Date(endsAt).getTime() - now.getTime()
  if (!Number.isFinite(diff) || diff <= 0) return undefined

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  return `Осталось ${days}д ${hours}ч`
}
