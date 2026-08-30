'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { useCity } from '@/lib/contexts/city-context'

export function FaqSection() {
  const { content } = useCity()

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary">Вопросы</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Частые вопросы
          </h2>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Коротко о том, что чаще всего спрашивают пациенты перед визитом.
          </p>
        </div>

        <Accordion className="mx-auto max-w-3xl">
          {content.faq.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="py-4 text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
