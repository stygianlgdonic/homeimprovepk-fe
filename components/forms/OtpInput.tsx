'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  value?: string
  onChange?: (value: string) => void
  length?: number
  disabled?: boolean
  error?: string
}

export function OtpInput({
  value = '',
  onChange,
  length = 6,
  disabled = false,
  error,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const updateDigit = (index: number, char: string) => {
    const newDigits = [...digits]
    newDigits[index] = char
    onChange?.(newDigits.join(''))
  }

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    updateDigit(index, char)
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        updateDigit(index, '')
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        updateDigit(index - 1, '')
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange?.(pasted.padEnd(length, '').slice(0, length))
    const focusIdx = Math.min(pasted.length, length - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index] || ''}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              'h-12 w-12 rounded-lg border text-center text-lg font-semibold',
              'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
              'transition-colors',
              digits[index]
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 bg-white text-gray-900',
              error && 'border-red-500 focus:ring-red-500',
              disabled && 'cursor-not-allowed bg-gray-50 opacity-60'
            )}
          />
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}
