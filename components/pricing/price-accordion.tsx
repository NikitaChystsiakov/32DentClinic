'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import { serviceCategories } from '@/lib/services-data'

export function PriceAccordion() {
  const { openBookingModal } = useBookingModal()

  return (
    <div className="rounded-2xl border border-silver/25 bg-card px-4 sm:px-6">
      <Accordion multiple>
        {serviceCategories.map((service) => (
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
                  от {service.priceFrom} BYN
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
                    {service.procedures.map((procedure) => (
                      <TableRow key={procedure.name}>
                        <TableCell className="whitespace-normal font-medium text-foreground">
                          {procedure.name}
                        </TableCell>
                        <TableCell>от {procedure.priceFrom} BYN</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={() => openBookingModal({ service: service.slug })}
                          >
                            Записаться
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
