'use client'

import { useState, use, useEffect } from 'react'
import { CheckCircle, XCircle, MapPin, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { getAdminThekedaars, verifyThekedaar } from '@/lib/api'
import type { User } from '@/types'

export default function AdminThekedaarsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const isUr = locale === 'ur'

  const [thekedaars, setThekedaars] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminThekedaars('PENDING')
        setThekedaars(data)
      } catch {
        toast.error('Failed to load thekedaars')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id)
    try {
      await verifyThekedaar(id, status)
      setThekedaars((prev) => prev.filter((t) => t.id !== id))
      toast.success(
        status === 'APPROVED'
          ? (isUr ? 'ٹھیکیدار منظور' : 'Thekedaar approved!')
          : (isUr ? 'ٹھیکیدار مسترد' : 'Thekedaar rejected')
      )
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to process')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isUr ? 'تصدیق کی قطار' : 'Verification Queue'}
        </h1>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : thekedaars.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {isUr ? 'کوئی زیر التواء تصدیق نہیں' : 'No pending verifications'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {thekedaars.map((t) => {
              const profile = t.thekedaarProfile
              return (
                <Card key={t.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-700 font-bold">
                              {(t.name || t.phone).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{t.name || t.phone}</p>
                            <p className="text-xs text-gray-500">{t.phone}</p>
                          </div>
                        </div>

                        {profile && (
                          <div className="mt-2 ml-13 flex flex-wrap gap-3 text-xs text-gray-500">
                            {profile.cnicNumber && (
                              <span>CNIC: {profile.cnicNumber}</span>
                            )}
                            {profile.serviceCategories.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {profile.serviceCategories.map((c) => isUr ? c.nameUr : c.nameEn).join(', ')}
                              </span>
                            )}
                            {profile.cities.length > 0 && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {profile.cities.map((c) => isUr ? c.nameUr : c.nameEn).join(', ')}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-2">
                          <Badge variant={statusVariant(profile?.verificationStatus || 'PENDING')}>
                            {profile?.verificationStatus || 'PENDING'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleVerify(t.id, 'REJECTED')}
                          isLoading={processingId === t.id}
                          disabled={processingId !== null}
                        >
                          <XCircle className="h-4 w-4" />
                          {isUr ? 'مسترد' : 'Reject'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleVerify(t.id, 'APPROVED')}
                          isLoading={processingId === t.id}
                          disabled={processingId !== null}
                        >
                          <CheckCircle className="h-4 w-4" />
                          {isUr ? 'منظور' : 'Approve'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
