'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = '', onChange, error, placeholder = '3XX XXXXXXX', disabled, className }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow only digits
      const raw = e.target.value.replace(/\D/g, '')
      // Limit to 10 digits (after 0 or without it, the local number)
      const trimmed = raw.slice(0, 10)
      onChange?.(trimmed)
    }

    // Display value (without +92, without leading 0)
    const displayValue = value.startsWith('92')
      ? value.slice(2)
      : value.startsWith('0')
      ? value.slice(1)
      : value

    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Phone Number</label>
        <div
          className={cn(
            'flex items-center rounded-lg border border-gray-300 bg-white overflow-hidden',
            'focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent',
            error && 'border-red-500 focus-within:ring-red-500',
            disabled && 'bg-gray-50'
          )}
        >
          <span className="flex-shrink-0 bg-gray-50 border-r border-gray-300 px-3 py-2 text-sm text-gray-600 font-medium">
            +92
          </span>
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex-1 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400',
              'bg-transparent focus:outline-none',
              'disabled:cursor-not-allowed',
              className
            )}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <p className="text-xs text-gray-500">
          Enter your Pakistani mobile number (e.g. 3001234567)
        </p>
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }

// Helper to get full E.164 phone number
export function toE164(localNumber: string): string {
  const digits = localNumber.replace(/\D/g, '')
  // Remove leading 0 if present
  const local = digits.startsWith('0') ? digits.slice(1) : digits
  return `+92${local}`
}
