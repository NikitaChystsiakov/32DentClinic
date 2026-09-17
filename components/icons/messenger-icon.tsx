import { Send } from 'lucide-react'

import { ViberIcon } from '@/components/icons/viber-icon'
import type { MessengerId } from '@/lib/messengers'

/*
 * Знаки мессенджеров. Telegram — <Send/> из lucide, Viber — маска по
 * фирменному знаку (viber-icon.tsx). WhatsApp и MAX — тоже фирменные
 * заливочные знаки, чтобы читались с первого взгляда: WhatsApp — из
 * Simple Icons (по бренд-гайду Meta), MAX — логотип-«пузырь» с max.ru.
 * Оба залиты currentColor и вписаны с полями ~15 % (viewBox шире фигуры),
 * чтобы оптически совпадать с соседними lucide-иконками. Размер задаётся
 * снаружи через className (size-4 / size-5).
 *
 * Чтобы заменить знак своим: положите SVG-путь сюда (viewBox под него) или
 * PNG в public/images/ и сделайте маску по образцу .viber-glyph в
 * app/globals.css.
 */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="-1.5 -1.5 27 27" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

function MaxIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="-8 -8 116 116" fill="currentColor" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M50.76 0c27.53 0 49.12 22.34 49.12 49.89S77.61 99.23 51.02 99.23c-9.43 0-14.01-1.33-21.37-6.54-.5-.36-1.2-.26-1.63.19-5.66 6.04-20.17 10.28-20.83 2.03C7.19 80.53 0 71.18 0 49.61 0 21.3 23.22 0 50.76 0m.77 24.55c-13.07-.68-23.26 8.39-25.51 22.58-1.86 11.75 1.44 26.07 4.26 26.8 1.2.3 4.08-1.9 6.18-3.88.4-.37.99-.44 1.45-.15 3.27 2 6.97 3.5 11.05 3.71 13.42.7 25.3-9.8 26-23.21.71-13.42-10.01-25.14-23.43-25.85" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

/** Иконка по id из getMessengerLinks — одна точка выбора для всех блоков. */
export function MessengerIcon({ id, className }: { id: MessengerId; className?: string }) {
  switch (id) {
    case 'viber':
      return <ViberIcon className={className} />
    case 'telegram':
      return <Send className={className} />
    case 'whatsapp':
      return <WhatsAppIcon className={className} />
    case 'instagram':
      return <InstagramIcon className={className} />
    case 'max':
      return <MaxIcon className={className} />
  }
}
