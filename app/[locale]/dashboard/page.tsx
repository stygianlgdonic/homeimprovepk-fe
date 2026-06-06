'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { JobCard } from '@/components/job/JobCard'
import { Button } from '@/components/ui/Button'
import { getJobs } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'
import type { JobPost } from '@/types'
import { cn } from '@/lib/utils'

const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const

export default function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const isUr = locale === 'ur'
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuthStore()

  const [jobs, setJobs] = useState<JobPost[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`)
    }
  }, [isAuthenticated, authLoading, locale, router])

  useEffect(() => {
    if (!isAuthenticated) return
    async function load() {
      setIsLoading(true)
      try {
        const result = await getJobs({
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
          limit: 20,
        })
        setJobs(result.data)
      } catch {
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [isAuthenticated, selectedStatus])

  const statusLabels: Record<string, string> = {
    ALL: isUr ? 'سب' : 'All',
    OPEN: isUr ? 'کھلا' : 'Open',
    IN_PROGRESS: isUr ? 'جاری' : 'In Progress',
    COMPLETED: isUr ? 'مکمل' : 'Completed',
    CANCELLED: isUr ? 'منسوخ' : 'Cancelled',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isUr ? 'میرے کام' : 'My Jobs'}
          </h1>
          <Link href={`/${locale}/post-job`}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              {isUr ? 'کام پوسٹ کریں' : 'Post a Job'}
            </Button>
          </Link>
        </div>

        {/* Status filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                selectedStatus === s
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>

        {/* Jobs list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-medium text-gray-900">
              {isUr ? 'ابھی تک کوئی کام نہیں' : 'No jobs yet'}
            </p>
            <p className="mt-1 text-sm text-gray-500 mb-6">
              {isUr ? 'تصدیق شدہ ٹھیکیداروں سے قیمتیں حاصل کریں' : 'Post your first job to get quotes'}
            </p>
            <Link href={`/${locale}/post-job`}>
              <Button>{isUr ? 'کام پوسٹ کریں' : 'Post a Job'}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                locale={locale}
                linkPrefix={`/${locale}/dashboard/jobs`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
