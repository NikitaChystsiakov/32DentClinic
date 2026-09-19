import Link from 'next/link'
import { ArrowRight, Crosshair, Grid3x3, Grip, LayoutGrid, Layers, Timer, Zap, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { getProtocolPricing, type ImplantProtocol } from '@/config/implantation'

// Иконки протоколов по имени из config/implantation.ts. Новый протокол с
// новой иконкой — добавьте её сюда, иначе карточка отрисуется без значка.
export const protocolIconMap: Record<string, LucideIcon> = {
  Zap,
  Grid3x3,
  Timer,
  LayoutGrid,
  Grip,
  Layers,
  Crosshair,
}

export function formatProtocolPrice(protocol: ImplantProtocol, citySlug: string) {
  const pricing = getProtocolPricing(protocol, citySlug)
  if (!pricing) return null
  return pricing.from === null ? 'по расчёту' : `от ${pricing.from.toLocaleString('ru-RU')} р.`
}

/**
 * Карточка протокола имплантации: одна и та же в блоке «Виды имплантации»
 * на главной и на хабе раздела. Картинки нет намеренно — иллюстрации
 * протоколов живут на страницах протоколов, а в сетке из семи карточек
 * иконка и цена читаются быстрее.
 *
 * `compact` — на телефоне карточка ложится в строку: иконка слева, текст и
 * цена справа. Семь вертикальных карточек подряд на 400px растягивали хаб
 * на четыре экрана; в строке они вдвое ниже. С sm раскладка обычная.
 */
export function ProtocolCard({
  protocol,
  citySlug,
  compact = false,
  className,
}: {
  protocol: ImplantProtocol
  citySlug: string
  compact?: boolean
  className?: string
}) {
  const Icon = protocolIconMap[protocol.icon]
  const price = formatProtocolPrice(protocol, citySlug)

  return (
    <Link
      href={`/${citySlug}/uslugi/implantaciya/${protocol.slug}/`}
      className={cn(
        'group flex h-full rounded-2xl bg-card ring-1 ring-primary/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/30',
        compact ? 'flex-row items-start gap-3 p-4 sm:flex-col sm:gap-4 sm:p-5' : 'flex-col gap-4 p-5',
        className
      )}
    >
      <div className={cn('flex items-start justify-between gap-3', compact && 'sm:w-full')}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {Icon && <Icon className="size-5" />}
        </span>
        {price && (
          <span
            className={cn(
              'shrink-0 rounded-full bg-(--panel-lavender) px-2.5 py-1 text-xs font-semibold text-primary',
              compact && 'hidden sm:inline'
            )}
          >
            {price}
          </span>
        )}
      </div>

      <div className={cn('flex min-w-0 flex-1 flex-col gap-1.5', compact && 'sm:w-full')}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-heading text-lg leading-snug font-bold text-balance text-foreground">
            {protocol.shortName}
          </h3>
          {price && compact && (
            <span className="shrink-0 text-xs font-semibold text-primary sm:hidden">{price}</span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{protocol.cardDescription}</p>
        <span
          className={cn(
            'mt-auto inline-flex w-fit items-center gap-1 pt-2 text-sm font-medium text-primary transition-[gap] duration-300 group-hover:gap-2',
            compact && 'hidden sm:inline-flex'
          )}
        >
          Подробнее
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}
