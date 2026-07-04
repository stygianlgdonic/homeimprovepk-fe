import Image from 'next/image'
import Link from 'next/link'
import { MapPin, CheckCircle, Briefcase, Star } from 'lucide-react'
import { getContractor, getContractorReviews } from '@/lib/api'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { RatingStars } from '@/components/contractor/RatingStars'
import { formatPKR, timeAgo } from '@/lib/utils'

export default async function ContractorProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const isUr = locale === 'ur'

  let contractor
  let reviews
  try {
    [contractor, reviews] = await Promise.all([
      getContractor(id),
      getContractorReviews(id),
    ])
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Contractor not found</p>
      </div>
    )
  }

  const profile = contractor
  const name = contractor.user?.name || 'Contractor'
  const isVerified = profile.verificationStatus === 'APPROVED'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center overflow-hidden">
                  {contractor.user?.avatarUrl ? (
                    <Image
                      src={contractor.user.avatarUrl}
                      alt={name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-green-600">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {isVerified && (
                  <CheckCircle className="absolute bottom-0 right-0 h-6 w-6 text-green-600 fill-white" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-3 justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars rating={profile.avgRating} size="md" />
                      <span className="text-sm text-gray-500">
                        ({profile.totalJobs} {isUr ? 'کام' : 'jobs'})
                      </span>
                    </div>
                  </div>
                  {isVerified && (
                    <Badge variant="green" className="text-sm px-3 py-1">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      {isUr ? 'تصدیق شدہ' : 'Verified'}
                    </Badge>
                  )}
                </div>

                {/* Categories */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.serviceCategories.map((cat) => (
                    <Badge key={cat.id} variant="blue">
                      {isUr ? cat.nameUr : cat.nameEn}
                    </Badge>
                  ))}
                </div>

                {/* Cities & pricing */}
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                  {profile.cities.length > 0 && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.cities.map((c) => isUr ? c.nameUr : c.nameEn).join(', ')}
                    </span>
                  )}
                  {(profile.pricingRangeMin || profile.pricingRangeMax) && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {profile.pricingRangeMin && profile.pricingRangeMax
                        ? `${formatPKR(profile.pricingRangeMin)} – ${formatPKR(profile.pricingRangeMax)}/day`
                        : profile.pricingRangeMin
                        ? `From ${formatPKR(profile.pricingRangeMin)}/day`
                        : `Up to ${formatPKR(profile.pricingRangeMax!)}/day`}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4">
                  <Link href={`/${locale}/post-job?contractor=${id}`}>
                    <Button size="md">
                      {isUr ? 'کام پوسٹ کریں اور قیمت طلب کریں' : 'Post a Job & Request Quote'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        {profile.bio && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold text-gray-900 mb-3">
                {isUr ? 'تعارف' : 'About'}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Portfolio */}
        {profile.portfolioPhotos.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                {isUr ? 'پورٹ فولیو' : 'Portfolio'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {profile.portfolioPhotos.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={url}
                      alt={`Portfolio ${i + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              {isUr ? 'جائزے' : 'Reviews'}
              {reviews.length > 0 && (
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({reviews.length})
                </span>
              )}
            </h2>

            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500">
                {isUr ? 'ابھی تک کوئی جائزہ نہیں' : 'No reviews yet'}
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Star className="h-4 w-4 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {review.author.name || 'Homeowner'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RatingStars rating={review.rating} size="sm" />
                        <span className="text-xs text-gray-400">
                          {timeAgo(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-gray-600 ml-10">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
