import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { CaseCard } from '@/components/gallery/case-card'
import { getGalleryItemsForCity, hasRealCasesForCity } from '@/lib/data/before-after'
import type { City } from '@/config/cities'

// Две карточки в ряд: вариант с тремя показывали на живых людях в A/B и
// он проиграл (сентябрь 2026) — карточка становилась слишком узкой.
/*
 * Серверный компонент: город и контент приходят пропсами от страницы, а не
 * из useCity(). Так секция рендерится один раз при сборке и не попадает в
 * клиентский JS — интерактивных частей в ней нет (кнопки записи и ссылки
 * остаются клиентскими островками сами по себе).
 */
export function BeforeAfterTeaserSection({ city }: { city: City }) {
  const items = getGalleryItemsForCity(city.slug)
  const real = hasRealCasesForCity(city.slug)

  return (
    <>
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm font-medium text-(--panel-eyebrow)">Портфолио</span>
        {/* Не «наши результаты»: результат лечения обещать нельзя (ст. 15
            Закона «О рекламе»), показываем работу, а не эффект. */}
        <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
          Работы наших врачей
        </h2>
        <p className="max-w-2xl text-pretty text-(--panel-body)">
          {real
            ? `Работы клиники ${city.brandName}. Передвиньте ползунок, чтобы сравнить «до» и «после». План лечения и его итог зависят от исходной ситуации и определяются врачом после осмотра.`
            : 'Передвиньте ползунок, чтобы сравнить «до» и «после». План лечения и его итог зависят от исходной ситуации и определяются врачом после осмотра.'}
        </p>
      </div>

      <Carousel opts={{ align: 'start', loop: true }} className="px-1 sm:px-12">
        <CarouselContent>
          {items.map((entry) => (
            <CarouselItem key={entry.item.id} className="basis-[88%] sm:basis-1/2">
              <CaseCard entry={entry} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden left-0 sm:flex" />
        <CarouselNext className="hidden right-0 sm:flex" />
      </Carousel>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" render={<Link href={`/${city.slug}/primery-rabot/`} />} nativeButton={false}>
          Смотреть все примеры
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </>
  )
}
