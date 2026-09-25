"use client"

import { MessengerIcon } from "@/components/icons/messenger-icon"
import { MessengerCityPicker, networkMessengers } from "@/components/messenger-city-picker"
import { useCurrentCity } from "@/lib/hooks/use-current-city"
import { getMessengerLinks } from "@/lib/messengers"

export function FloatingMessengers() {
  // Мессенджеры клиники текущего города из config/cities.ts (без Instagram —
  // это не «написать»). Раньше здесь висел WhatsApp с рогачёвским номером
  // на всех страницах, включая Минск и Жлобин. На страницах сети (нет
  // города) — те же кнопки, но каждая сначала спрашивает клинику.
  const city = useCurrentCity()
  const messengers = getMessengerLinks(city).filter((m) => m.id !== "instagram")

  // Первая кнопка — акцентная, остальные — основного цвета, как и раньше
  // было у Viber/Telegram.
  const buttonClass = (i: number) =>
    i === 0
      ? "group flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-accent/40 focus-visible:outline-none"
      : "group flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"

  return (
    // Только с lg. На телефоне эти кнопки висели над нижней панелью, рядом
    // с поднятым бургером — угол экрана превращался в кашу из трёх кружков
    // поверх контента. Мессенджеры переехали в мобильное меню
    // (mobile-menu-provider.tsx), где у них есть подписи.
    <div className="fixed right-4 bottom-6 z-40 hidden flex-col gap-3 lg:flex">
      {city
        ? messengers.map((m, i) => (
            <a
              key={m.id}
              href={m.href}
              {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={`Написать в ${m.label}`}
              title={`Написать в ${m.label}`}
              className={buttonClass(i)}
            >
              <MessengerIcon id={m.id} className="size-5" />
            </a>
          ))
        : networkMessengers.map((m, i) => (
            <MessengerCityPicker
              key={m.id}
              id={m.id}
              label={m.label}
              links={m.links}
              side="left"
              buttonClassName={buttonClass(i)}
              iconClassName="size-5"
            />
          ))}
    </div>
  )
}
