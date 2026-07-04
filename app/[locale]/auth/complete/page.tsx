'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Home, HardHat } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { completeOnboarding } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/lib/utils'

type Role = 'HOMEOWNER' | 'CONTRACTOR'

export default function CompletePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const isUr = locale === 'ur'
  const router = useRouter()
  const { setUser } = useAuthStore()

  const [name, setName] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [nameError, setNameError] = useState('')
  const [roleError, setRoleError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    let valid = true
    if (!name.trim()) {
      setNameError(isUr ? 'نام درج کریں' : 'Please enter your name')
      valid = false
    } else {
      setNameError('')
    }
    if (!role) {
      setRoleError(isUr ? 'کردار منتخب کریں' : 'Please select your role')
      valid = false
    } else {
      setRoleError('')
    }

    if (!valid) return

    setIsLoading(true)
    try {
      const user = await completeOnboarding({ name: name.trim(), role: role! })
      setUser(user)
      toast.success(isUr ? 'خوش آمدید!' : 'Welcome to HomeImprovePK!')
      if (role === 'CONTRACTOR') {
        router.push(`/${locale}/contractor`)
      } else {
        router.push(`/${locale}/dashboard`)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete setup'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isUr ? 'اپنی پروفائل مکمل کریں' : 'Complete Your Profile'}
          </h1>
          <p className="mt-2 text-gray-500">
            {isUr ? 'ہمیں اپنے بارے میں بتائیں' : 'Tell us a bit about yourself'}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <Input
              label={isUr ? 'پورا نام' : 'Full Name'}
              placeholder={isUr ? 'اپنا پورا نام درج کریں' : 'Enter your full name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
              disabled={isLoading}
            />

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {isUr ? 'میں ہوں...' : 'I am a...'}
              </p>
              {roleError && (
                <p className="text-xs text-red-600 mb-2">{roleError}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {([
                  {
                    value: 'HOMEOWNER' as Role,
                    Icon: Home,
                    titleEn: 'Homeowner',
                    titleUr: 'گھر کا مالک',
                    descEn: 'I need home improvement services',
                    descUr: 'مجھے گھریلو بہتری کی خدمات چاہئیں',
                  },
                  {
                    value: 'CONTRACTOR' as Role,
                    Icon: HardHat,
                    titleEn: 'Contractor',
                    titleUr: 'ٹھیکیدار',
                    descEn: 'I provide home improvement services',
                    descUr: 'میں گھریلو بہتری کی خدمات فراہم کرتا ہوں',
                  },
                ] as const).map(({ value, Icon, titleEn, titleUr, descEn, descUr }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all',
                      role === value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-8 w-8',
                        role === value ? 'text-green-600' : 'text-gray-400'
                      )}
                    />
                    <div>
                      <p className={cn('font-semibold', role === value ? 'text-green-700' : 'text-gray-900')}>
                        {isUr ? titleUr : titleEn}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isUr ? descUr : descEn}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              size="lg"
              className="w-full"
            >
              {isUr ? 'شروع کریں' : 'Get Started'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
