'use client'

import * as React from 'react'
import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react'

import { useBookingModal } from '@/components/booking-modal-provider'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatBelarusPhone, isValidBelarusPhone } from '@/lib/phone'
import { serviceSelectOptions } from '@/lib/services-data'
import { doctors } from '@/config/doctors'
import { siteConfig } from '@/lib/site-config'

type FormState = 'default' | 'loading' | 'success' | 'error'

export function BookingModal() {
  const { isOpen, service, doctor, closeBookingModal } = useBookingModal()

  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [selectedService, setSelectedService] = React.useState<string | undefined>(undefined)
  const [selectedDoctor, setSelectedDoctor] = React.useState<string | undefined>(undefined)
  const [comment, setComment] = React.useState('')
  const [consent, setConsent] = React.useState(false)
  const [state, setState] = React.useState<FormState>('default')
  const [showErrors, setShowErrors] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setSelectedService(service)
      setSelectedDoctor(doctor)
      setState('default')
      setShowErrors(false)
    }
  }, [isOpen, service, doctor])

  const nameError = name.trim().length === 0
  const phoneError = phone.trim().length === 0 || !isValidBelarusPhone(phone)
  const phoneEmptyError = phone.trim().length === 0
  const consentError = !consent
  const isValid = !nameError && !phoneError && !consentError

  function resetFormFields() {
    setName('')
    setPhone('')
    setSelectedService(undefined)
    setSelectedDoctor(undefined)
    setComment('')
    setConsent(false)
    setShowErrors(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      closeBookingModal()
      if (state !== 'loading') {
        window.setTimeout(() => {
          setState('default')
          resetFormFields()
        }, 200)
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setShowErrors(true)
    if (!isValid) return

    setState('loading')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-dvh w-full overflow-y-auto rounded-none p-6 sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl">
        {state === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <CheckCircle2 className="size-8" />
            </span>
            <DialogHeader className="items-center">
              <DialogTitle className="font-heading text-xl">Заявка отправлена!</DialogTitle>
              <DialogDescription className="text-center">
                Мы перезвоним вам в ближайшее время.
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-2 w-full" onClick={() => handleOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Записаться на приём</DialogTitle>
              <DialogDescription>
                Заполните форму — мы перезвоним, чтобы уточнить удобное время визита.
              </DialogDescription>
            </DialogHeader>

            {state === 'error' && (
              <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <p>
                  Не удалось отправить заявку, попробуйте ещё раз или позвоните нам напрямую:{' '}
                  <a href={siteConfig.phoneHref} className="font-medium underline underline-offset-2">
                    {siteConfig.phoneDisplay}
                  </a>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <FieldGroup>
                <Field data-invalid={showErrors && nameError ? true : undefined}>
                  <FieldLabel htmlFor="booking-name">Имя</FieldLabel>
                  <Input
                    id="booking-name"
                    value={name}
                    disabled={state === 'loading'}
                    aria-invalid={showErrors && nameError ? true : undefined}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как к вам обращаться?"
                  />
                  {showErrors && nameError && <FieldError>Укажите имя</FieldError>}
                </Field>

                <Field data-invalid={showErrors && phoneError ? true : undefined}>
                  <FieldLabel htmlFor="booking-phone">Телефон</FieldLabel>
                  <Input
                    id="booking-phone"
                    inputMode="tel"
                    disabled={state === 'loading'}
                    value={phone}
                    aria-invalid={showErrors && phoneError ? true : undefined}
                    onChange={(e) => setPhone(formatBelarusPhone(e.target.value))}
                    onFocus={() => {
                      if (phone.trim().length === 0) setPhone('+375')
                    }}
                    placeholder="+375 (XX) XXX-XX-XX"
                  />
                  {showErrors && phoneEmptyError && <FieldError>Укажите номер телефона</FieldError>}
                  {showErrors && !phoneEmptyError && phoneError && (
                    <FieldError>Проверьте номер телефона</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="booking-service">Услуга</FieldLabel>
                  <Select
                    value={selectedService}
                    onValueChange={setSelectedService}
                    disabled={state === 'loading'}
                  >
                    <SelectTrigger id="booking-service" className="w-full">
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {serviceSelectOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                        <SelectItem value="ne-znayu">Не знаю, нужна консультация</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="booking-doctor">Врач</FieldLabel>
                  <Select
                    value={selectedDoctor}
                    onValueChange={setSelectedDoctor}
                    disabled={state === 'loading'}
                  >
                    <SelectTrigger id="booking-doctor" className="w-full">
                      <SelectValue placeholder="Выберите врача" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {doctors.map((d) => (
                          <SelectItem key={d.slug} value={d.slug}>
                            {d.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="bez-predpochteniy">Без предпочтений</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="booking-comment">Комментарий</FieldLabel>
                  <Textarea
                    id="booking-comment"
                    value={comment}
                    disabled={state === 'loading'}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Опишите, что вас беспокоит (необязательно)"
                    rows={3}
                  />
                </Field>

                <Field
                  orientation="horizontal"
                  data-invalid={showErrors && consentError ? true : undefined}
                >
                  <Checkbox
                    id="booking-consent"
                    checked={consent}
                    disabled={state === 'loading'}
                    aria-invalid={showErrors && consentError ? true : undefined}
                    onCheckedChange={(checked) => setConsent(checked === true)}
                  />
                  <FieldLabel htmlFor="booking-consent" className="font-normal">
                    Я согласен(-на) на{' '}
                    <a href={siteConfig.privacyPolicyHref} className="underline underline-offset-2">
                      обработку персональных данных
                    </a>
                  </FieldLabel>
                </Field>
                {showErrors && consentError && <FieldError>Нужно согласие на обработку данных</FieldError>}

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={state === 'loading'}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {state === 'loading' && <Loader2 className="animate-spin" data-icon="inline-start" />}
                    Записаться
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Мы перезвоним в течение рабочего дня для подтверждения записи
                  </p>
                </div>
              </FieldGroup>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
