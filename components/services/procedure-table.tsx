'use client'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { BookingButton } from '@/components/booking-button'
import type { Procedure } from '@/lib/services-data'

export function ProcedureTable({ slug, procedures }: { slug: string; procedures: Procedure[] }) {

  return (
    <>
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Процедура</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="w-px" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.map((procedure) => (
              <TableRow key={procedure.name}>
                <TableCell className="whitespace-normal font-medium text-foreground">
                  {procedure.name}
                </TableCell>
                <TableCell>от {procedure.priceFrom} BYN</TableCell>
                <TableCell>
                  <BookingButton size="sm" options={{ service: slug }}>
                    Записаться
                  </BookingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {procedures.map((procedure) => (
          <div
            key={procedure.name}
            className="flex flex-col gap-3 rounded-xl border border-border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-medium text-foreground">{procedure.name}</span>
              <span className="shrink-0 whitespace-nowrap text-sm text-muted-foreground">
                от {procedure.priceFrom} BYN
              </span>
            </div>
            <BookingButton size="sm" className="w-full" options={{ service: slug }}>
              Записаться
            </BookingButton>
          </div>
        ))}
      </div>
    </>
  )
}
