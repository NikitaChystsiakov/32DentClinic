'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import type { FaqItem } from '@/lib/services-data'

export function ServiceFaqSection({ faq }: { faq: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">Частые вопросы</h2>
      <Accordion>
        {faq.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
