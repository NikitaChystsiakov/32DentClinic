'use client'

import * as React from 'react'
import { CheckCircle2, FileUp, Loader2, Paperclip, TriangleAlert, X } from 'lucide-react'

import { ConsentField } from '@/components/consent-field'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BookingError, bookingSource, submitScanRequest } from '@/lib/booking-api'
import { formatRuOrByPhone, isValidRuOrByPhone } from '@/lib/phone'

/*
 * Заявка на расчёт по снимку — главное действие страницы медтуризма.
 * Отличия от формы записи (booking-modal.tsx): российский номер, город
 * пациента, способ связи и до MAX_FILES снимков. Клиника фиксирована
 * (citySlug) — выбирать её не нужно. Уходит multipart в тот же
 * /api/booking.php, лимиты по файлам совпадают с серверными (MAX_* там).
 */

const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_TOTAL_SIZE = 25 * 1024 * 1024
// HEIC — фото с iPhone; браузер не всегда знает его MIME, поэтому проверяем
// и расширение. Окончательно тип по содержимому проверит сервер.
const ACCEPT = '.jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf'
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'pdf']

const SITUATION_ITEMS = [
  { value: 'one', label: 'Нет одного зуба' },
  { value: 'several', label: 'Нет нескольких зубов' },
  { value: 'all', label: 'Нет всех зубов на челюсти' },
  { value: 'crowns', label: 'Нужны коронки или протез' },
  { value: 'unknown', label: 'Не знаю, нужна консультация' },
]

const CONTACT_ITEMS = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'max', label: 'MAX' },
  { value: 'call', label: 'Позвонить' },
]

