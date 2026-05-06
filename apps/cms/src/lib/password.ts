export const PASSWORD_MIN_LENGTH = 8
const UPPERCASE_REGEX = /[A-Z]/
const DIGIT_REGEX = /\d/

export function validatePasswordStrength(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must contain at least ${PASSWORD_MIN_LENGTH} characters`
  }

  if (!UPPERCASE_REGEX.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }

  if (!DIGIT_REGEX.test(password)) {
    return 'Password must contain at least one number'
  }

  return null
}
