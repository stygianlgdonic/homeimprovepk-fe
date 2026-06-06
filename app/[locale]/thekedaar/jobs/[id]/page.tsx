'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Tag, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { getJob, createQuote, getJobQuotes } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { timeAgo, formatPKR } from '@/lib/utils'
import type { JobPost, Quote } from '@/types'

export default function ThekedaarJobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = use(params)
  const isUr = locale === 'ur'
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  const [job, setJob] = useState<JobPost | null>(null)
  const [myQuote, setMyQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quote form
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedDays, setEstimatedDays] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`)
      return
    }
    async function load() {
      try {
        const [jobData, quotes] = await Promise.all([getJob(id), getJobQuotes(id)])
        setJob(jobData)
        const mine = quotes.find((q) => q.thekedaar.id === user?.id)
        setMyQuote(mine || null)
      } catch {
        toast.error('Failed to load job')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [isAuthenticated, id, locale, router, user?.id])

  const handleSubmitQuote = async () => {
    const newErrors: Record<string, string> = {}
    if (!amount || Number(amount) <= 0) newErrors.amount = isUr ? 'درست رقم درج کریں' : 'Enter a valid amount'
    if (!description.trim()) newErrors.description = isUr ? 'تفصیل درج کریں' : 'Enter a description'
    if (!estimatedDays || Number(estimatedDays) <= 0) newErrors.estimatedDays = isUr ? 'دن درج کریں' : 'Enter estimated days'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const quote = await createQuote(id, {
        amount: Number(amount),
        description,
        estimatedDays: Number(estimatedDays),
      })
      setMyQuote(quote)
      toast.success(isUr ? 'قیمت بھیج دی گئی!' : 'Quote submitted!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit quote')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-green-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!job) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href={`/${locale}/thekedaar`} className="hover:text-green-600">
            {isUr ? 'دستیاب کام' : 'Available Jobs'}
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{job.title}</span>
        </div>

        {/* Job details */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
              <Badge variant={statusVariant(job.status)}>
                {job.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-gray-600">{job.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {isUr ? job.category.nameUr : job.category.nameEn}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {isUr ? job.city.nameUr : job.city.nameEn}
                {job.area && `, ${job.area}`}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {timeAgo(job.createdAt)}
              </span>
            </div>
            {(job.budgetMin || job.budgetMax) && (
              <p className="mt-2 text-sm font-medium text-green-600">
                {isUr ? 'بجٹ:' : 'Budget:'}{' '}
                {job.budgetMin && job.budgetMax
                  ? `${formatPKR(job.budgetMin)} – ${formatPKR(job.budgetMax)}`
                  : job.budgetMin
                  ? `From ${formatPKR(job.budgetMin)}`
                  : `Up to ${formatPKR(job.budgetMax!)}`}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quote form or status */}
        {myQuote ? (
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold text-gray-900 mb-3">
                {isUr ? 'آپ کی قیمت' : 'Your Quote'}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{isUr ? 'رقم:' : 'Amount:'}</span>
                  <span className="font-semibold text-green-600">{formatPKR(myQuote.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{isUr ? 'تخمینی دن:' : 'Days:'}</span>
                  <span className="text-sm font-medium">{myQuote.estimatedDays} days</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-sm text-gray-500">{isUr ? 'حیثیت:' : 'Status:'}</span>
                  <Badge variant={statusVariant(myQuote.status)}>{myQuote.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">{myQuote.description}</p>
              </div>
            </CardContent>
          </Card>
        ) : job.status === 'OPEN' ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="font-semibold text-gray-900">
                {isUr ? 'قیمت بھیجیں' : 'Send Quote'}
              </h2>

              <Input
                label={isUr ? 'قیمت (روپے)' : 'Quote Amount (PKR)'}
                type="number"
                min="0"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={errors.amount}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {isUr ? 'تفصیل' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isUr ? 'اپنا طریقہ کار بیان کریں...' : 'Describe your approach and what\'s included...'}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
              </div>

              <Input
                label={isUr ? 'تخمینی دن' : 'Estimated Days'}
                type="number"
                min="1"
                placeholder="1"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                error={errors.estimatedDays}
              />

              <Button
                onClick={handleSubmitQuote}
                isLoading={isSubmitting}
                size="lg"
                className="w-full"
              >
                {isUr ? 'قیمت جمع کریں' : 'Submit Quote'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-sm text-gray-500">
                {isUr ? 'یہ کام اب قبولیت نہیں لے رہا' : 'This job is no longer accepting quotes'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
