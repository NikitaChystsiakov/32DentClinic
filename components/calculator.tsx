'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Loader2, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Field, FieldGroup, FieldLabel, FieldTitle, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { formatBelarusPhone, isValidBelarusPhone } from '@/lib/phone'
import { getServiceBySlug } from '@/lib/services-data'
import { siteConfig } from '@/lib/site-config'
import { useBookingModal } from '@/components/booking-modal-provider'

const STEP1_OPTIONS = [
  { id: 'bolit', label: 'Болит зуб / есть кариес' },
  { id: 'ne-hvataet', label: 'Не хватает одного или нескольких зубов' },
  { id: 'krivye', label: 'Кривые зубы / прикус' },
  { id: 'belye', label: 'Хочу белые зубы или профилактику' },
  { id: 'ne-uveren', label: 'Не уверен, нужна консультация' },
] as const

type Step1Id = (typeof STEP1_OPTIONS)[number]['id']

const STEP2_CONFIG: Record<
  Exclude<Step1Id, 'ne-uveren'>,
  { question: string; options: { id: string; label: string; category: string }[] }
> = {
  bolit: {
    question: 'Сколько зубов беспокоит?',
    options: [
      { id: 'odin', label: 'Один', category: 'terapevticheskaya-stomatologiya' },
      { id: 'neskolko', label: 'Несколько', category: 'terapevticheskaya-stomatologiya' },
      { id: 'ne-znayu', label: 'Не знаю', category: 'terapevticheskaya-stomatologiya' },
    ],
  },
  'ne-hvataet': {
    question: 'Как хотите восстановить зуб?',
    options: [
      { id: 'implanty', label: 'Импланты (несъёмно)', category: 'implantaciya' },
      { id: 'proteziruyu', label: 'Съёмный протез', category: 'protezirovanie' },
      { id: 'eshche-ne-reshil', label: 'Ещё не решил', category: 'protezirovanie' },
    ],
  },
  krivye: {
    question: 'Для кого?',
    options: [
      { id: 'vzroslogo', label: 'Для взрослого', category: 'ortodontiya' },
      { id: 'rebenka', label: 'Для ребёнка', category: 'ortodontiya' },
    ],
  },
  belye: {
    question: 'Что интересует?',
    options: [
      { id: 'chistka', label: 'Проф.чистка', category: 'prof-gigiena-i-otbelivanie' },
      { id: 'otbelivanie', label: 'Отбеливание', category: 'prof-gigiena-i-otbelivanie' },
      { id: 'i-to-i-to', label: 'И то, и другое', category: 'prof-gigiena-i-otbelivanie' },
    ],
  },
}

type FormState = 'default' | 'loading' | 'success' | 'error'

