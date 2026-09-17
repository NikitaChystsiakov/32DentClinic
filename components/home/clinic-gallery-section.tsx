'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, X, Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCity } from '@/lib/contexts/city-context'
import type { ClinicPhoto } from '@/config/cities'

// Фото берутся из city.photos.gallery (config/cities.ts): у каждого города
// своя папка public/clinic/<slug>/. Первая плитка — крупная 2×2.

/**
 * Просмотр фотографии во весь экран. Открывается кликом по плитке, закрывается
 * по Esc, по фону и по крестику; стрелками (и кнопками по краям) листается по
 * тому же порядку, что и в сетке.
 *
 * Экспортируется ради галереи в конце «О нас» (about-content.tsx) — там те же
 * плитки {src, alt}, свой просмотр писать незачем.
 */
export function Lightbox({
  tiles,
  index,
  onClose,
  onStep,
}: {
  tiles: ClinicPhoto[]
  index: number
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const tile = tiles[index]

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowLeft') onStep(-1)
      else if (event.key === 'ArrowRight') onStep(1)
    }
    document.addEventListener('keydown', onKeyDown)
    // Страница под открытым просмотром не должна прокручиваться: иначе колесо
    // мыши уводит контент за фотографией, и после закрытия человек оказывается
    // не там, откуда открывал.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, onStep])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tile.alt}
      // Клик по фону закрывает; сама фотография и кнопки клик не пропускают
      // дальше — по ним закрывать не нужно.
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-brand-ink/92 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-200 hover:bg-white/30 sm:top-6 sm:right-6"
      >
        <X className="size-5" />
      </button>

      <button
        type="button"
        aria-label="Предыдущее фото"
        onClick={(event) => {
          event.stopPropagation()
          onStep(-1)
        }}
        className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-200 hover:bg-white/30 sm:left-6"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        aria-label="Следующее фото"
        onClick={(event) => {
          event.stopPropagation()
          onStep(1)
        }}
        className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-200 hover:bg-white/30 sm:right-6"
      >
        <ChevronRight className="size-6" />
      </button>

      {/* object-contain: фотография вписывается целиком, а не обрезается —
          ради этого просмотр и открывают. */}
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative h-full max-h-[80svh] w-full max-w-5xl"
      >
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          sizes="100vw"
          className="rounded-xl object-contain"
          priority
        />
      </div>
      <p className="max-w-2xl text-center text-sm text-white/85">
        {tile.alt} · {index + 1} из {tiles.length}
      </p>
    </div>
  )
}

export function ClinicGallerySection() {
  const { city } = useCity()
  const tiles = city.photos.gallery
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const close = React.useCallback(() => setOpenIndex(null), [])
  const step = React.useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
        current === null ? current : (current + delta + tiles.length) % tiles.length
      )
    },
    [tiles.length]
  )

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
            Современное оборудование и кабинеты, в которых комфортно и взрослым, и детям. Нажмите на
            фото, чтобы открыть его на весь экран.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-fit"
          render={<Link href={`/${city.slug}/o-nas/`} />}
          nativeButton={false}
        >
          Больше фото и о клинике
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile, index) => (
          <button
            key={tile.src}
            type="button"
            aria-label={`Открыть фото: ${tile.alt}`}
            onClick={() => setOpenIndex(index)}
            className={`group relative overflow-hidden rounded-xl ring-1 ring-primary/15 transition-shadow duration-300 hover:shadow-lg hover:ring-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${index === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            {/* Подсказка, что плитка кликабельна: на тач-устройствах её не
                видно, поэтому в подзаголовке секции об этом сказано словами. */}
            <span className="pointer-events-none absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-white/85 text-brand-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Expand className="size-4" />
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && <Lightbox tiles={tiles} index={openIndex} onClose={close} onStep={step} />}
    </>
  )
}
