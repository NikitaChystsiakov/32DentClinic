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
import { ConsentField } from '@/components/consent-field'
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
import { cities } from '@/config/cities'
import { useCurrentCity } from '@/lib/hooks/use-current-city'
import { siteConfig } from '@/lib/site-config'
import { bookingSource, submitBooking } from '@/lib/booking-api'

type FormState = 'default' | 'loading' | 'success' | 'error'

export function BookingModal() {
  const { isOpen, service, doctor, closeBookingModal } = useBookingModal()
  // Город берём из адреса страницы: на /minsk/... заявка уходит в Минск.
  // На страницах сети (главная, блог) города в адресе нет — тогда его
  // выбирают в форме. Это не только удобство: у каждого города может быть
  // своё юрлицо, и человек должен видеть, кому именно он отдаёт данные
  // (ссылки в чекбоксе согласия ведут на документы выбранного города).
  const currentCity = useCurrentCity()

  const [name, setName] = React.useState('')
  const [selectedCity, setSelectedCity] = React.useState<string | undefined>(undefined)
  const [phone, setPhone] = React.useState('')
  const [selectedService, setSelectedService] = React.useState<string | undefined>(undefined)
  const [selectedDoctor, setSelectedDoctor] = React.useState<string | undefined>(undefined)
  const [comment, setComment] = React.useState('')
  const [consent, setConsent] = React.useState(false)
  // Honeypot: поле визуально скрыто, люди его не заполняют.
  const [website, setWebsite] = React.useState('')
  const [state, setState] = React.useState<FormState>('default')
  const [showErrors, setShowErrors] = React.useState(false)

  /*
   * Списки для селектов держим отдельно и передаём в <Select items>: без
   * этого пропа base-ui рисует в поле сырое значение, то есть слаг
   * («terapiya», «ilyushchenko-natalya»), а не подпись. Тот же массив
   * раскладывается в пункты списка — так подпись в поле и подпись в списке
   * не могут разъехаться. Варианты «не знаю» / «без предпочтений» лежат
   * здесь же: у них нет слага в данных, но в поле они тоже должны читаться
   * по-русски.
   */
  const serviceItems = React.useMemo(
    () => [...serviceSelectOptions, { value: 'ne-znayu', label: 'Не знаю, нужна консультация' }],
    []
  )
  const doctorItems = React.useMemo(
    () => [
      ...doctors.map((d) => ({ value: d.slug, label: d.name })),
      { value: 'bez-predpochteniy', label: 'Без предпочтений' },
    ],
    []
  )
  // Города без формы (hasBookingForm: false) в выборе не предлагаем: их
  // заявки принимают только по телефону, см. components/booking-button.tsx.
  const cityItems = React.useMemo(
    () => cities.filter((c) => c.hasBookingForm).map((c) => ({ value: c.slug, label: `${c.name}, ${c.address}` })),
    []
  )

  React.useEffect(() => {
    if (isOpen) {
      setSelectedCity(currentCity?.slug)
      setSelectedService(service)
      setSelectedDoctor(doctor)
      setState('default')
      setShowErrors(false)
    }
  }, [isOpen, service, doctor, currentCity])

  // Телефон для «позвоните напрямую» в сообщении об ошибке — выбранной
  // клиники, а не первой попавшейся.
  const errorPhone = cities.find((c) => c.slug === (selectedCity ?? currentCity?.slug))

  const nameError = name.trim().length === 0
  const cityError = !selectedCity
  const phoneError = phone.trim().length === 0 || !isValidBelarusPhone(phone)
  const phoneEmptyError = phone.trim().length === 0
  const consentError = !consent
  const isValid = !nameError && !phoneError && !cityError && !consentError

  function resetFormFields() {
    setName('')
    setSelectedCity(undefined)
    setPhone('')
    setSelectedService(undefined)
    setSelectedDoctor(undefined)
    setComment('')
    setConsent(false)
    setWebsite('')
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
      // В Telegram уходят подписи, а не слаги: «Имплантация», а не «implantaciya».
      await submitBooking({
        name: name.trim(),
        phone,
        city: selectedCity,
        service: serviceItems.find((s) => s.value === selectedService)?.label,
        doctor: doctorItems.find((d) => d.value === selectedDoctor)?.label,
        comment: comment.trim() || undefined,
        source: bookingSource('форма записи'),
        website,
      })
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
                  <a
                    href={errorPhone?.phoneHref ?? siteConfig.phoneHref}
                    className="font-medium underline underline-offset-2"
                  >
                    {errorPhone?.phone ?? siteConfig.phoneDisplay}
                  </a>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot для ботов: вне потока и недоступно для скринридеров и таба. */}
              <div aria-hidden className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                <label htmlFor="booking-website">Сайт</label>
                <input
                  id="booking-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
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

                <Field data-invalid={showErrors && cityError ? true : undefined}>
                  <FieldLabel htmlFor="booking-city">Клиника</FieldLabel>
                  <Select
                    items={cityItems}
                    value={selectedCity}
                    onValueChange={(value) => setSelectedCity(value ?? undefined)}
                    disabled={state === 'loading'}
                  >
                    <SelectTrigger id="booking-city" className="w-full" aria-invalid={showErrors && cityError ? true : undefined}>
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {cityItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {showErrors && cityError && <FieldError>Выберите клинику</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="booking-service">Услуга</FieldLabel>
                  <Select
                    items={serviceItems}
                    value={selectedService}
                    onValueChange={(value) => setSelectedService(value ?? undefined)}
                    disabled={state === 'loading'}
                  >
                    <SelectTrigger id="booking-service" className="w-full">
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {serviceItems.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="booking-doctor">Врач</FieldLabel>
                  <Select
                    items={doctorItems}
                    value={selectedDoctor}
                    onValueChange={(value) => setSelectedDoctor(value ?? undefined)}
                    disabled={state === 'loading'}
                  >
                    <SelectTrigger id="booking-doctor" className="w-full">
                      <SelectValue placeholder="Выберите врача" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {doctorItems.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
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
                    placeholder="Комментарий к записи (необязательно)"
                    rows={3}
                  />
                </Field>

                <ConsentField
                  id="booking-consent"
                  checked={consent}
                  disabled={state === 'loading'}
                  showError={showErrors && consentError}
                  citySlug={selectedCity ?? currentCity?.slug}
                  onCheckedChange={setConsent}
                />

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