type FormState = 'default' | 'loading' | 'success' | 'success-no-files' | 'error'

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} КБ` : `${(bytes / 1024 / 1024).toFixed(1)} МБ`
}

/** Ошибка по выбранным файлам или null. */
function validateFiles(files: File[]): string | null {
  if (files.length > MAX_FILES) return `Не больше ${MAX_FILES} файлов`
  const wrongType = files.find((f) => !ALLOWED_EXTENSIONS.includes(f.name.split('.').pop()?.toLowerCase() ?? ''))
  if (wrongType) return `«${wrongType.name}» — неподходящий формат. Подойдут JPG, PNG, HEIC или PDF`
  const tooBig = files.find((f) => f.size > MAX_FILE_SIZE)
  if (tooBig) return `«${tooBig.name}» больше 10 МБ — пришлите ссылку на облако в комментарии`
  if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_SIZE) return 'Вместе файлы больше 25 МБ — часть пришлите ссылкой'
  return null
}

const SERVER_FILE_ERRORS: Record<string, string> = {
  file_too_large: 'Файлы слишком большие — пришлите КТ ссылкой на облако в комментарии',
  file_type: 'Один из файлов в неподходящем формате. Подойдут JPG, PNG, HEIC или PDF',
  too_many_files: `Не больше ${MAX_FILES} файлов`,
  too_large: 'Файлы слишком большие — пришлите КТ ссылкой на облако в комментарии',
}

export function ScanRequestForm({
  citySlug,
  phone,
  phoneHref,
  responseTime,
}: {
  citySlug: string
  /** Телефон клиники — для сообщения об ошибке. */
  phone: string
  phoneHref: string
  responseTime: string
}) {
  const [name, setName] = React.useState('')
  const [phoneValue, setPhoneValue] = React.useState('')
  const [fromCity, setFromCity] = React.useState('')
  const [situation, setSituation] = React.useState<string | undefined>(undefined)
  const [contactVia, setContactVia] = React.useState<string | undefined>(undefined)
  const [comment, setComment] = React.useState('')
  const [files, setFiles] = React.useState<File[]>([])
  const [consent, setConsent] = React.useState(false)
  const [website, setWebsite] = React.useState('')
  const [state, setState] = React.useState<FormState>('default')
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [showErrors, setShowErrors] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const nameError = name.trim().length === 0
  const phoneEmptyError = phoneValue.trim().length === 0
  const phoneError = phoneEmptyError || !isValidRuOrByPhone(phoneValue)
  const filesError = validateFiles(files)
  const consentError = !consent
  const isValid = !nameError && !phoneError && !filesError && !consentError
  const loading = state === 'loading'

  function addFiles(list: FileList | null) {
    if (!list) return
    // Тот же файл дважды не добавляем — по имени и размеру.
    const next = [...files]
    for (const file of Array.from(list)) {
      if (!next.some((f) => f.name === file.name && f.size === file.size)) next.push(file)
    }
    setFiles(next)
    setServerError(null)
  }

  function removeFile(index: number) {
    setFiles(files.filter((_, i) => i !== index))
    setServerError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setShowErrors(true)
    setServerError(null)
    if (!isValid) return

    setState('loading')
    try {
      const filesDelivered = await submitScanRequest(
        {
          name: name.trim(),
          phone: phoneValue,
          city: citySlug,
          fromCity: fromCity.trim() || undefined,
          service: SITUATION_ITEMS.find((s) => s.value === situation)?.label,
          contactVia: CONTACT_ITEMS.find((c) => c.value === contactVia)?.label,
          comment: comment.trim() || undefined,
          source: bookingSource('расчёт по снимку'),
          website,
        },
        files
      )
      setState(filesDelivered || files.length === 0 ? 'success' : 'success-no-files')
    } catch (error) {
      const fileMessage = error instanceof BookingError ? SERVER_FILE_ERRORS[error.code] : undefined
      if (fileMessage) {
        setServerError(fileMessage)
        setState('default')
      } else {
        setState('error')
      }
    }
  }

  if (state === 'success' || state === 'success-no-files') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center ring-1 ring-border">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
          <CheckCircle2 className="size-8" />
        </span>
        <h3 className="font-heading text-xl font-bold text-foreground">Заявка отправлена</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{responseTime}.</p>
        {state === 'success-no-files' && (
          <p className="max-w-sm rounded-lg bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
            Снимки не загрузились — менеджер попросит прислать их в мессенджер, когда свяжется с вами.
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative rounded-2xl bg-card p-5 ring-1 ring-border sm:p-6">
      {/* Honeypot для ботов: вне потока и недоступно для скринридеров и таба. */}
      <div aria-hidden className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor="scan-website">Сайт</label>
        <input
          id="scan-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {state === 'error' && (
        <div className="mb-4 flex items-start gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            Не удалось отправить заявку, попробуйте ещё раз или позвоните:{' '}
            <a href={phoneHref} className="font-medium underline underline-offset-2">
              {phone}
            </a>
          </p>
        </div>
      )}

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={showErrors && nameError ? true : undefined}>
            <FieldLabel htmlFor="scan-name">Имя</FieldLabel>
            <Input
              id="scan-name"
              autoComplete="name"
              value={name}
              disabled={loading}
              aria-invalid={showErrors && nameError ? true : undefined}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться?"
            />
            {showErrors && nameError && <FieldError>Укажите имя</FieldError>}
          </Field>

          <Field data-invalid={showErrors && phoneError ? true : undefined}>
            <FieldLabel htmlFor="scan-phone">Телефон</FieldLabel>
            <Input
              id="scan-phone"
              inputMode="tel"
              autoComplete="tel"
              value={phoneValue}
              disabled={loading}
              aria-invalid={showErrors && phoneError ? true : undefined}
              onChange={(e) => setPhoneValue(formatRuOrByPhone(e.target.value))}
              // Без автоподстановки «+7» по фокусу, как в форме записи: россияне
              // по привычке набирают «8…», и восьмёрка уходила бы в код города.
              // Первая 8 или 7 сама превращается в +7 (lib/phone.ts).
              placeholder="+7 (XXX) XXX-XX-XX"
            />
            {showErrors && phoneEmptyError && <FieldError>Укажите номер телефона</FieldError>}
            {showErrors && !phoneEmptyError && phoneError && <FieldError>Проверьте номер телефона</FieldError>}
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="scan-from">Откуда вы</FieldLabel>
            <Input
              id="scan-from"
              autoComplete="address-level2"
              value={fromCity}
              disabled={loading}
              onChange={(e) => setFromCity(e.target.value)}
              placeholder="Например, Москва"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="scan-contact">Как связаться</FieldLabel>
            <Select
              items={CONTACT_ITEMS}
              value={contactVia}
              onValueChange={(value) => setContactVia(value ?? undefined)}
              disabled={loading}
            >
              <SelectTrigger id="scan-contact" className="w-full">
                <SelectValue placeholder="Удобный способ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {CONTACT_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="scan-situation">Что беспокоит</FieldLabel>
          <Select
            items={SITUATION_ITEMS}
            value={situation}
            onValueChange={(value) => setSituation(value ?? undefined)}
            disabled={loading}
          >
            <SelectTrigger id="scan-situation" className="w-full">
              <SelectValue placeholder="Выберите ситуацию" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SITUATION_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field data-invalid={(showErrors && filesError) || serverError ? true : undefined}>
          <FieldLabel htmlFor="scan-files">Снимок или фото зубов</FieldLabel>
          {/* Сам input скрыт, кнопка-зона открывает выбор файлов; на телефоне
              это сразу предложит камеру или галерею. */}
          <input
            ref={fileInputRef}
            id="scan-files"
            type="file"
            multiple
            accept={ACCEPT}
            disabled={loading}
            className="sr-only"
            onChange={(e) => {
              addFiles(e.target.files)
              // Сброс, чтобы тот же файл можно было выбрать снова после удаления.
              e.target.value = ''
            }}
          />
          <button
            type="button"
            disabled={loading || files.length >= MAX_FILES}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              addFiles(e.dataTransfer.files)
            }}
            className="flex w-full flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-primary/25 bg-primary/5 px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/8 disabled:opacity-60"
          >
            <FileUp className="size-6 text-primary" />
            <span className="font-medium text-foreground">Выбрать файлы</span>
            <span className="text-xs">JPG, PNG, HEIC или PDF · до {MAX_FILES} файлов по 10 МБ</span>
          </button>
          {files.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}`}
                  className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm"
                >
                  <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-foreground">{file.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatSize(file.size)}</span>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => removeFile(index)}
                    aria-label={`Убрать ${file.name}`}
                    className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <FieldDescription>Необязательно: без снимка менеджер подскажет, что сделать.</FieldDescription>
          {((showErrors && filesError) || serverError) && <FieldError>{serverError ?? filesError}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="scan-comment">Комментарий</FieldLabel>
          <Textarea
            id="scan-comment"
            value={comment}
            disabled={loading}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Что беспокоит, когда планируете поездку, ссылка на КТ в облаке"
            rows={3}
          />
        </Field>

        <ConsentField
          id="scan-consent"
          checked={consent}
          disabled={loading}
          showError={showErrors && consentError}
          citySlug={citySlug}
          onCheckedChange={setConsent}
        />

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {loading && <Loader2 className="animate-spin" data-icon="inline-start" />}
            {loading && files.length > 0 ? 'Загружаем снимки…' : 'Получить расчёт'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">{responseTime}</p>
        </div>
      </FieldGroup>
    </form>
  )
}
