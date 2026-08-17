import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      {eyebrow && <span className="text-sm font-medium text-secondary">{eyebrow}</span>}
      <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-pretty text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}