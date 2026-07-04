'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Hammer } from 'lucide-react'
import { PhoneInput, toE164 } from '@/components/forms/PhoneInput'
import { OtpInput } from '@/components/forms/OtpInput'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/auth.store'
import { requestOtp, verifyOtp } from '@/lib/api'

type Step = 'phone' | 'otp'

export default function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const isUr = locale === 'ur'
  const router = useRouter()
  const { setToken, setUser } = useAuthStore()

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [otpError, setOtpError] = useState('')

  const validatePhone = (val: string) => {
    if (!val || val.length < 10) {
      setPhoneError(isUr ? 'درست فون نمبر درج کریں' : 'Enter a valid 10-digit phone number')
      return false
    }
    setPhoneError('')
    return true
  }

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) return

    setIsLoading(true)
    try {
      await requestOtp(toE164(phone))
      setStep('otp')
      toast.success(isUr ? 'OTP بھیج دیا گیا' : 'OTP sent successfully!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError(isUr ? '6 ہندسوں کا کوڈ درج کریں' : 'Enter the 6-digit code')
      return
    }
    setOtpError('')
    setIsLoading(true)

    try {
      const { accessToken, isNewUser } = await verifyOtp(toE164(phone), otp)
      setToken(accessToken)

      if (isNewUser) {
        router.push(`/${locale}/auth/complete`)
      } else {
        toast.success(isUr ? 'خوش آمدید!' : 'Welcome back!')
        router.push(`/${locale}/dashboard`)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP'
      setOtpError(isUr ? 'غلط کوڈ۔ دوبارہ کوشش کریں' : 'Invalid code. Please try again.')
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-green-600">
            <Hammer className="h-8 w-8" />
            <span className="text-2xl font-bold">HomeImprovePK</span>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            {step === 'phone' ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isUr ? 'لاگ ان کریں' : 'Login to HomeImprovePK'}
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    {isUr ? 'شروع کرنے کے لیے اپنا فون نمبر درج کریں' : 'Enter your phone number to get started'}
                  </p>
                </div>

                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  error={phoneError}
                  disabled={isLoading}
                />

                <Button
                  onClick={handleSendOtp}
                  isLoading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isUr ? 'OTP بھیجیں' : 'Send OTP'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isUr ? 'تصدیقی کوڈ درج کریں' : 'Enter Verification Code'}
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    {isUr ? 'ہم نے کوڈ بھیجا ہے' : 'We sent a 6-digit code to'}{' '}
                    <span className="font-medium text-gray-900">+92{phone}</span>
                  </p>
                </div>

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  length={6}
                  disabled={isLoading}
                  error={otpError}
                />

                <Button
                  onClick={handleVerifyOtp}
                  isLoading={isLoading}
                  disabled={otp.length !== 6}
                  className="w-full"
                  size="lg"
                >
                  {isUr ? 'تصدیق کریں' : 'Verify'}
                </Button>

                <div className="flex justify-between text-sm">
                  <button
                    onClick={() => setStep('phone')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isUr ? 'نمبر تبدیل کریں' : 'Change Number'}
                  </button>
                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                  >
                    {isUr ? 'کوڈ دوبارہ بھیجیں' : 'Resend Code'}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
