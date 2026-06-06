'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Tag, Calendar, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { RatingStars } from '@/components/thekedaar/RatingStars'
import { QuoteCard } from '@/components/job/QuoteCard'
import { getJob, acceptQuote, updateJobStatus, createReview, getChatRooms } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { timeAgo, formatPKR } from '@/lib/utils'
import type { JobPost } from '@/types'

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = use(params)
  const isUr = locale === 'ur'
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [job, setJob] = useState<JobPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [chatRoomId, setChatRoomId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`)
      return
    }
    async function load() {
      try {
        const data = await getJob(id)
        setJob(data)
        // Try to find chat room
        if (data.booking) {
          const rooms = await getChatRooms()
          const room = rooms.find((r) => r.jobPostId === data.id)
          if (room) setChatRoomId(room.id)
        }
      } catch {
        toast.error('Failed to load job')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [isAuthenticated, id, locale, router])

  const handleAcceptQuote = async (quoteId: string) => {
    setIsAccepting(true)
    try {
      await acceptQuote(quoteId)
      toast.success(isUr ? 'قیمت قبول کر لی گئی' : 'Quote accepted!')
      const data = await getJob(id)
      setJob(data)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to accept quote')
    } finally {
      setIsAccepting(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!job?.booking) return
    setIsCompleting(true)
    try {
      await updateJobStatus(id, 'COMPLETED')
      toast.success(isUr ? 'کام مکمل قرار دے دیا گیا' : 'Job marked as complete!')
      const data = await getJob(id)
      setJob(data)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!job?.booking) return
    setIsReviewing(true)
    try {
      await createReview({
        bookingId: job.booking.id,
        rating: reviewRating,
        comment: reviewComment || undefined,
      })
      setReviewSubmitted(true)
      toast.success(isUr ? 'جائزہ جمع ہو گیا' : 'Review submitted!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsReviewing(false)
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

  const hasAcceptedQuote = job.quotes?.some((q) => q.status === 'ACCEPTED')
  const canReview = job.status === 'COMPLETED' && !reviewSubmitted

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href={`/${locale}/dashboard`} className="hover:text-green-600">
            {isUr ? 'میرے کام' : 'My Jobs'}
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{job.title}</span>
        </div>

        {/* Job header */}
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

        {/* Booking info */}
        {job.booking && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold text-gray-900 mb-3">
                {isUr ? 'بکنگ' : 'Booking'}
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    {isUr ? 'ٹھیکیدار:' : 'Thekedaar:'}{' '}
                    <span className="font-medium">{job.booking.thekedaar.name}</span>
                  </p>
                  <Badge variant={statusVariant(job.booking.status)} className="mt-1">
                    {job.booking.status.replace('_', ' ')}
                  </Badge>
                </div>
                {chatRoomId && (
                  <Link href={`/${locale}/dashboard/chat/${chatRoomId}`}>
                    <Button size="sm" variant="secondary">
                      <MessageSquare className="h-4 w-4" />
                      {isUr ? 'چیٹ' : 'Chat'}
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
            {job.status === 'IN_PROGRESS' && (
              <CardFooter>
                <Button
                  size="sm"
                  onClick={handleMarkComplete}
                  isLoading={isCompleting}
                  className="w-full"
                >
                  {isUr ? 'مکمل قرار دیں' : 'Mark as Complete'}
                </Button>
              </CardFooter>
            )}
          </Card>
        )}

        {/* Quotes */}
        {!hasAcceptedQuote && job.quotes && job.quotes.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">
              {isUr ? 'موصول قیمتیں' : 'Quotes Received'}
              <span className="ml-2 text-sm text-gray-400 font-normal">
                ({job.quotes.length})
              </span>
            </h2>
            <div className="space-y-3">
              {job.quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onAccept={handleAcceptQuote}
                  isAccepting={isAccepting}
                  canAccept={job.status === 'OPEN'}
                />
              ))}
            </div>
          </div>
        )}

        {!hasAcceptedQuote && (!job.quotes || job.quotes.length === 0) && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500 text-sm">
                {isUr ? 'ابھی تک کوئی قیمت نہیں' : 'No quotes yet'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isUr ? 'ٹھیکیدار قیمتیں بھیجیں گے' : 'Thekedaars will send quotes soon'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Review */}
        {canReview && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                {isUr ? 'جائزہ لکھیں' : 'Leave a Review'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    {isUr ? 'ریٹنگ' : 'Rating'}
                  </label>
                  <RatingStars
                    rating={reviewRating}
                    size="lg"
                    interactive
                    onChange={setReviewRating}
                  />
                </div>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={isUr ? 'اپنا تجربہ شیئر کریں...' : 'Share your experience...'}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button
                  onClick={handleSubmitReview}
                  isLoading={isReviewing}
                  className="w-full"
                >
                  {isUr ? 'جائزہ جمع کریں' : 'Submit Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
