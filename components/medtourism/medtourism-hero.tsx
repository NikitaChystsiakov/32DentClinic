import Image from 'next/image'
import { Check, FileUp, Plane, ShieldCheck, Wallet } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { City } from '@/config/cities'
import { formatRubFromByn } from '@/config/currency'
import type { MedTourismContent } from '@/content/medtourism'
import { medTourismPriceByn } from '@/lib/medtourism-prices'

/*
 * Первый экран страницы медтуризма. Каркас — как у TownHero (фото клиники
 * под градиентом, тот же ритм заголовка), но главная кнопка не открывает
 * запись, а ведёт к форме со снимком: человек из другой страны сначала
 * хочет понять цену, а не выбирать время приёма. Внизу — три ответа на
 * первые вопросы: сколько стоит, сколько ездить, что с гарантией.
 */
export function MedTourismHero({ city, content }: { city: City; content: MedTourismContent }) {
  const leadPrice = content.prices.items[0]
  const facts = [
    leadPrice && { value: `от ${formatRubFromByn(medTourismPriceByn(leadPrice)).replace('≈ ', '')}`, label: leadPrice.title.toLowerCase() },
    { value: '2 поездки', label: 'обычно на имплантацию и коронки' },
    { value: '∞', label: 'гарантия производителя на импланты' },
  ].filter((fact): fact is { value: string; label: string } => Boolean(fact))

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <Image src={city.photos.hero} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/45" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-var(--header-h)-1px)] max-w-6xl flex-col justify-center gap-8 px-4 py-16 sm:px-6 md:py-20 lg:px-8 snug:gap-5 snug:py-8 short:py-5">
        <div className="flex max-w-2xl flex-col gap-6 snug:gap-4 short:gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-background/70 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm ring-1 ring-silver/25 backdrop-blur">
            <Plane className="size-4 text-secondary" />
            <span>
              {content.hero.eyebrow} · {city.brandName} {city.name}
            </span>
          </div>
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl snug:lg:text-5xl short:lg:text-4xl">
            {content.hero.title}
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground short:text-base">{content.hero.subtitle}</p>
          <ul className="flex flex-col gap-2 text-sm text-foreground short:gap-1">
            {content.hero.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-secondary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              render={<a href="#raschet" />}
              nativeButton={false}
            >
              <FileUp data-icon="inline-start" />
              Прислать снимок на расчёт
            </Button>
            <Button size="lg" variant="outline" render={<a href="#ceny" />} nativeButton={false}>
              <Wallet data-icon="inline-start" />
              Цены в рублях
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            <span>Есть противопоказания, необходима консультация специалиста.</span>
          </div>
        </div>

        <div className="flex max-w-2xl flex-wrap items-center gap-x-8 gap-y-4 border-t border-silver/25 pt-6 snug:pt-4 short:hidden">
          {facts.map((fact, index) => (
            <div key={fact.label} className="contents">
              {index > 0 && <div aria-hidden className="hidden h-9 w-px bg-silver/30 sm:block" />}
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl font-bold whitespace-nowrap text-foreground">{fact.value}</span>
                <span className="max-w-36 text-xs leading-tight text-muted-foreground">{fact.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
