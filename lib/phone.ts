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
