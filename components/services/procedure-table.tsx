'use client'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import type { Procedure } from '@/lib/services-data'

export function ProcedureTable({ slug, procedures }: { slug: string; procedures: Procedure[] }) {
  const { openBookingModal } = useBookingModal()

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
                  <Button size="sm" onClick={() => openBookingModal({ service: slug })}>
                    Записаться
                  </Button>
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
            <Button size="sm" className="w-full" onClick={() => openBookingModal({ service: slug })}>
              Записаться
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}
