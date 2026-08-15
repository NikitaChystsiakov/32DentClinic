'use client'

import Link from 'next/link'
import { ArrowRight, Stethoscope, Scissors, Smile, Crown, Zap, Sparkles, ScanLine } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import type { ServiceCategory } from '@/lib/services-data'

const icons = {
  Stethoscope,
  Scissors,
  Smile,
  Crown,
  Zap,
  Sparkles,
  ScanLine,
} as const

export function ServiceCard({ service }: { service: ServiceCategory }) {
  const { openBookingModal } = useBookingModal()
  const Icon = icons[service.icon as keyof typeof icons]

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <CardTitle className="text-lg">{service.shortName}</CardTitle>
        <CardDescription className="line-clamp-2">{service.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <span className="font-medium text-foreground">от {service.priceFrom} BYN</span>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1"
            render={<Link href={`/uslugi/${service.slug}/`} />}
            nativeButton={false}
          >
            Подробнее
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => openBookingModal({ service: service.slug })}
          >
            Записаться
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
