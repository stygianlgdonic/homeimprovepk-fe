'use client'

import { Calendar, User } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPKR, timeAgo } from '@/lib/utils'
import type { Quote } from '@/types'

interface QuoteCardProps {
  quote: Quote
  onAccept?: (quoteId: string) => void
  isAccepting?: boolean
  canAccept?: boolean
}

export function QuoteCard({ quote, onAccept, isAccepting, canAccept }: QuoteCardProps) {
  const contractorName = quote.contractor.name || 'Contractor'

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{contractorName}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              {formatPKR(quote.amount)}
            </p>
            <Badge variant={statusVariant(quote.status)} className="mt-1">
              {quote.status}
            </Badge>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">{quote.description}</p>

        <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Estimated: {quote.estimatedDays} day{quote.estimatedDays !== 1 ? 's' : ''}</span>
        </div>
      </CardContent>

      {canAccept && quote.status === 'PENDING' && onAccept && (
        <CardFooter>
          <Button
            size="sm"
            onClick={() => onAccept(quote.id)}
            isLoading={isAccepting}
            className="w-full"
          >
            Accept Quote
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
