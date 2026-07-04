'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { JobCard } from '@/components/job/JobCard'
import { Button } from '@/components/ui/Button'
import { getJobs, getCategories } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import type { JobPost, ServiceCategory } from '@/types'
import { cn } from '@/lib/utils'

export default function ContractorJobFeedPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const isUr = locale === 'ur'
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuthStore()

  const [jobs, setJobs] = useState<JobPost[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`)
    }
  }, [isAuthenticated, authLoading, locale, router])

  useEffect(() => {
    async function load() {
      const [cats] = await Promise.all([getCategories()])
      setCategories(cats)
    }
    load()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    async function loadJobs() {
      setIsLoading(true)
      try {
        const result = await getJobs({
          status: 'OPEN',
          category: selectedCategory || undefined,
          limit: 20,
        })
        setJobs(result.data)
      } catch {
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }
    loadJobs()
  }, [isAuthenticated, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isUr ? 'دستیاب کام' : 'Available Jobs'}
          </h1>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/${locale}/contractor/profile`)}
          >
            {isUr ? 'میری پروفائل' : 'My Profile'}
          </Button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap',
              !selectedCategory ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            )}
          >
            {isUr ? 'سب' : 'All'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap',
                selectedCategory === cat.slug ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
              )}
            >
              {isUr ? cat.nameUr : cat.nameEn}
            </button>
          ))}
        </div>

        {/* Jobs */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">{isUr ? 'کوئی کام دستیاب نہیں' : 'No jobs available'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                locale={locale}
                linkPrefix={`/${locale}/contractor/jobs`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