export function Calculator({ showHeading = true }: { showHeading?: boolean }) {
  const [step, setStep] = React.useState(1)
  const [step1, setStep1] = React.useState<Step1Id | undefined>(undefined)
  const [step2, setStep2] = React.useState<string | undefined>(undefined)
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [consent, setConsent] = React.useState(false)
  const [showErrors, setShowErrors] = React.useState(false)
  const [formState, setFormState] = React.useState<FormState>('default')
  const { openBookingModal } = useBookingModal()

  const skipsStep2 = step1 === 'ne-uveren'
  const totalSteps = skipsStep2 ? 2 : 3
  const displayStep = step === 3 ? totalSteps : skipsStep2 && step === 2 ? 2 : step

  const category = React.useMemo(() => {
    if (!step1 || step1 === 'ne-uveren') return undefined
    const config = STEP2_CONFIG[step1]
    return config.options.find((o) => o.id === step2)?.category
  }, [step1, step2])

  const nameError = name.trim().length === 0
  const phoneEmptyError = phone.trim().length === 0
  const phoneError = phoneEmptyError || !isValidBelarusPhone(phone)
  const consentError = !consent
  const isValid = !nameError && !phoneError && !consentError

  function goToStep2() {
    if (!step1) return
    if (step1 === 'ne-uveren') {
      setStep(3)
    } else {
      setStep(2)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setShowErrors(true)
    if (!isValid) return
    setFormState('loading')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setFormState('success')
    } catch {
      setFormState('error')
    }
  }

  if (formState === 'success') {
    const service = category ? getServiceBySlug(category) : undefined
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
          <CheckCircle2 className="size-8" />
        </span>
        {category && service ? (
          <p className="max-w-md text-balance leading-relaxed text-foreground">
            Спасибо! Судя по ответам, вам подойдёт направление:{' '}
            <span className="font-semibold text-primary">{service.shortName}</span>. Точный план и стоимость
            определит врач на бесплатной консультации — мы уже получили ваши контакты и скоро свяжемся.
          </p>
        ) : (
          <p className="max-w-md text-balance leading-relaxed text-foreground">
            Спасибо! Мы получили ваши контакты и свяжемся, чтобы подобрать подходящее решение.
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          {category && service && (
            <Button variant="outline" render={<Link href={`/uslugi/${service.slug}/`} />} nativeButton={false}>
              Узнать больше об услуге
            </Button>
          )}
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => openBookingModal({ service: category })}
          >
            Записаться на консультацию {category ? 'сейчас' : ''}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
      {showHeading && (
        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Узнайте примерный план лечения за 1 минуту
          </h2>
          <p className="text-muted-foreground">
            Ответьте на пару вопросов — подскажем, что нужно, и предварительно оценим объём работы. Точную цену
            врач назовёт после бесплатного осмотра.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Шаг {displayStep} из {totalSteps}
          </span>
        </div>
        <Progress value={(displayStep / totalSteps) * 100} />
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">Что вас беспокоит?</h3>
          <RadioGroup value={step1} onValueChange={(v) => setStep1(v as Step1Id)} className="gap-3">
            {STEP1_OPTIONS.map((opt) => (
              <FieldLabel key={opt.id} htmlFor={`s1-${opt.id}`} className="cursor-pointer">
                <Field orientation="horizontal" className="rounded-xl border border-border p-4">
                  <RadioGroupItem value={opt.id} id={`s1-${opt.id}`} />
                  <FieldTitle className="text-base font-normal">{opt.label}</FieldTitle>
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          <Button
            size="lg"
            disabled={!step1}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={goToStep2}
          >
            Далее
          </Button>
        </div>
      )}

      {step === 2 && step1 && step1 !== 'ne-uveren' && (
        <div className="flex flex-col gap-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">{STEP2_CONFIG[step1].question}</h3>
          <RadioGroup value={step2} onValueChange={setStep2} className="gap-3">
            {STEP2_CONFIG[step1].options.map((opt) => (
              <FieldLabel key={opt.id} htmlFor={`s2-${opt.id}`} className="cursor-pointer">
                <Field orientation="horizontal" className="rounded-xl border border-border p-4">
                  <RadioGroupItem value={opt.id} id={`s2-${opt.id}`} />
                  <FieldTitle className="text-base font-normal">{opt.label}</FieldTitle>
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => setStep(1)}>
              <ArrowLeft data-icon="inline-start" />
              Назад
            </Button>
            <Button
              size="lg"
              disabled={!step2}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => setStep(3)}
            >
              Далее
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">Оставьте контакты</h3>

          {formState === 'error' && (
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

          <FieldGroup>
            <Field data-invalid={showErrors && nameError ? true : undefined}>
              <FieldLabel htmlFor="calc-name">Имя</FieldLabel>
              <Input
                id="calc-name"
                value={name}
                disabled={formState === 'loading'}
                aria-invalid={showErrors && nameError ? true : undefined}
                onChange={(e) => setName(e.target.value)}
              />
              {showErrors && nameError && <FieldError>Укажите имя</FieldError>}
            </Field>
            <Field data-invalid={showErrors && phoneError ? true : undefined}>
              <FieldLabel htmlFor="calc-phone">Телефон</FieldLabel>
              <Input
                id="calc-phone"
                inputMode="tel"
                value={phone}
                disabled={formState === 'loading'}
                aria-invalid={showErrors && phoneError ? true : undefined}
                onChange={(e) => setPhone(formatBelarusPhone(e.target.value))}
                onFocus={() => {
                  if (phone.trim().length === 0) setPhone('+375')
                }}
                placeholder="+375 (XX) XXX-XX-XX"
              />
              {showErrors && phoneEmptyError && <FieldError>Укажите номер телефона</FieldError>}
              {showErrors && !phoneEmptyError && phoneError && <FieldError>Проверьте номер телефона</FieldError>}
            </Field>
            <Field orientation="horizontal" data-invalid={showErrors && consentError ? true : undefined}>
              <Checkbox
                id="calc-consent"
                checked={consent}
                disabled={formState === 'loading'}
                aria-invalid={showErrors && consentError ? true : undefined}
                onCheckedChange={(checked) => setConsent(checked === true)}
              />
              <FieldLabel htmlFor="calc-consent" className="font-normal">
                Я согласен(-на) на{' '}
                <a href={siteConfig.privacyPolicyHref} className="underline underline-offset-2">
                  обработку персональных данных
                </a>
              </FieldLabel>
            </Field>
            {showErrors && consentError && <FieldError>Нужно согласие на обработку данных</FieldError>}
          </FieldGroup>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setStep(skipsStep2 ? 1 : 2)}
            >
              <ArrowLeft data-icon="inline-start" />
              Назад
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={formState === 'loading'}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {formState === 'loading' && <Loader2 className="animate-spin" data-icon="inline-start" />}
              Получить план и промокод
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
