import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, ArrowRight } from 'lucide-react'
import { cities } from '@/config/cities'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Сеть стоматологий <span className="text-primary">32Дент</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Современная стоматология в трёх городах Беларуси. Лечение, имплантация,
            протезирование с гарантией 2 года на все виды работ.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-green-500" />
              3 клиники
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-green-500" />
              10+ врачей
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-green-500" />
              Гарантия 2 года
            </span>
          </div>
        </div>
      </section>

      <section id="city-cards" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold text-foreground">
          Выберите город
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src="/images/hero-clinic.png"
                  alt={`32Дент ${city.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-heading text-xl font-bold text-white">32Дент {city.name}</h3>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  {city.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="size-4 shrink-0 text-primary" />
                  {city.phone}
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {city.features.hasSurgery && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Хирургия</span>
                  )}
                  {city.features.hasQuiz && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Квиз</span>
                  )}
                  {city.features.hasTransfer && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Трансфер</span>
                  )}
                </div>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors group-hover:gap-2">
                  Перейти на сайт города <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SpeedInsights />
    </>
  )
}
