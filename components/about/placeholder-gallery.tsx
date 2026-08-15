import { ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function PlaceholderGallery({
  count,
  caption,
}: {
  count: number
  caption: string
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="h-full">
          <CardContent className="flex aspect-[4/3] flex-col items-center justify-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImageIcon className="size-6" />
            </span>
            <p className="text-sm text-muted-foreground">{caption}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
