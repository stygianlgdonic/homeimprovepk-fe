'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { RatingStars } from '@/components/contractor/RatingStars'
import { formatPKR } from '@/lib/utils'
import type { ContractorProfile } from '@/types'

interface ProfileCardProps {
  contractor: ContractorProfile
  locale?: string
}

export function ProfileCard({ contractor, locale = 'en' }: ProfileCardProps) {
  const profile = contractor
  const user = contractor.user

  const isVerified = profile.verificationStatus === 'APPROVED'
  const name = user?.name || 'Contractor'
  const categories = profile.serviceCategories.slice(0, 3)
  const cities = profile.cities.slice(0, 2)

  return (
    <Link
      href={`/${locale}/contractors/${contractor.id}`}
      className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-xl"
    >
      <Card className="group-hover:shadow-md group-hover:border-green-200 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border-2 border-green-200">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-green-600">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-green-600 fill-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">{name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <RatingStars rating={profile.avgRating} size="sm" />
                  <span className="text-xs text-gray-500">
                    ({profile.totalJobs} jobs)
                  </span>
                </div>
              </div>
              {isVerified && (
                <Badge variant="green">Verified</Badge>
              )}
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <Badge key={cat.id} variant="blue">
                    {locale === 'ur' ? cat.nameUr : cat.nameEn}
                  </Badge>
                ))}
              </div>
            )}

            {/* Cities */}
            {cities.length > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {cities.map((c) => locale === 'ur' ? c.nameUr : c.nameEn).join(', ')}
                </span>
              </div>
            )}

            {/* Price range */}
            {(profile.pricingRangeMin || profile.pricingRangeMax) && (
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <Briefcase className="h-3 w-3 flex-shrink-0" />
                <span>
                  {profile.pricingRangeMin && profile.pricingRangeMax
                    ? `${formatPKR(profile.pricingRangeMin)} – ${formatPKR(profile.pricingRangeMax)}/day`
                    : profile.pricingRangeMin
                    ? `From ${formatPKR(profile.pricingRangeMin)}/day`
                    : `Up to ${formatPKR(profile.pricingRangeMax!)}/day`}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-green-600 bg-white px-3 py-1.5 text-sm font-medium text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
            View Profile
          </span>
        </div>
      </CardContent>
      </Card>
    </Link>
  )
}
