import { MapPin, Clock, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import type { City } from '@/config/cities'
import type { CityContent } from '@/content'
import { formatCityHours } from '@/lib/format-hours'

/*
 * Серверный компонент: город и контент приходят пропсами от страницы, а не
 * из useCity(). Так секция рендерится один раз при сборке и не попадает в
 * клиентский JS — интерактивных частей в ней нет (кнопки записи и ссылки
 * остаются клиентскими островками сами по себе).
 */
export function ContactCtaSection({ city, content }: { city: City; content: CityContent }) {

  return (
    <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
            Приходите на консультацию
          </h2>
          <p className="text-pretty text-(--panel-body)">
            Расскажем, что можно сделать с вашей ситуацией, и составим план лечения без обязательств.
          </p>
          <div className="flex flex-col gap-3 text-sm text-(--panel-heading)">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-(--panel-body)" />
              <span>{city.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-(--panel-body)" />
              <span>{formatCityHours(content.contacts.hours)}</span>
            </div>
            <a href={city.phoneHref} className="flex items-center gap-2 hover:opacity-80">
              <Phone className="size-4 text-(--panel-body)" />
              <span>{city.phone}</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <BookingButton size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Записаться онлайн
          </BookingButton>
          <Button size="lg" variant="outline" render={<a href={`/${city.slug}/kontakty/`} />} nativeButton={false}>
            Как нас найти
          </Button>
        </div>
    </div>
  )
}
