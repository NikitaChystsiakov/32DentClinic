import Link from 'next/link'
import { ArrowRight, Crown, Infinity, ShieldCheck, Stethoscope, type LucideIcon } from 'lucide-react'

import { BookingButton } from '@/components/booking-button'
import type { CityContent } from '@/content'

const iconMap: Record<string, LucideIcon> = {
  Infinity,
  Stethoscope,
  Crown,
  ShieldCheck,
}

/**
 * «Гарантия» — отдельный блок, а не строка в «32 причинах»: для имплантации
 * это второй по важности вопрос после цены, и раньше он был размазан по
 * hero, whyUs и FAQ. Набор карточек — из content/<город>.ts → guarantee.
 */
/*
 * Серверный компонент: город и контент приходят пропсами от страницы, а не
 * из useCity(). Так секция рендерится один раз при сборке и не попадает в
 * клиентский JS — интерактивных частей в ней нет (кнопки записи и ссылки
 * остаются клиентскими островками сами по себе).
 */
export function GuaranteeSection({
  content,
  detailsHref,
}: {
  content: CityContent
  /** Страница «Гарантии» города — если клиника опубликовала положение. */
  detailsHref?: string
}) {
  const { guarantee } = content

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center lg:gap-12">
      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium text-(--panel-eyebrow)">{guarantee.eyebrow}</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading) sm:text-4xl">
          {/* «и» не должно оставаться последним словом строки. */}
          {guarantee.title.replace(/ и /g, ' и\u00a0')}
        </h2>
        <p className="text-pretty text-(--panel-body)">{guarantee.subtitle}</p>
        <BookingButton variant="inverse" className="mt-2 w-fit" options={{ service: 'implantaciya' }}>
          Записаться на консультацию
        </BookingButton>
        {detailsHref && (
          <Link
            href={detailsHref}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-(--panel-heading) underline underline-offset-4 hover:no-underline"
          >
            Сроки и условия гарантии
            <ArrowRight className="size-4" />
          </Link>
        )}
        <p className="text-xs text-(--panel-body)/80">{guarantee.note}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        {guarantee.items.map((item, index) => {
          const Icon = iconMap[item.icon]
          // При трёх карточках первая (гарантия на импланты) растянута на две
          // колонки: это главный аргумент блока, и сетка 2×2 иначе оставляла бы
          // пустую ячейку. При двух — обе во всю ширину, друг под другом: в ряд
          // им тесно (подпись «на пломбы, коронки и протезы» вылезала за
          // карточку), а справа от заголовка оставалась пустота.
          const stacked = guarantee.items.length <= 2
          const wide = index === 0 && guarantee.items.length === 3
          return (
            <div
              key={item.label}
              // Две карточки друг под другом встают в строку только с xl: на sm
              // и lg описанию в строке остаётся ~130–160px, а это тесно.
              className={
                stacked
                  ? 'flex flex-col gap-3 rounded-2xl bg-white/85 p-5 ring-1 ring-primary/10 sm:col-span-2 xl:flex-row xl:items-center xl:gap-6'
                  : wide
                    ? 'flex flex-col gap-3 rounded-2xl bg-white/85 p-5 ring-1 ring-primary/10 sm:col-span-2 sm:flex-row sm:items-center sm:gap-6'
                    : 'flex flex-col gap-3 rounded-2xl bg-white/85 p-5 ring-1 ring-primary/10'
              }
            >
              {/* Иконка — внутри <dt>, а не в отдельной обёртке рядом с ним:
                  в <dl> внутри <div> допустимы только <dt> и <dd>, иначе
                  Lighthouse и скринридеры считают список битым. */}
              {/* Карточки друг под другом — <dt> одной ширины (под самую длинную
                  подпись), чтобы описания начинались с одной линии. */}
              <dt className={stacked ? 'flex shrink-0 items-center gap-3 xl:w-72' : 'flex shrink-0 items-center gap-3'}>
                {Icon && (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                )}
                <span className="flex flex-col">
                  <span className="font-heading text-3xl leading-none font-bold text-foreground">{item.value}</span>
                  <span className="mt-1 text-sm font-medium whitespace-nowrap text-primary">{item.label}</span>
                </span>
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{item.description}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
