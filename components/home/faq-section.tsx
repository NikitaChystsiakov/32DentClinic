'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { useCity } from '@/lib/contexts/city-context'

export function FaqSection() {
  const { content } = useCity()

  return (
    <>
      {/* Периwinkle-фон достаточно светлый, поэтому у крупного заголовка есть
          мягкая тень — без неё белый текст на голом фоне читается хуже. */}
      <div className="mb-10 flex flex-col gap-2 [text-shadow:0_1px_10px_rgb(20_16_60/0.35)]">
          <span className="text-sm font-medium text-(--panel-eyebrow)">Вопросы</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">
            Частые вопросы
          </h2>
          <p className="max-w-2xl text-pretty text-(--panel-body)">
            Коротко о том, что чаще всего спрашивают пациенты перед визитом.
          </p>
        </div>

        {/* Матовое стекло: заливка светлая, но почти прозрачная, поэтому
            текст остаётся белым. Тень под текстом здесь не украшение —
            на такой светлой подложке белый сам по себе читается на грани. */}
        <Accordion className="flex max-w-3xl flex-col gap-3 [text-shadow:0_1px_8px_rgb(20_16_60/0.45)]">
          {content.faq.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="rounded-2xl border border-white/35 bg-white/15 px-5 backdrop-blur-sm not-last:border-white/35"
            >
              {/* Стрелка красится через **:…-icon: с !, иначе её проигрывает
                  цвет text-muted-foreground, зашитый в самом AccordionTrigger. */}
              <AccordionTrigger className="py-4 text-base text-white **:data-[slot=accordion-trigger-icon]:text-white!">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-white">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
    </>
  )
}