'use client'

import * as React from 'react'
import Image from 'next/image'
import { Check, Play } from 'lucide-react'

import { BookingButton } from '@/components/booking-button'
import { useCity } from '@/lib/contexts/city-context'

/**
 * Видеообзор клиники: постер с кнопкой play и подводка рядом. Ролик весит
 * десятки мегабайт, поэтому до клика на странице только картинка — сам
 * <video> монтируется по клику и начинает играть (со звуком: это обзор
 * с озвучкой, а не фоновый луп, как в hero-split.tsx). Играет прямо на
 * месте постера — на телефоне нативные контролы дают полный экран сами,
 * отдельный лайтбокс не нужен.
 *
 * Рендерится только если у города задан content.clinicVideo — проверка
 * в app/[city]/page.tsx и about-content.tsx, чтобы не оставлять пустую
 * панель.
 */
export function ClinicVideoSection() {
  const { content } = useCity()
  const video = content.clinicVideo
  const [playing, setPlaying] = React.useState(false)

  if (!video) return null

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
      {/* Обёртка держит 16:9 в обоих состояниях, чтобы при смене постера на
          плеер ничего не прыгало. */}
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-brand-ink shadow-xl ring-1 ring-black/10">
        {playing ? (
          <video
            controls
            autoPlay
            playsInline
            preload="auto"
            poster={video.poster}
            aria-label={video.alt}
            className="size-full object-cover"
          >
            <source src={video.src} type="video/mp4" />
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Смотреть: ${video.alt}`}
            className="group absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={video.poster}
              alt={video.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            {/* Лёгкое затемнение снизу — под подпись длительности; кнопка
                play в центре читается на любом кадре за счёт белой подложки. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),transparent_40%)]"
            />
            <span className="relative flex size-16 items-center justify-center rounded-full bg-white/95 text-(--brand-ink) shadow-lg transition-transform duration-300 group-hover:scale-110 sm:size-20">
              <Play className="ml-1 size-7 fill-current sm:size-8" />
            </span>
            <span className="absolute right-4 bottom-4 rounded-md bg-black/55 px-2 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
              {video.duration}
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium text-(--panel-eyebrow)">Видеоэкскурсия</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
          {video.title}
        </h2>
        <p className="text-pretty text-(--panel-body)">{video.description}</p>
        <ul className="flex flex-col gap-2.5">
          {video.highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-(--panel-heading)">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <BookingButton className="mt-2 w-fit">Записаться на приём</BookingButton>
      </div>
    </div>
  )
}
