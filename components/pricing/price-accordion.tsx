'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/components/booking-modal-provider'
import { serviceCategories } from '@/lib/services-data'

export function PriceAccordion() {
  const { openBookingModal } = useBookingModal()

  return (
    <Accordion multiple>
      {serviceCategories.map((service) => (
        <AccordionItem key={service.slug} value={service.slug}>
          <AccordionTrigger>
            <span className="flex flex-col items-start gap-0.5 py-1">
              <span className="font-heading text-base font-semibold text-foreground">
                {service.shortName}
              </span>
              <span className="text-xs font-normal text-muted-foreground">от {service.priceFrom} BYN</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
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
                      <Button size="sm" onClick={() => openBookingModal({ service: service.slug })}>
                        Записаться
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
