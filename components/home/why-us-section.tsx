import { BadgePercent, ShieldCheck, Factory, CalendarClock, Cpu, Sofa, MapPin, Handshake } from 'lucide-react'

const points = [
  {
    icon: BadgePercent,
    title: 'Честное соотношение цены и качества',
    description: 'Считаем план лечения заранее, без навязанных услуг и доплат по ходу.',
  },
  {
    icon: ShieldCheck,
    title: '2 года гарантии на услуги',
    description: 'Несём ответственность за результат лечения и бесплатно устраняем недочёты.',
  },
  {
    icon: Factory,
    title: 'Собственная зуботехническая лаборатория',
    description: 'Коронки и протезы делаем на месте — быстрее и с контролем качества на каждом этапе.',
  },
  {
    icon: CalendarClock,
    title: 'Гибкий график работы',
    description: 'Принимаем по будням и субботам, а при острой боли — без записи.',
  },
  {
    icon: Cpu,
    title: 'Современное оборудование',
    description: 'Аппаратура от американских производителей для точной и комфортной диагностики.',
  },
  {
    icon: Sofa,
    title: 'Уютный интерьер',
    description: 'Продумали клинику так, чтобы визит к стоматологу не вызывал стресса.',
  },
  {
    icon: MapPin,
    title: 'Удобное расположение',
    description: 'Находимся в центре города — легко добраться с любой точки Рогачёва.',
  },
  {
    icon: Handshake,
    title: 'Работаем со страховой компанией',
    description: 'Часть услуг можно получить по полису — уточним детали на консультации.',
  },
]

export function WhyUsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Почему именно мы</span>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          <span className="text-accent">32</span> причины выбрать 32Дент
        </h2>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Мы собрали главные из них — остальные вы поймёте на первом приёме.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => (
          <div key={point.title} className="flex flex-col gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <point.icon className="size-5" />
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground">{point.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}