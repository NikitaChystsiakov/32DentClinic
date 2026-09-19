import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import { getImplantologistsForCity } from '@/config/doctors'
import type { City } from '@/config/cities'

/**
 * «Кто ставит импланты» — персональный блок хирурга-имплантолога на главной.
 * В хирургии доверие к конкретному врачу продаёт сильнее общей карусели
 * команды, поэтому имплантологи показаны отдельно и раньше неё. Пока в
 * городе нет реального имплантолога (Минск и Жлобин до получения данных
 * от клиники), блок не рендерится.
 */
/*
 * Серверный компонент: город и контент приходят пропсами от страницы, а не
 * из useCity(). Так секция рендерится один раз при сборке и не попадает в
 * клиентский JS — интерактивных частей в ней нет (кнопки записи и ссылки
 * остаются клиентскими островками сами по себе).
 */
export function ImplantologistsSection({ city, limit }: { city: City; limit?: number }) {
  // На главной — не больше двух (хирурги-имплантологи), полный список — на
  // хабе имплантации и странице врачей.
  const doctors = getImplantologistsForCity(city.slug).slice(0, limit)
  if (doctors.length === 0) return null

  const isSingle = doctors.length === 1

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm font-medium text-(--panel-eyebrow)">Имплантологи</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
          {isSingle ? 'Кто ставит импланты' : 'Кто ставит импланты в клинике'}
        </h2>
      </div>

      {/* Две колонки только с lg: на md карточка ~260px, обтекание фото
          не помещает рядом даже фамилию. */}
      <div className={isSingle ? 'grid gap-6' : 'grid gap-6 lg:grid-cols-2'}>
        {doctors.map((doctor) => (
          <article
            key={doctor.slug}
            className="flex flex-col gap-5 rounded-2xl bg-card p-5 ring-1 ring-primary/10 sm:p-6"
          >
            {/* Фото врачей квадратные (как в карусели команды и на странице
                врачей), поэтому слот — квадрат ~45% ширины карточки: портрет
                целиком, без обрезки и растягивания. Фото обтекается текстом:
                имя, специализация и стаж стоят рядом с ним, а хвост био
                уходит под фото на всю ширину. Так высота текста ровно та,
                что есть, ничего не режется, и фото не теряется на фоне
                текстовой колонки вдвое выше себя (как было при сетке). Теги
                и кнопки — в подвале, после сброса обтекания. */}
            <div className="flow-root">
              <Link
                href={`/${city.slug}/vrachi/${doctor.slug}/`}
                className="relative mb-4 block aspect-square w-full max-w-64 overflow-hidden rounded-xl sm:float-left sm:mr-5 sm:mb-2 sm:w-[45%] sm:max-w-72"
              >
                <Image
                  src={doctor.photo}
                  alt={doctor.name}
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 256px"
                  className="object-cover"
                />
              </Link>
              <h3 className="font-heading text-xl font-bold leading-tight text-foreground">
                <Link href={`/${city.slug}/vrachi/${doctor.slug}/`} className="hover:text-primary">
                  {doctor.name}
                </Link>
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{doctor.specialization}</p>
              {doctor.experienceYears !== undefined && (
                <p className="mt-1.5 text-sm font-medium text-primary">Стаж {doctor.experienceYears} лет</p>
              )}
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-border/60 pt-4">
              <ul className="flex flex-wrap gap-2">
                {doctor.directions.map((direction) => (
                  <li key={direction.href}>
                    <Link
                      href={`/${city.slug}${direction.href}`}
                      className="inline-flex items-center rounded-full bg-(--panel-lavender) px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {direction.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                <BookingButton
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  options={{ service: 'implantaciya', doctor: doctor.slug }}
                >
                  Записаться к врачу
                </BookingButton>
                <Button
                  variant="outline"
                  render={<Link href={`/${city.slug}/vrachi/${doctor.slug}/`} />}
                  nativeButton={false}
                >
                  О враче
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
