import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { Button, buttonVariants } from '@/components/ui/button'

type LinkButtonProps = {
  href: string
  className?: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  children: ReactNode
} & Omit<ComponentProps<typeof Button>, 'render' | 'nativeButton'>

export function LinkButton({
  href,
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      render={<Link href={href} />}
      nativeButton={false}
      {...props}
    >
      {children}
    </Button>
  )
}