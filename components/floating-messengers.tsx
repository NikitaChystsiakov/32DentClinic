"use client"

import { MessageCircle, Send } from "lucide-react"

import { siteConfig } from "@/lib/site-config"

export function FloatingMessengers() {
  return (
    <div className="fixed right-4 bottom-20 z-40 flex flex-col gap-3 md:bottom-6">
      <a
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в WhatsApp"
        className="group flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-accent/40 focus-visible:outline-none"
      >
        <MessageCircle className="size-5" />
      </a>
      <a
        href={siteConfig.telegramHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в Telegram"
        className="group flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
      >
        <Send className="size-5" />
      </a>
    </div>
  )
}
