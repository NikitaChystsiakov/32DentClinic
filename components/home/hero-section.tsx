import Image from 'next/image'
import { Star, ShieldCheck, Calendar, Users2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import type { City } from '@/config/cities'
import type { CityContent } from '@/content'
import { getDoctorsForCity } from '@/config/doctors'
import { formatRating, getMainRatingForCity, reviewsLabel } from '@/lib/data/aggregators'

function pluralizeDoctors(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'врач'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'врача'
  return 'врачей'
}

/*
 * Серверный компонент: город и контент приходят пропсами от страницы, а не
 * из useCity(). Так секция рендерится один раз при сборке и не попадает в
 * клиентский JS — интерактивных частей в ней нет (кнопки записи и ссылки
 * остаются клиентскими островками сами по себе).
 */
export function HeroSection({ city, content }: { city: City; content: CityContent }) {
  const doctorsCount = getDoctorsForCity(city.slug).length
  // Оценка только своего города — в Жлобине рогачёвских «89 отзывов» больше нет.
  const mainRating = getMainRatingForCity(city.slug)

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        {/* Фон — интерьер клиники города (config/cities.ts → photos.hero). */}
        <Image
          src={city.photos.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/45" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Ровно первый экран: 100svh минус залипающая шапка (--header-h, см.
          globals.css). svh, а не vh, — на телефоне vh считается по свёрнутой
          адресной строке, и низ секции уезжал под неё. */}
      <div className="relative mx-auto flex min-h-[calc(100svh-var(--header-h))] max-w-6xl flex-col justify-center gap-8 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-6">
          {mainRating && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-background/70 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-silver/25 backdrop-blur">
              <Star className="size-4 fill-rating text-rating" />
              <span>
                {reviewsLabel(mainRating.reviewsCount)} на {mainRating.name}
              </span>
            </div>
          )}
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {content.hero.title}
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {content.hero.subtitle}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <BookingButton size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Calendar data-icon="inline-start" />
              Записаться на приём
            </BookingButton>
            <Button size="lg" variant="outline" render={<a href={`/${city.slug}/ceny/`} />} nativeButton={false}>
              Смотреть цены
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            <span>Есть противопоказания, необходима консультация специалиста.</span>
          </div>
        </div>

        <div className="flex max-w-2xl flex-wrap items-center gap-x-8 gap-y-4 border-t border-silver/25 pt-6">
          {mainRating && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-heading text-2xl font-bold text-foreground">
                <Star className="size-5 fill-rating text-rating" />
                {formatRating(mainRating.rating)}
              </span>
              <span className="max-w-28 text-xs leading-tight text-muted-foreground">
                рейтинг на {mainRating.name} · {reviewsLabel(mainRating.reviewsCount)}
              </span>
            </div>
          )}
          {mainRating && <div className="h-9 w-px bg-silver/30" />}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-heading text-2xl font-bold text-foreground">
              <Users2 className="size-5 text-secondary" />
              {doctorsCount}
            </span>
            <span className="max-w-28 text-xs leading-tight text-muted-foreground">
              {pluralizeDoctors(doctorsCount)} принимают пациентов в клинике
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}