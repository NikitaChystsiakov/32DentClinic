import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Stethoscope,
  Microscope,
  Wallet,
  FolderHeart,
} from 'lucide-react'
import { cities } from '@/config/cities'
import { siteConfig } from '@/lib/site-config'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Цифры сети целиком, а не одного города: клиники, врачи, рейтинг.
const NETWORK_STATS = [
  { icon: Building2, value: String(cities.length), label: 'клиники в Беларуси' },
  { icon: Users, value: `${siteConfig.doctorsCount}+`, label: 'врачей в сети' },
  { icon: ShieldCheck, value: 'до 15 лет', label: 'гарантия на протезы' },
]

// Что одинаково во всех городах — блок отвечает на вопрос «а разница есть?»,
// который возникает у человека ровно на этом экране выбора города.
const NETWORK_PROMISES = [
  {
    icon: Stethoscope,
    title: 'Полный цикл в одном месте',
    description:
      'Терапия, хирургия, протезирование и имплантация ведутся одной командой — не нужно искать врачей по разным клиникам.',
  },
  {
    icon: Microscope,
    title: 'Своя диагностика',
    description:
      'Панорамные и прицельные снимки делают прямо в клинике: лечение начинается в тот же приём, без направлений.',
  },
  {
    icon: FolderHeart,
    title: 'Общая история лечения',
    description:
      'Карта пациента одна на всю сеть — переехали в другой город, и врач видит, что и когда вам делали.',
  },
  {
    icon: Wallet,
    title: 'Рассрочка 0%',
    description: `Большие планы лечения можно разбить на платежи без переплаты, работает полис «${siteConfig.insurancePartner}».`,
  },
]

export default function Page() {
  return (
    <>
      {/* Hero сети */}
      <section className="px-3 pt-6 pb-4 sm:px-4 lg:px-6">
        <div className="relative mx-auto max-w-[100rem] overflow-hidden rounded-3xl bg-[linear-gradient(125deg,var(--hero-surface),var(--hero-surface-accent))] px-6 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          {/* Светлые пятна вместо затемняющего оверлея — фон остаётся чистым. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_-15%,rgba(255,255,255,0.32),transparent_50%),radial-gradient(circle_at_-5%_115%,color-mix(in_oklch,var(--secondary),transparent_50%),transparent_55%)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -bottom-24 hidden font-heading text-[20rem] leading-none font-bold text-white/10 select-none lg:block"
          >
            32
          </span>

          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold tracking-wide text-white uppercase ring-1 ring-white/25">
              Сеть стоматологий в Беларуси
            </span>
            <h1 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
              Одна стоматология — три города
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-white/90">
              32Дент лечит, протезирует и восстанавливает зубы в Минске, Рогачёве и Жлобине. Выберите
              город — увидите врачей, цены и свободное время именно вашей клиники.
            </p>
            <Link
              href="#city-cards"
              className="mt-2 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-7 text-sm font-semibold text-(--brand-ink) shadow-lg transition-transform duration-200 hover:-translate-y-px active:translate-y-px"
            >
              Выбрать город
              <ArrowRight className="size-4" />
            </Link>

            <dl className="mt-6 grid w-full grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/20 sm:grid-cols-3">
              {NETWORK_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-center gap-3 bg-[color-mix(in_oklch,var(--hero-surface),white_6%)] px-5 py-4"
                >
                  <stat.icon className="size-5 shrink-0 text-white/70" />
                  <div className="text-left">
                    <dt className="font-heading text-xl leading-none font-bold text-white">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-xs leading-tight text-white/75">{stat.label}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Карточки городов */}
      <section id="city-cards" className="scroll-mt-24 px-3 py-10 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-2 text-center">
            <span className="text-sm font-medium text-secondary">Где мы принимаем</span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Выберите город
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <div
                key={city.slug}
                className="group flex flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/25"
              >
                <Link href={`/${city.slug}`} className="relative block aspect-16/10 overflow-hidden">
                  <Image
                    src={city.image}
                    alt={`32Дент ${city.name}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Фирменный индиго вместо чёрного оверлея: подпись читается,
                      а фото не выглядит «затемнённым» — как раз то, от чего
                      уходим по всему сайту. */}
                  <div className="photo-caption-veil absolute inset-0" />
                  <h3 className="absolute right-5 bottom-4 left-5 font-heading text-2xl font-bold text-white">
                    32Дент {city.name}
                  </h3>
                </Link>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{city.address}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Phone className="size-4 shrink-0 text-primary" />
                    <a href={city.phoneHref} className="font-medium text-foreground hover:text-primary">
                      {city.phone}
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {city.featureTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-(--panel-lavender) px-3 py-1 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Быстрые ссылки внутрь города: часть людей приходит сюда за
                      конкретным разделом, а не за общей страницей клиники. */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-4 text-sm">
                    {[
                      { label: 'Услуги', href: `/${city.slug}/uslugi/` },
                      { label: 'Врачи', href: `/${city.slug}/vrachi/` },
                      { label: 'Цены', href: `/${city.slug}/ceny/` },
                      { label: 'Контакты', href: `/${city.slug}/kontakty/` },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto pt-3">
                    <Link
                      href={`/${city.slug}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
                    >
                      Перейти на сайт города
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Что одинаково во всех клиниках сети */}
      <section className="px-3 pt-4 pb-14 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-(--panel-lavender) p-6 sm:p-10 lg:p-14">
          <div className="mb-8 flex flex-col gap-2">
            <span className="text-sm font-medium text-secondary">Единый стандарт</span>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Что вас ждёт в любом городе
            </h2>
            <p className="max-w-2xl text-pretty text-muted-foreground">
              Клиники отличаются составом врачей и специализацией, но правила работы, оборудование и
              гарантии в сети общие.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {NETWORK_PROMISES.map((promise) => (
              <div key={promise.title} className="flex gap-4 rounded-2xl bg-card p-5 ring-1 ring-primary/10">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--panel-sky) text-primary">
                  <promise.icon className="size-5" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-heading text-base font-bold text-foreground">{promise.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{promise.description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-secondary" />
            {siteConfig.disclaimer}
          </p>
        </div>
      </section>
      <SpeedInsights />
    </>
  )
}
