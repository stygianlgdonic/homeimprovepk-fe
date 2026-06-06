'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { RatingStars } from '@/components/thekedaar/RatingStars'
import { formatPKR } from '@/lib/utils'
import type { User } from '@/types'

interface ProfileCardProps {
  thekedaar: User
  locale?: string
}

export function ProfileCard({ thekedaar, locale = 'en' }: ProfileCardProps) {
  const profile = thekedaar.thekedaarProfile
  if (!profile) return null

  const isVerified = profile.verificationStatus === 'APPROVED'
  const name = thekedaar.name || 'Thekedaar'
  const categories = profile.serviceCategories.slice(0, 3)
  const cities = profile.cities.slice(0, 2)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border-2 border-green-200">
              {thekedaar.avatarUrl ? (
                <Image
                  src={thekedaar.avatarUrl}
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
                <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
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
          <Link href={`/${locale}/thekedaars/${thekedaar.id}`}>
            <Button variant="secondary" size="sm" className="w-full">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
