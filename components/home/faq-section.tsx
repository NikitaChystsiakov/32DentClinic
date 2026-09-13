'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { useCity } from '@/lib/contexts/city-context'

interface FaqSectionProps {
  /**
   * Свой список вопросов вместо content.faq текущего города — для страниц
   * «соседних» городов (см. components/town), где вопросы про дорогу и
   * выбор клиники, а не общие про приём.
   */
  items?: { question: string; answer: string }[]
  /** Подпись под заголовком; по умолчанию — общая для городов. */
  description?: string
}

export function FaqSection({ items, description }: FaqSectionProps = {}) {
  const { content } = useCity()
  const faq = items ?? content.faq

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
            {description ?? 'Коротко о том, что чаще всего спрашивают пациенты перед визитом.'}
          </p>
        </div>

        {/* Матовое стекло: заливка светлая, но почти прозрачная, поэтому
            текст остаётся белым. Тень под текстом здесь не украшение —
            на такой светлой подложке белый сам по себе читается на грани. */}
        <Accordion className="flex max-w-3xl flex-col gap-3 [text-shadow:0_1px_8px_rgb(20_16_60/0.45)]">
          {faq.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="rounded-2xl border border-white/35 bg-white/15 px-5 backdrop-blur-sm not-last:border-white/35"
            >
              {/* hover:no-underline — подчёркивание из базового AccordionTrigger
                  здесь лишнее: вопрос и так подсвечен «пузырём», а линия под
                  белым текстом с тенью читалась как дефект.
                  Стрелка красится через **:…-icon: с !, иначе её проигрывает
                  цвет text-muted-foreground, зашитый в самом AccordionTrigger;
                  толщина обводки и тень взяты как у текста рядом, чтобы она не
                  выглядела тоньше и бледнее вопроса. */}
              <AccordionTrigger className="py-4 text-base text-white hover:no-underline **:data-[slot=accordion-trigger-icon]:text-white! **:data-[slot=accordion-trigger-icon]:[stroke-width:2.5] **:data-[slot=accordion-trigger-icon]:drop-shadow-[0_1px_8px_rgb(20_16_60/0.45)]">
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