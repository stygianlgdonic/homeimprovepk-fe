'use client'

import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  className?: string
  trend?: {
    value: number
    label: string
  }
}

export function StatsCard({ label, value, icon, className, trend }: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p
              className={cn(
                'mt-1 text-xs font-medium',
                trend.value >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
