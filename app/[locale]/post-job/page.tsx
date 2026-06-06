'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Wrench, Zap, Paintbrush, Hammer, Grid3x3, RotateCcw, Sparkles,
  Upload, X, ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import { getCategories, getCities, createJob, uploadFile } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import type { ServiceCategory, City } from '@/types'
import { cn } from '@/lib/utils'

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  plumbing: Wrench,
  electrical: Zap,
  painting: Paintbrush,
  carpentry: Hammer,
  tiling: Grid3x3,
  renovation: RotateCcw,
  cleaning: Sparkles,
}

export default function PostJobPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const isUr = locale === 'ur'
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [step, setStep] = useState(1)
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [cities, setCities] = useState<City[]>([])

  // Form state
  const [categorySlug, setCategorySlug] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [citySlug, setCitySlug] = useState('')
  const [area, setArea] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`)
      return
    }
    async function loadCatalog() {
      const [cats, citiesList] = await Promise.all([getCategories(), getCities()])
      setCategories(cats)
      setCities(citiesList)
    }
    loadCatalog()
  }, [isAuthenticated, locale, router])

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!categorySlug) newErrors.category = isUr ? 'قسم منتخب کریں' : 'Select a category'
    if (!title.trim()) newErrors.title = isUr ? 'عنوان درج کریں' : 'Enter a job title'
    if (!description.trim()) newErrors.description = isUr ? 'تفصیل درج کریں' : 'Enter a description'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!citySlug) newErrors.city = isUr ? 'شہر منتخب کریں' : 'Select a city'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (photos.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed')
      return
    }
    setIsUploading(true)
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f).then((r) => r.url)))
      setPhotos((prev) => [...prev, ...urls])
    } catch {
      toast.error('Failed to upload photos')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const job = await createJob({
        title,
        description,
        categorySlug,
        citySlug,
        area: area || undefined,
        photos,
        budgetMin: budgetMin ? Number(budgetMin) : undefined,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
      })
      toast.success(isUr ? 'کام پوسٹ ہو گیا!' : 'Job posted successfully!')
      router.push(`/${locale}/dashboard/jobs/${job.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to post job'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    isUr ? 'کام کی تفصیلات' : 'Job Details',
    isUr ? 'مقام اور تصاویر' : 'Location & Photos',
    isUr ? 'بجٹ اور تصدیق' : 'Budget & Confirm',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Steps indicator */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isUr ? 'کام پوسٹ کریں' : 'Post a Job'}
          </h1>
          <div className="flex items-center gap-2">
            {steps.map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium flex-shrink-0',
                    i + 1 < step ? 'bg-green-600 text-white' :
                    i + 1 === step ? 'bg-green-600 text-white ring-4 ring-green-100' :
                    'bg-gray-200 text-gray-500'
                  )}
                >
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={cn('text-xs hidden sm:block', i + 1 === step ? 'text-green-700 font-medium' : 'text-gray-400')}>
                  {label}
                </span>
                {i < 2 && <div className={cn('flex-1 h-0.5', i + 1 < step ? 'bg-green-600' : 'bg-gray-200')} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Card>
            <CardContent className="pt-6 space-y-5">
              <h2 className="font-semibold text-gray-900">{steps[0]}</h2>

              {/* Category grid */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  {isUr ? 'قسم منتخب کریں' : 'Select Category'}
                </label>
                {errors.category && <p className="text-xs text-red-600 mb-2">{errors.category}</p>}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.slug] || Hammer
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategorySlug(cat.slug)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 text-center transition-all',
                          categorySlug === cat.slug
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        )}
                      >
                        <Icon className={cn('h-5 w-5', categorySlug === cat.slug ? 'text-green-600' : 'text-gray-500')} />
                        <span className="text-xs font-medium text-gray-700 leading-tight">
                          {isUr ? cat.nameUr : cat.nameEn}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <Input
                label={isUr ? 'کام کا عنوان' : 'Job Title'}
                placeholder={isUr ? 'مثلاً باتھ روم میں ٹوٹا پائپ' : 'e.g. Fix leaking pipe in bathroom'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {isUr ? 'تفصیل' : 'Description'}
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isUr ? 'ضرورت کے کام کی تفصیل بیان کریں...' : 'Describe the work needed in detail...'}
                  className={cn(
                    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
                    errors.description && 'border-red-500'
                  )}
                />
                {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => { if (validateStep1()) setStep(2) }}
              >
                {isUr ? 'اگلا' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card>
            <CardContent className="pt-6 space-y-5">
              <h2 className="font-semibold text-gray-900">{steps[1]}</h2>

              <Select
                label={isUr ? 'شہر' : 'City'}
                placeholder={isUr ? 'شہر منتخب کریں' : 'Select city'}
                options={cities.map((c) => ({
                  value: c.slug,
                  label: isUr ? c.nameUr : c.nameEn,
                }))}
                value={citySlug}
                onValueChange={setCitySlug}
                error={errors.city}
              />

              <Input
                label={isUr ? 'علاقہ / محلہ' : 'Area / Neighbourhood'}
                placeholder={isUr ? 'مثلاً ڈی ایچ اے فیز 5' : 'e.g. DHA Phase 5'}
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />

              {/* Photo upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  {isUr ? 'تصاویر (زیادہ سے زیادہ 5)' : 'Photos (up to 5)'}
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  {isUr ? 'ٹھیکیداروں کو کام سمجھانے کے لیے تصاویر شامل کریں' : 'Add photos to help thekedaars understand the job'}
                </p>

                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {photos.map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover border border-gray-200" />
                        <button
                          onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {photos.length < 5 && (
                  <label className={cn(
                    'flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 cursor-pointer',
                    'hover:border-green-400 transition-colors',
                    isUploading && 'opacity-50 cursor-not-allowed'
                  )}>
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {isUploading ? (isUr ? 'اپلوڈ ہو رہا ہے...' : 'Uploading...') : (isUr ? 'تصاویر اپلوڈ کریں' : 'Upload photos')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                    />
                  </label>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>
                  {isUr ? 'پچھلا' : 'Back'}
                </Button>
                <Button size="lg" className="flex-1" onClick={() => { if (validateStep2()) setStep(3) }}>
                  {isUr ? 'اگلا' : 'Next'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Card>
            <CardContent className="pt-6 space-y-5">
              <h2 className="font-semibold text-gray-900">{steps[2]}</h2>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={isUr ? 'کم از کم بجٹ (روپے)' : 'Min Budget (PKR)'}
                  type="number"
                  min="0"
                  placeholder="0"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                />
                <Input
                  label={isUr ? 'زیادہ سے زیادہ بجٹ (روپے)' : 'Max Budget (PKR)'}
                  type="number"
                  min="0"
                  placeholder="0"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm">
                <h3 className="font-medium text-gray-900">{isUr ? 'خلاصہ' : 'Summary'}</h3>
                <p className="text-gray-600"><span className="font-medium">{isUr ? 'عنوان:' : 'Title:'}</span> {title}</p>
                <p className="text-gray-600"><span className="font-medium">{isUr ? 'قسم:' : 'Category:'}</span> {categories.find((c) => c.slug === categorySlug)?.[isUr ? 'nameUr' : 'nameEn']}</p>
                <p className="text-gray-600"><span className="font-medium">{isUr ? 'شہر:' : 'City:'}</span> {cities.find((c) => c.slug === citySlug)?.[isUr ? 'nameUr' : 'nameEn']}</p>
                {photos.length > 0 && (
                  <p className="text-gray-600"><span className="font-medium">{isUr ? 'تصاویر:' : 'Photos:'}</span> {photos.length}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep(2)}>
                  {isUr ? 'پچھلا' : 'Back'}
                </Button>
                <Button size="lg" className="flex-1" onClick={handleSubmit} isLoading={isSubmitting}>
                  {isUr ? 'کام پوسٹ کریں' : 'Post Job'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
