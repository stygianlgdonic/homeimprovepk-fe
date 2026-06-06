'use client'

import { cn } from '@/lib/utils'

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: React.ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-green-100 text-green-800 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
}

export function Badge({
  variant = 'gray',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Convenience: status → variant mapping
export function statusVariant(
  status: string
): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    OPEN: 'green',
    IN_PROGRESS: 'blue',
    COMPLETED: 'gray',
    CANCELLED: 'red',
    PENDING: 'yellow',
    ACCEPTED: 'green',
    REJECTED: 'red',
    APPROVED: 'green',
  }
  return map[status] ?? 'gray'
}
