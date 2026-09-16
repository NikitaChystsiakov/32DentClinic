"use client"

import { Send } from "lucide-react"

import { ViberIcon } from "@/components/icons/viber-icon"
import { useCurrentCity } from "@/lib/hooks/use-current-city"
import { telegramHref, viberChatHref } from "@/lib/messengers"

export function FloatingMessengers() {
  // Viber — чат с клиникой текущего города. Раньше здесь висел WhatsApp с
  // рогачёвским номером на всех страницах, включая Минск и Жлобин, хотя
  // Рогачёв заявки с сайта не обрабатывает. На страницах сети (нет города)
  // остаётся только Telegram сети.
  const city = useCurrentCity()

  return (
    // Только с lg. На телефоне эти кнопки висели над нижней панелью, рядом
    // с поднятым бургером — угол экрана превращался в кашу из трёх кружков
    // поверх контента. Мессенджеры переехали в мобильное меню
    // (mobile-menu-provider.tsx), где у них есть подписи.
    <div className="fixed right-4 bottom-6 z-40 hidden flex-col gap-3 lg:flex">
      {city && (
        <a
          href={viberChatHref(city)}
          aria-label="Написать в Viber"
          title="Написать в Viber"
          className="group flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-accent/40 focus-visible:outline-none"
        >
          <ViberIcon className="size-5" />
        </a>
      )}
      <a
        href={telegramHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в Telegram"
        title="Написать в Telegram"
        className="group flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
      >
        <Send className="size-5" />
      </a>
    </div>
  )
}
