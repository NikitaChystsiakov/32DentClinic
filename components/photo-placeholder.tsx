import { ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoPlaceholderProps {
  /** What should be photographed and where it will be used. */
  label: string
  /** Recommended minimum source dimensions in pixels. */
  width: number
  height: number
  className?: string
}

/**
 * Visual marker for a spot that needs a real clinic photo. Not meant to look
 * like finished UI — the dashed border and diagonal fill make it obvious
 * this is a placeholder to be replaced once the photo is supplied.
 */
export function PhotoPlaceholder({ label, width, height, className }: PhotoPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,var(--muted)_8px,var(--muted)_16px)] px-4 py-6 text-center',
        className
      )}
    >
      <ImagePlus className="size-5 shrink-0 text-muted-foreground/60" />
      <p className="max-w-xs text-xs leading-snug text-muted-foreground">{label}</p>
      <p className="font-mono text-[11px] font-medium text-muted-foreground/80">
        {width}×{height}px
      </p>
    </div>
  )
}