import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import { ProtocolCard, formatProtocolPrice } from '@/components/implantation/protocol-card'
import { getProtocolsForCity, implantBrands } from '@/config/implantation'
import type { City } from '@/config/cities'

/**
 * «Виды имплантации» — первый блок после hero на главной города. Именно
 * здесь, а не в общем списке услуг, потому что имплантация — главное
 * направление сети: человек, пришедший за имплантами, должен за один экран
 * увидеть, что клиника делает и от какой цены.
 */
/*
 * Серверный компонент: город и контент приходят пропсами от страницы, а не
 * из useCity(). Так секция рендерится один раз при сборке и не попадает в
 * клиентский JS — интерактивных частей в ней нет (кнопки записи и ссылки
 * остаются клиентскими островками сами по себе).
 */
export function ImplantTypesSection({ city }: { city: City }) {
  const protocols = getProtocolsForCity(city.slug)
  if (protocols.length === 0) return null

  const ctaSpanClass = ['lg:col-span-3', 'lg:col-span-2', ''][protocols.length % 3]
  const single = protocols.find((p) => p.slug === 'odinochnyj-implant')
  const singlePrice = single ? formatProtocolPrice(single, city.slug) : null
  const brands = implantBrands.map((b) => b.name).join(' и ')

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <span className="text-sm font-medium text-(--panel-eyebrow)">Главное направление</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading) sm:text-4xl">
            Имплантация зубов в {city.nameIn}
          </h2>
          <p className="text-pretty text-(--panel-body)">
            От одного импланта до восстановления всей челюсти по протоколам All-on-4 и All-on-6.
            Ставим импланты {brands}
            {singlePrice && singlePrice !== 'по расчёту' ? (
              <>
                , имплантация одного зуба — <span className="font-semibold text-(--panel-heading)">{singlePrice}</span>
              </>
            ) : (
              '.'
            )}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-fit shrink-0"
          render={<Link href={`/${city.slug}/uslugi/implantaciya/`} />}
          nativeButton={false}
        >
          Всё об имплантации
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {protocols.map((protocol) => (
          <ProtocolCard key={protocol.slug} protocol={protocol} citySlug={city.slug} />
        ))}

        {/* Последняя ячейка — призыв, а не ещё одна карточка: человек, который
            не знает, какой протокол ему нужен, должен найти выход здесь же.
            Ширина — сколько ячеек осталось в последнем ряду (3 колонки на lg),
            чтобы сетка не заканчивалась пустыми клетками. */}
        <div
          className={cn(
            'flex h-full flex-col justify-between gap-4 rounded-2xl bg-primary p-5 text-primary-foreground',
            ctaSpanClass
          )}
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-lg leading-snug font-bold">Не знаете, что подойдёт?</h3>
            <p className="text-sm leading-relaxed text-primary-foreground/85">
              Имплантолог посмотрит 3D-снимок, сравнит варианты и назовёт стоимость до начала лечения.
            </p>
          </div>
          <BookingButton variant="inverse" className="w-fit" options={{ service: 'implantaciya' }}>
            Записаться на консультацию
          </BookingButton>
        </div>
      </div>
    </>
  )
}
