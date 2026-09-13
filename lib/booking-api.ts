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

/** Адрес текущей страницы + тип формы для строки «Откуда» в сообщении. */
export function bookingSource(form: string): string {
  if (typeof window === 'undefined') return form
  return `${form}, ${window.location.pathname}`
}
