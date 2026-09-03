'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCity } from '@/lib/contexts/city-context'

const TILES = [
  {
    src: '/clinic/reception.jpg',
    alt: 'Ресепшн клиники 32Дент',
    className: 'col-span-2 row-span-2 aspect-square',
  },
  { src: '/clinic/office.jpg', alt: 'Лечебный кабинет 32Дент', className: 'aspect-square' },
  { src: '/clinic/equipment.jpg', alt: 'Оборудование клиники 32Дент', className: 'aspect-square' },
  { src: '/clinic/office2.jpg', alt: 'Холл клиники 32Дент', className: 'aspect-square' },
  { src: '/clinic/laboratory.jpg', alt: 'Зуботехническая лаборатория 32Дент', className: 'aspect-square' },
]

export function ClinicGallerySection() {
  const { city } = useCity()

  return (
    <>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary">Внутри клиники</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Территория 32Дент</h2>
          {/* Без «собственная лаборатория»: у Минска лаборатория — партнёр,
              а не часть клиники (см. content/minsk.ts → about.laboratory).
              Формулировка нейтральная, чтобы не быть ложной ни для одного
              города, а не city-aware — это декоративный тизер, не заявление. */}
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Современное оборудование и кабинеты, в которых комфортно и взрослым, и детям.
          </p>
        </div>
        <Button
          variant="silver"
          className="w-fit"
          render={<Link href={`/${city.slug}/o-nas/`} />}
          nativeButton={false}
        >
          Больше фото и о клинике
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TILES.map((tile) => (
          <div
            key={tile.src}
            className={`group relative overflow-hidden rounded-xl ring-1 ring-silver/25 ${tile.className}`}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </>
  )
}
