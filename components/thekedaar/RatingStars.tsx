'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function RatingStars({
  rating,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(rating)
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={cn(
              'transition-transform',
              interactive && 'cursor-pointer hover:scale-110 focus:outline-none',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200',
                interactive && !filled && 'hover:fill-yellow-200 hover:text-yellow-200'
              )}
            />
          </button>
        )
      })}
      {!interactive && (
        <span className="ml-1 text-xs text-gray-500">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
