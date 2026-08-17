import type { Metadata } from 'next'
import { DoctorsDirectory } from '@/components/doctors/doctors-directory'
import { DoctorsBottomCta } from '@/components/doctors/doctors-bottom-cta'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Врачи',
  description: 'Команда врачей стоматологии Dent32 в Рогачёве — терапевты, ортопеды и хирург-имплантолог.',
}

export default function DoctorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4">
        <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Врачи стоматологии Dent32
        </h1>
        <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Наши специалисты работают на современном оборудовании и всегда в курсе новых технологий лечения.
          Ниже — вся команда клиники, от 6 до 20 лет практики.
        </p>
      </div>

      <DoctorsDirectory />

      <Reveal delay={2}>
        <DoctorsBottomCta />
      </Reveal>
    </div>
  )
}
