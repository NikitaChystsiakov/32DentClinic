'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingButton } from '@/components/booking-button'
import type { ServiceCategory } from '@/lib/services-data'
import { useCity } from '@/lib/contexts/city-context'

export function ServiceCard({ service }: { service: ServiceCategory }) {
  // Ссылка с городом: без префикса «Подробнее» на /minsk/uslugi/ вело на
  // /uslugi/<slug>/, а .htaccess редиректил это в Рогачёв.
  const { city } = useCity()

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-silver/25 transition-all duration-400 ease-out hover:-translate-y-2 hover:shadow-xl hover:ring-primary/40">
      {/* Обложки услуг — горизонтальные 4:3, 1600×1200 (docs/ИЗОБРАЖЕНИЯ-СГЕНЕРИРОВАТЬ.md). */}
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.shortName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="photo-caption-veil pointer-events-none absolute inset-0" />
        <h3 className="absolute inset-x-0 bottom-0 p-4 font-heading text-lg font-bold text-white drop-shadow-sm">
          {service.shortName}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">{service.cardDescription}</p>
        <span className="font-medium text-foreground">от {service.priceFrom.toLocaleString('ru-RU')} BYN</span>
        {/* На мобильном кнопки стоят столбиком на всю ширину — при штатных
            36 px они выглядели сплюснутыми, поэтому до sm поднимаем до 44 px. */}
        <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row">
          <Button
            variant="outline"
            className="h-11 flex-1 sm:h-9"
            render={<Link href={`/${city.slug}/uslugi/${service.slug}/`} />}
            nativeButton={false}
          >
            Подробнее
            <ArrowRight data-icon="inline-end" />
          </Button>
          <BookingButton
            className="h-11 flex-1 bg-accent text-accent-foreground hover:bg-accent/90 sm:h-9"
            options={{ service: service.slug }}
          >
            Записаться
          </BookingButton>
        </div>
      </div>
    </div>
  )
}
