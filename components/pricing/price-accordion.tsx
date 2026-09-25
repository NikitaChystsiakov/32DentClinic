'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { BookingButton } from '@/components/booking-button'
import { formatProcedurePrice, formatServicePrice, getServicesForCity, proceduresForCity, withProcedureGroups } from '@/lib/services-data'
import { useCity } from '@/lib/contexts/city-context'

export function PriceAccordion() {
  // Только направления, которые есть в этом городе (availableIn), — иначе
  // в Рогачёве показывался бы, например, минский раздел ортодонтии.
  const { city } = useCity()
  const services = getServicesForCity(city.slug)

  return (
    <div className="rounded-2xl border border-silver/25 bg-card px-4 sm:px-6">
      <Accordion multiple>
        {services.map((service) => (
          <AccordionItem key={service.slug} value={service.slug}>
            {/* border-b-silver/25, а не border-silver/25: у триггера в базовом
                стиле уже есть рамка со всех сторон (border-transparent), и общий
                border-color красил все четыре стороны — открытая категория
                обводилась прямоугольником. Красим только нижнюю грань.
                hover:no-underline гасит подчёркивание из базового AccordionTrigger:
                вместо него подсвечиваем заголовок акцентным цветом. */}
            <AccordionTrigger className="items-center hover:no-underline aria-expanded:border-b-silver/25 **:data-[slot=accordion-trigger-icon]:text-accent!">
              <span className="flex flex-wrap items-center gap-2 py-1">
                <span className="font-heading text-base font-semibold text-foreground transition-colors group-hover/accordion-trigger:text-accent group-aria-expanded/accordion-trigger:text-accent">
                  {service.shortName}
                </span>
                <span className="rounded-full bg-silver-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-silver/25">
                  {formatServicePrice(service)}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-2 rounded-lg bg-silver-muted/60 px-3 py-1 sm:px-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Процедура</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead className="w-px" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withProcedureGroups(proceduresForCity(service.procedures, city.slug)).map((row) =>
                      row.type === 'group' ? (
                        <TableRow key={`group-${row.group}`} className="hover:bg-transparent">
                          <TableCell
                            colSpan={3}
                            className="pt-4 pb-1 text-xs font-semibold tracking-wide text-primary uppercase"
                          >
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
                            <BookingButton
                              size="sm"
                              className="bg-accent text-accent-foreground hover:bg-accent/90"
                              options={{ service: service.slug }}
                            >
                              Записаться
                            </BookingButton>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
