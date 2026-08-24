'use client'

import { useCity } from '@/lib/contexts/city-context'
import { DoctorsDirectory } from '@/components/doctors/doctors-directory'
import { DoctorsBottomCta } from '@/components/doctors/doctors-bottom-cta'
import { Reveal } from '@/components/reveal'

export default function DoctorsPage() {
  const { content } = useCity()

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4">
        <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {content.doctors.title}
        </h1>
        <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {content.doctors.description}
        </p>
      </div>

      <DoctorsDirectory />

      <Reveal delay={2}>
        <DoctorsBottomCta />
      </Reveal>
    </div>
  )
}
