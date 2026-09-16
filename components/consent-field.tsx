'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { legalDocHref } from '@/config/legal'

/*
 * Чекбокс согласия на обработку персональных данных — один на все формы
 * (запись на приём, калькулятор), чтобы формулировка и ссылки не разъезжались.
 *
 * Почему текст именно такой: по ст. 5 Закона РБ «О защите персональных данных»
 * согласие должно быть информированным — человек до галочки видит, какие
 * данные, кому и зачем (ссылка «условиях согласия»), и отдельно — разъяснение
 * своих прав (оно в том же документе отдельным разделом). Сведения о здоровье
 * названы явно: комментарий к записи и ответы калькулятора — это специальные
 * персональные данные (ст. 8), на них нужно отдельное явное согласие.
 * Чекбокс не может быть отмечен заранее.
 *
 * Ссылки ведут на документы города, в клинику которого уходит заявка —
 * у каждого города может быть своё юрлицо-оператор (см. config/cities.ts).
 */
export function ConsentField({
  id,
  checked,
  disabled,
  showError,
  citySlug,
  onCheckedChange,
}: {
  id: string
  checked: boolean
  disabled?: boolean
  showError?: boolean
  citySlug?: string | null
  onCheckedChange: (checked: boolean) => void
}) {
  const linkClass = 'underline underline-offset-2 hover:text-primary'
  return (
    <>
      <Field orientation="horizontal" data-invalid={showError ? true : undefined}>
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          aria-invalid={showError ? true : undefined}
          onCheckedChange={(next) => onCheckedChange(next === true)}
        />
        <FieldLabel htmlFor={id} className="block text-sm font-normal leading-snug">
          Даю согласие на обработку персональных данных, в том числе сведений о здоровье из заявки, на{' '}
          <a href={legalDocHref('soglasie', citySlug)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            условиях согласия
          </a>{' '}
          и ознакомлен(а) с{' '}
          <a
            href={legalDocHref('politika-konfidencialnosti', citySlug)}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            политикой обработки персональных данных
          </a>
          .
        </FieldLabel>
      </Field>
      {showError && <FieldError>Без согласия мы не сможем принять заявку</FieldError>}
    </>
  )
}
