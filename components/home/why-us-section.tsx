import { Building2, Microscope, ShieldCheck, Users } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const points = [
  {
    icon: Users,
    title: `${siteConfig.doctorsCount} врачей всех направлений`,
    description: 'Терапевты, ортопеды и хирург-имплантолог — можно закрыть весь план лечения в одной клинике.',
  },
  {
    icon: Building2,
    title: 'Своя зуботехническая лаборатория',
    description: 'Коронки и протезы изготавливаются на месте — быстрее и с контролем качества на каждом этапе.',
  },
  {
    icon: Microscope,
    title: 'Собственный рентген-кабинет',
    description: 'Панорамные и прицельные снимки делаем в клинике, без направления в другое учреждение.',
  },
  {
    icon: ShieldCheck,
    title: `Работаем по полису «${siteConfig.insurancePartner}»`,
    description: 'Часть услуг можно получить по страховому полису — уточним детали на консультации.',
  },
]

export function WhyUsSection() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary">Почему Dent32</span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Всё нужное — под одной крышей
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <div key={point.title} className="flex flex-col gap-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <point.icon className="size-5" />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground">{point.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
