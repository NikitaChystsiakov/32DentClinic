'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useCity } from '@/lib/contexts/city-context'
import { getServicesForCity } from '@/config/services'
import { PhotoPlaceholder } from '@/components/photo-placeholder'

// У «Имплантации» в данных вместо фото стоит англоязычная медицинская схема —
// не подходит для сайта. Показываем заглушку, пока не заменят на реальное фото.
const SERVICES_NEEDING_REAL_PHOTO = new Set(['implantaciya'])

export function ServicesOverview() {
  const { city } = useCity()
  const services = getServicesForCity(city.slug)

  /*
   * Одна карусель на все ширины, без второй разметки под десктоп и без
   * matchMedia в JS: с 640px embla выключается собственным брейкпоинтом
   * (active: false), снимает свои инлайновые стили — и тот же контейнер
   * раскладывается обычной CSS-сеткой 2/3 колонки. Так на телефоне это
   * карусель с подглядывающими соседями, а на десктопе прежняя плитка,
   * и при этом в DOM один набор карточек, а не два скрытых друг от друга.
   */
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    skipSnaps: false,
    // Зацикливание нужно не ради бесконечной прокрутки, а ради первого экрана:
    // без него у первой карточки нет соседа слева и вместо «половинки» видно
    // пустое поле панели — то есть ровно та композиция, ради которой карусель
    // и делалась, ломается на самом важном кадре.
    loop: true,
    breakpoints: { '(min-width: 40rem)': { active: false } },
  })
  const [selected, setSelected] = React.useState(0)

  React.useEffect(() => {
    if (!embla) return
    const onSelect = () => setSelected(embla.selectedScrollSnap())
    onSelect()
    embla.on('select', onSelect).on('reInit', onSelect)
    return () => {
      embla.off('select', onSelect).off('reInit', onSelect)
    }
  }, [embla])

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm font-medium text-(--panel-eyebrow)">Направления</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">Что мы лечим</h2>
        <p className="max-w-2xl text-pretty text-(--panel-body)">
          От планового осмотра до сложного протезирования — семь направлений на одной базе, с общей
          историей лечения у каждого пациента.
        </p>
      </div>

      {/* Отрицательные поля только ниже sm: карусель выходит за паддинги
          панели, поэтому соседние карточки видно у самого края экрана —
          иначе «половинки» упирались бы в поле панели и читались как обрезка. */}
      <div ref={emblaRef} className="-mx-5 overflow-hidden px-0 sm:mx-0 sm:overflow-visible">
        <div className="-ml-3 flex sm:ml-0 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {services.map((service, index) => {
            const needsPlaceholder = SERVICES_NEEDING_REAL_PHOTO.has(service.slug)
            const isActive = index === selected
            return (
              <div
                key={service.slug}
                className="min-w-0 shrink-0 grow-0 basis-[72%] pl-3 sm:basis-auto sm:pl-0"
              >
                <Link
                  href={`/${city.slug}/uslugi/${service.slug}/`}
                  // Неактивные карточки на телефоне уменьшены и приглушены —
                  // по ним сразу видно, что это соседи, а не обрезанный контент.
                  // Клик по соседу листает к нему, а не уводит на страницу
                  // услуги (см. onClick ниже): промахнуться пальцем по половинке
                  // карточки слишком легко.
                  onClick={(event) => {
                    if (!embla || isActive) return
                    if (window.matchMedia('(min-width: 40rem)').matches) return
                    event.preventDefault()
                    embla.scrollTo(index)
                  }}
                  className={cn(
                    'group flex h-full origin-center scale-[0.92] flex-col overflow-hidden rounded-2xl bg-card opacity-60 ring-1 ring-primary/10 transition-all duration-300 ease-out',
                    'data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:shadow-xl data-[active=true]:shadow-primary/10 data-[active=true]:ring-primary/25',
                    'sm:scale-100 sm:opacity-100 sm:hover:shadow-lg sm:hover:ring-primary/40'
                  )}
                  data-active={isActive}
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden">
                    {needsPlaceholder ? (
                      <PhotoPlaceholder
                        label={`Фото приёма или оборудования для услуги «${service.shortName}»`}
                        width={1200}
                        height={900}
                        className="h-full rounded-none border-0"
                      />
                    ) : (
                      <Image
                        src={service.image}
                        alt={service.shortName}
                        fill
                        sizes="(max-width: 640px) 72vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out sm:group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    {/* Без flex-wrap: у длинных названий цена срывалась на
                        отдельную строку и высота заголовка гуляла от карточки
                        к карточке. Теперь название переносится внутри себя
                        (min-w-0), а цена остаётся справа на базовой линии
                        первой строки — ряд читается ровно. */}
                    <div className="flex items-baseline justify-between gap-x-3">
                      {/* Заголовок в одном ритме на всех карточках: длинные
                          названия («Проф.гигиена и отбеливание») раньше рвались
                          на четыре строки в узкой плитке 2×N и ломали высоту
                          ряда. Теперь карточка широкая, а text-balance
                          распределяет строки ровно. */}
                      <h3 className="min-w-0 font-heading text-lg leading-snug font-bold text-balance text-foreground">
                        {service.shortName}
                      </h3>
                      <span className="shrink-0 text-sm font-semibold text-primary">
                        от {service.priceFrom} р.
                      </span>
                    </div>

                    {/* Раскрытие активной карточки: сетка 0fr → 1fr вместо
                        max-height, чтобы высота анимировалась ровно по контенту
                        и не приходилось угадывать её в пикселях. С sm описание
                        видно всегда — там карточки не листаются. */}
                    <div
                      data-active={isActive}
                      className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out data-[active=true]:grid-rows-[1fr] sm:grid-rows-[1fr]"
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {service.cardDescription}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-[gap] duration-300 sm:group-hover:gap-2">
                          Подробнее
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Точки — только для карусели: с sm карточки разложены сеткой. */}
      <div className="mt-5 flex justify-center gap-2 sm:hidden">
        {services.map((service, index) => (
          <button
            key={service.slug}
            type="button"
            aria-label={`Показать «${service.shortName}»`}
            aria-current={index === selected}
            onClick={() => embla?.scrollTo(index)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              index === selected ? 'w-6 bg-primary' : 'w-1.5 bg-primary/25'
            )}
          />
        ))}
      </div>
    </>
  )
}
