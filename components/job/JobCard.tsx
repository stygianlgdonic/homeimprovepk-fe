'use client'

import Link from 'next/link'
import { MapPin, Clock, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge, statusVariant } from '@/components/ui/Badge'
import { formatPKR, timeAgo } from '@/lib/utils'
import type { JobPost } from '@/types'

interface JobCardProps {
  job: JobPost
  locale?: string
  linkPrefix?: string // e.g. '/en/dashboard/jobs' or '/en/contractor/jobs'
}

export function JobCard({ job, locale = 'en', linkPrefix }: JobCardProps) {
  const href = linkPrefix
    ? `${linkPrefix}/${job.id}`
    : `/${locale}/dashboard/jobs/${job.id}`

  return (
    <Link href={href} className="block group">
      <Card className="group-hover:shadow-md transition-shadow">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                {job.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {job.description}
              </p>
            </div>
            <Badge variant={statusVariant(job.status)} className="flex-shrink-0">
              {job.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            {/* Category */}
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {locale === 'ur' ? job.category.nameUr : job.category.nameEn}
            </span>

            {/* City */}
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {locale === 'ur' ? job.city.nameUr : job.city.nameEn}
              {job.area && `, ${job.area}`}
            </span>

            {/* Time */}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(job.createdAt)}
            </span>
          </div>

          {/* Budget */}
          {(job.budgetMin || job.budgetMax) && (
            <div className="mt-2 text-xs font-medium text-green-600">
              Budget:{' '}
              {job.budgetMin && job.budgetMax
                ? `${formatPKR(job.budgetMin)} – ${formatPKR(job.budgetMax)}`
                : job.budgetMin
                ? `From ${formatPKR(job.budgetMin)}`
                : `Up to ${formatPKR(job.budgetMax!)}`}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
