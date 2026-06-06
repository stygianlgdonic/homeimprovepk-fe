import Link from 'next/link'
import { AlertTriangle, MapPin } from 'lucide-react'
import { getAdminDisputes } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { timeAgo } from '@/lib/utils'

export default async function AdminDisputesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isUr = locale === 'ur'

  let disputes: Awaited<ReturnType<typeof getAdminDisputes>> = []
  try {
    disputes = await getAdminDisputes()
  } catch {
    disputes = []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isUr ? 'تنازعات' : 'Disputes'}
        </h1>

        {disputes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-gray-500">
                {isUr ? 'کوئی فعال تنازعہ نہیں' : 'No active disputes'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {disputes.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-gray-900">
                          {isUr ? 'بکنگ #' : 'Booking #'}{booking.id.slice(-6).toUpperCase()}
                        </span>
                        <Badge variant={statusVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">{isUr ? 'گھر کا مالک:' : 'Homeowner:'}</span>{' '}
                          {booking.homeowner.name || booking.homeowner.phone}
                        </p>
                        <p>
                          <span className="font-medium">{isUr ? 'ٹھیکیدار:' : 'Thekedaar:'}</span>{' '}
                          {booking.thekedaar.name || booking.thekedaar.phone}
                        </p>
                        {booking.scheduledAt && (
                          <p className="text-xs text-gray-400">
                            {timeAgo(booking.scheduledAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link href={`/${locale}/admin/disputes/${booking.id}`}>
                      <Button variant="secondary" size="sm">
                        {isUr ? 'تفصیلات' : 'View Details'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
