'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/auth.store'
import {
  getCategories, getCities, updateMyThekedaarProfile, uploadFile, getMe
} from '@/lib/api'
import type { ServiceCategory, City } from '@/types'
import { cn } from '@/lib/utils'

export default function ThekedaarProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const isUr = locale === 'ur'
  const router = useRouter()
  const { isAuthenticated, user, setUser } = useAuthStore()

  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [cities, setCities] = useState<City[]>([])

  // Form state
  const [bio, setBio] = useState('')
  const [cnic, setCnic] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`)
      return
    }
    async function load() {
      const [cats, cityList] = await Promise.all([getCategories(), getCities()])
      setCategories(cats)
      setCities(cityList)

      const me = await getMe()
      const profile = me.thekedaarProfile
      if (profile) {
        setBio(profile.bio || '')
        setCnic(profile.cnicNumber || '')
        setSelectedCategories(profile.serviceCategories.map((c) => c.slug))
        setSelectedCities(profile.cities.map((c) => c.slug))
        setPriceMin(profile.pricingRangeMin ? String(profile.pricingRangeMin) : '')
        setPriceMax(profile.pricingRangeMax ? String(profile.pricingRangeMax) : '')
        setPortfolioPhotos(profile.portfolioPhotos)
      }
    }
    load()
  }, [isAuthenticated, locale, router])

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const toggleCity = (slug: string) => {
    setSelectedCities((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (portfolioPhotos.length + files.length > 10) {
      toast.error('Maximum 10 portfolio photos')
      return
    }
    setIsUploading(true)
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f).then((r) => r.url)))
      setPortfolioPhotos((prev) => [...prev, ...urls])
    } catch {
      toast.error('Failed to upload photos')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateMyThekedaarProfile({
        bio: bio || undefined,
        cnicNumber: cnic || undefined,
        serviceCategorySlugs: selectedCategories,
        citySlugs: selectedCities,
        pricingRangeMin: priceMin ? Number(priceMin) : undefined,
        pricingRangeMax: priceMax ? Number(priceMax) : undefined,
      })
      // Refresh user
      const me = await getMe()
      setUser(me)
      toast.success(isUr ? 'پروفائل محفوظ ہو گئی' : 'Profile saved successfully!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isUr ? 'پروفائل میں ترمیم کریں' : 'Edit Profile'}
        </h1>

        {/* Bio & CNIC */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                {isUr ? 'تعارف' : 'Bio'}
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={isUr ? 'گھر کے مالکوں کو اپنے تجربے کے بارے میں بتائیں...' : 'Tell homeowners about your experience and skills...'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <Input
              label={isUr ? 'شناختی کارڈ نمبر' : 'CNIC Number'}
              placeholder="XXXXX-XXXXXXX-X"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Service Categories */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-medium text-gray-900 mb-3">
              {isUr ? 'سروس کی اقسام' : 'Service Categories'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.slug)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium border-2 transition-colors',
                    selectedCategories.includes(cat.slug)
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-green-300'
                  )}
                >
                  {isUr ? cat.nameUr : cat.nameEn}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cities */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-medium text-gray-900 mb-3">
              {isUr ? 'جن شہروں میں خدمات دیتے ہیں' : 'Cities You Serve'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => toggleCity(city.slug)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium border-2 transition-colors',
                    selectedCities.includes(city.slug)
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-green-300'
                  )}
                >
                  {isUr ? city.nameUr : city.nameEn}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-medium text-gray-900 mb-4">
              {isUr ? 'قیمت کی حد' : 'Price Range'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={isUr ? 'کم از کم قیمت فی دن (روپے)' : 'Min Price/Day (PKR)'}
                type="number"
                min="0"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <Input
                label={isUr ? 'زیادہ سے زیادہ قیمت فی دن (روپے)' : 'Max Price/Day (PKR)'}
                type="number"
                min="0"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-medium text-gray-900 mb-3">
              {isUr ? 'پورٹ فولیو تصاویر' : 'Portfolio Photos'}
            </h2>

            {portfolioPhotos.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {portfolioPhotos.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover border border-gray-200" />
                    <button
                      onClick={() => setPortfolioPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {portfolioPhotos.length < 10 && (
              <label className={cn(
                'flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 cursor-pointer hover:border-green-400 transition-colors',
                isUploading && 'opacity-50 cursor-not-allowed'
              )}>
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {isUploading ? (isUr ? 'اپلوڈ ہو رہا ہے...' : 'Uploading...') : (isUr ? 'تصاویر اپلوڈ کریں' : 'Upload portfolio photos')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isUploading}
                  onChange={handlePhotoUpload}
                />
              </label>
            )}
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          isLoading={isSaving}
          size="lg"
          className="w-full"
        >
          {isUr ? 'پروفائل محفوظ کریں' : 'Save Profile'}
        </Button>
      </div>
    </div>
  )
}
