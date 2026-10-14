/**
 * Отправка заявки в public/api/booking.php — единственный endpoint для всех
 * форм сайта (модалка записи, калькулятор). Сервер валидирует поля,
 * отсекает ботов по honeypot и пересылает текст в Telegram.
 */
export interface BookingPayload {
  name: string
  phone: string
  /** slug города — сервер подставит название в заголовок сообщения. */
  city?: string
  /** Уже человекочитаемые подписи, не слаги: «Имплантация», «Иванов И. И.». */
  service?: string
  doctor?: string
  comment?: string
  /** Откуда пришла заявка: адрес страницы и тип формы. */
  source?: string
  /** Honeypot — люди поле не видят, боты заполняют. Отправлять как есть. */
  website?: string
}

export class BookingError extends Error {
  constructor(public readonly code: string) {
    super(`booking failed: ${code}`)
  }
}

export async function submitBooking(payload: BookingPayload): Promise<void> {
  let response: Response
  try {
    response = await fetch('/api/booking.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new BookingError('network')
  }

  const body = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
  if (!response.ok || !body?.ok) {
    throw new BookingError(body?.error ?? `http_${response.status}`)
  }
}

/**
 * Заявка со снимками (страница медтуризма): тот же endpoint, но
 * multipart/form-data — JSON файлы не везёт. Поля — как у BookingPayload,
 * плюс город пациента, способ связи и файлы `files[]`. Сервер помечает
 * заявку #медтуризм по `form`.
 */
export interface ScanRequestPayload extends BookingPayload {
  /** Откуда пациент: «Москва». */
  fromCity?: string
  /** Как удобнее связаться: «Telegram», «Звонок». */
  contactVia?: string
}

/**
 * true — файлы дошли; false — заявка доставлена, а файлы нет (Telegram не
 * принял): форма попросит прислать снимок в мессенджер.
 */
export async function submitScanRequest(payload: ScanRequestPayload, files: File[]): Promise<boolean> {
  const form = new FormData()
  form.append('form', 'medturizm')
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) form.append(key, value)
  }
  for (const file of files) form.append('files[]', file, file.name)

  let response: Response
  try {
    // Content-Type не ставим: браузер сам добавит boundary для multipart.
    response = await fetch('/api/booking.php', { method: 'POST', body: form })
  } catch {
    throw new BookingError('network')
  }

  const body = (await response.json().catch(() => null)) as
    | { ok?: boolean; error?: string; files?: boolean }
    | null
  if (!response.ok || !body?.ok) {
    throw new BookingError(body?.error ?? `http_${response.status}`)
  }
  return body.files !== false
}

/** Адрес текущей страницы + тип формы для строки «Откуда» в сообщении. */
export function bookingSource(form: string): string {
  if (typeof window === 'undefined') return form
  return `${form}, ${window.location.pathname}`
}
