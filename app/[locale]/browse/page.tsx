'use client'

import { useState, use, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SlidersHorizontal, SearchX } from 'lucide-react'
import { ProfileCard } from '@/components/contractor/ProfileCard'
import { Button } from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { getContractors, getCategories, getCities } from '@/lib/api'
import type { ContractorProfile, ServiceCategory, City } from '@/types'
import { cn } from '@/lib/utils'

export default function BrowsePage({
  params,
  searchParams: searchParamsProp,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; city?: string; page?: string }>
}) {
  const { locale } = use(params)
  const sp = use(searchParamsProp)
  const isUr = locale === 'ur'
  const router = useRouter()
  const [currentSearchParams] = [sp]

  const [contractors, setContractors] = useState<ContractorProfile[]>([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedCategory, setSelectedCategory] = useState(currentSearchParams.category || '')
  const [selectedCity, setSelectedCity] = useState(currentSearchParams.city || '')
  const [page, setPage] = useState(Number(currentSearchParams.page) || 1)
  const [isLoading, setIsLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

  const LIMIT = 12

  useEffect(() => {
    async function loadCatalog() {
      const [cats, cityList] = await Promise.all([getCategories(), getCities()])
      setCategories(cats)
      setCities(cityList)
    }
    loadCatalog()
  }, [])

  useEffect(() => {
    async function loadContractors() {
      setIsLoading(true)
      try {
        const result = await getContractors({
          category: selectedCategory || undefined,
          city: selectedCity || undefined,
          page,
          limit: LIMIT,
        })
        setContractors(result.data)
        setTotal(result.total)
      } catch {
        setContractors([])
      } finally {
        setIsLoading(false)
      }
    }
    loadContractors()
  }, [selectedCategory, selectedCity, page])

  const updateFilter = (type: 'category' | 'city', value: string) => {
    if (type === 'category') setSelectedCategory(value)
    else setSelectedCity(value)
    setPage(1)
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isUr ? 'ٹھیکیدار تلاش کریں' : 'Find a Contractor'}
            </h1>
            {!isLoading && (
              <p className="mt-1 text-sm text-gray-500">
                {total} {isUr ? 'نتائج' : 'results'}
              </p>
            )}
          </div>
          <button
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:hidden"
            onClick={() => setFilterOpen((o) => !o)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {isUr ? 'فلٹر' : 'Filters'}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={cn(
              'w-64 flex-shrink-0',
              'sm:block',
              filterOpen ? 'block' : 'hidden'
            )}
          >
            <div className="rounded-xl border border-gray-200 bg-white p-4 sticky top-20">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  {isUr ? 'قسم' : 'Category'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      !selectedCategory
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {isUr ? 'سب' : 'All'}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('category', cat.slug)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                        selectedCategory === cat.slug
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {isUr ? cat.nameUr : cat.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  {isUr ? 'شہر' : 'City'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateFilter('city', '')}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      !selectedCity
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {isUr ? 'سب' : 'All'}
                  </button>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => updateFilter('city', city.slug)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                        selectedCity === city.slug
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {isUr ? city.nameUr : city.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : contractors.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title={isUr ? 'کوئی ٹھیکیدار نہیں ملا' : 'No contractors found'}
                description={isUr ? 'اپنے فلٹر تبدیل کریں' : 'Try adjusting your filters'}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contractors.map((t) => (
                    <ProfileCard key={t.id} contractor={t} locale={locale} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      {isUr ? 'پچھلا' : 'Previous'}
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-600">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      {isUr ? 'اگلا' : 'Next'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
