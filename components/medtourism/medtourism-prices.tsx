import Link from 'next/link'
import { ArrowRight, Info } from 'lucide-react'

import { MedTourismHeading } from '@/components/medtourism/medtourism-heading'
import { RUB_RATE_DATE, formatRubFromByn } from '@/config/currency'
import type { MedTourismContent } from '@/content/medtourism'
import { medTourismPriceByn } from '@/lib/medtourism-prices'

/*
 * Цены в рублях. Крупно — рубли (их человек сравнивает с ценами дома),
 * мелко под ними — исходная цена в BYN: прайс клиники белорусский, и
 * подпись под сеткой честно говорит, что рубли — пересчёт для ориентира.
 */
export function MedTourismPrices({ content }: { content: MedTourismContent }) {
  const { prices } = content
  return (
    <>
      <MedTourismHeading eyebrow="Цены" title={prices.title} subtitle={prices.subtitle} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prices.items.map((item) => {
          const byn = medTourismPriceByn(item)
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col gap-2 rounded-2xl bg-card p-5 ring-1 ring-primary/10 transition-all duration-300 ease-out hover:shadow-lg hover:ring-primary/40"
            >
              <h3 className="font-heading text-lg leading-snug font-bold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.note}</p>
              <div className="mt-auto flex flex-col pt-3">
                <span className="font-heading text-2xl font-bold text-primary">
                  от {formatRubFromByn(byn).replace('≈ ', '')}
                </span>
                <span className="text-xs text-muted-foreground">от {byn.toLocaleString('ru-RU')} BYN по прайсу клиники</span>
              </div>
              <span className="inline-flex w-fit items-center gap-1 pt-1 text-sm font-medium text-primary transition-[gap] duration-300 group-hover:gap-2">
                Подробнее
                <ArrowRight className="size-4" />
              </span>
            </Link>
          )
        })}
      </div>
      <p className="mt-6 flex items-start gap-2 text-sm text-(--panel-body)">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          Цены в рублях — пересчёт прайса по курсу Нацбанка Беларуси на {RUB_RATE_DATE}, округлено до 100 ₽. Оплата — в
          белорусских рублях по курсу на день оплаты. Не является публичной офертой.
        </span>
      </p>
    </>
  )
}
