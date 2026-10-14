import { MedTourismHeading } from '@/components/medtourism/medtourism-heading'
import type { MedTourismContent } from '@/content/medtourism'

/*
 * «Как получить расчёт» — четыре шага до поездки. Нумерация крупной цифрой,
 * а не таймлайном: шаги короткие и идут в ряд на десктопе, на телефоне —
 * столбиком.
 */
export function MedTourismSteps({ content }: { content: MedTourismContent }) {
  const { howItWorks } = content
  return (
    <>
      <MedTourismHeading eyebrow="Как это работает" title={howItWorks.title} subtitle={howItWorks.subtitle} />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {howItWorks.steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-border">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-primary-foreground">
              {index + 1}
            </span>
            <h3 className="font-heading text-base font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </>
  )
}
