// Маска телефона +375 (XX) XXX-XX-XX

export function formatBelarusPhone(rawValue: string): string {
  let digits = rawValue.replace(/\D/g, '')

  if (digits.startsWith('375')) {
    digits = digits.slice(3)
  } else if (digits.startsWith('8')) {
    digits = digits.slice(1)
  }

  digits = digits.slice(0, 9)

  let result = '+375'
  if (digits.length > 0) result += ` (${digits.slice(0, 2)}`
  if (digits.length >= 2) result += ')'
  if (digits.length > 2) result += ` ${digits.slice(2, 5)}`
  if (digits.length > 5) result += `-${digits.slice(5, 7)}`
  if (digits.length > 7) result += `-${digits.slice(7, 9)}`

  return result
}

export function isValidBelarusPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  // 375 + 9 digits = 12
  return digits.length === 12 && digits.startsWith('375')
}

// Маска для формы медтуризма: российский +7 (XXX) XXX-XX-XX или белорусский
// +375 — пациент из России может оставить и местную сим-карту. Страна
// определяется по первым цифрам: 375 — Беларусь, иначе Россия (8 в начале —
// привычная российская запись, заменяется на +7).
export function formatRuOrByPhone(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, '')
  // Пустое поле остаётся пустым — иначе «+7» нельзя стереть.
  if (digits === '') return ''
  if (digits.startsWith('375')) return formatBelarusPhone(digits)
  // Человек стёр «+7» и набирает «+375» — не превращать «3» в «+7 (3».
  if (digits === '3' || digits === '37') return `+${digits}`

  let local = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits
  local = local.slice(0, 10)

  let result = '+7'
  if (local.length > 0) result += ` (${local.slice(0, 3)}`
  if (local.length >= 3) result += ')'
  if (local.length > 3) result += ` ${local.slice(3, 6)}`
  if (local.length > 6) result += `-${local.slice(6, 8)}`
  if (local.length > 8) result += `-${local.slice(8, 10)}`

  return result
}

export function isValidRuOrByPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  // +7 и 10 цифр — Россия; +375 и 9 цифр — Беларусь.
  return (digits.length === 11 && digits.startsWith('7')) || isValidBelarusPhone(value)
}
