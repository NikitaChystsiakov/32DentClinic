'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { siteConfig } from '@/lib/site-config'

const faqItems = [
  {
    question: 'Как записаться на приём?',
    answer:
      'Позвоните нам по телефону, напишите в мессенджер или оставьте заявку в форме на сайте — перезвоним и подберём удобное время. При острой боли принимаем без записи.',
  },
  {
    question: 'Работаете ли вы по полису страховой компании?',
    answer: `Да, часть услуг можно получить по полису «${siteConfig.insurancePartner}». Подробности уточним на консультации.`,
  },
  {
    question: 'Даёте ли вы гарантию на лечение?',
    answer:
      'Да, на все виды работ действует гарантия 2 года. Если в течение этого срока понадобится доработка — исправим бесплатно.',
  },
  {
    question: 'Лечить зубы — это больно?',
    answer:
      'Нет. Мы используем современное обезболивание, а дозировку и вид препарата подбираем индивидуально, чтобы приём прошёл максимально комфортно.',
  },
  {
    question: 'Сколько длится один приём?',
    answer:
      'Всё зависит от объёма работ: от 30–40 минут на осмотр и гигиену до нескольких часов на сложное протезирование. Длинные этапы делим на несколько визитов.',
  },
  {
    question: 'Есть ли противопоказания?',
    answer: siteConfig.disclaimer,
  },
]

export function FaqSection() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
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
          {faqItems.map((item, index) => (
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