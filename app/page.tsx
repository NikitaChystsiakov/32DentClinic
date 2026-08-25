import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, ArrowRight, Shield, Building2, Users } from 'lucide-react'
import { cities } from '@/config/cities'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Page() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Сеть стоматологий{' '}
            <span className="text-primary">32Дент</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Современная стоматология в трёх городах Беларуси. Имплантация, лечение
            и протезирование с гарантией до 15 лет.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground">
              <Building2 className="size-4 text-primary" />
              3 клиники
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground">
              <Users className="size-4 text-primary" />
              10+ врачей
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground">
              <Shield className="size-4 text-primary" />
              Гарантия до 15 лет
            </span>
          </div>
        </div>
      </section>

      {/* City Cards */}
      <section id="city-cards" className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold tracking-tight text-foreground">
            Выберите город
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-muted/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-muted/60"
              >
                {/* Photo */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={city.image}
                    alt={`32Дент ${city.name}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="font-heading text-2xl font-bold text-white">
                      32Дент {city.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  {/* Address */}
                  <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <span>{city.address}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Phone className="size-4 shrink-0" />
                    <a href={city.phoneHref} className="font-medium text-foreground hover:text-primary">
                      {city.phone}
                    </a>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {city.featureTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-3">
                    <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 group-hover:bg-primary/90">
                      Перейти на сайт города
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SpeedInsights />
    </>
  )
}
