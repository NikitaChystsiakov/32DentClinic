'use client'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { BookingButton } from '@/components/booking-button'
import { formatProcedurePrice, withProcedureGroups, type Procedure } from '@/lib/services-data'

export function ProcedureTable({ slug, procedures }: { slug: string; procedures: Procedure[] }) {
  const rows = withProcedureGroups(procedures)

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
            {rows.map((row) =>
              row.type === 'group' ? (
                // Подзаголовок группы («All-on-4», «Лечение каналов»): без
                // кнопки и цены, чтобы длинный прайс читался по разделам.
                <TableRow key={`group-${row.group}`} className="hover:bg-transparent">
                  <TableCell colSpan={3} className="pt-5 pb-1 text-xs font-semibold tracking-wide text-primary uppercase">
                    {row.group}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={row.procedure.name}>
                  <TableCell className="whitespace-normal font-medium text-foreground">
                    {row.procedure.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatProcedurePrice(row.procedure)}</TableCell>
                  <TableCell>
                    <BookingButton size="sm" options={{ service: slug }}>
                      Записаться
                    </BookingButton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {rows.map((row) =>
          row.type === 'group' ? (
            <p key={`group-${row.group}`} className="mt-3 text-xs font-semibold tracking-wide text-primary uppercase">
              {row.group}
            </p>
          ) : (
            <div
              key={row.procedure.name}
              className="flex flex-col gap-3 rounded-xl border border-border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-medium text-foreground">{row.procedure.name}</span>
                <span className="shrink-0 whitespace-nowrap text-sm text-muted-foreground">
                  {formatProcedurePrice(row.procedure)}
                </span>
              </div>
              <BookingButton size="sm" className="w-full" options={{ service: slug }}>
                Записаться
              </BookingButton>
            </div>
          )
        )}
      </div>
    </>
  )
}
