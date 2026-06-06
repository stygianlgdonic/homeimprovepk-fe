import type { Metadata } from 'next'
import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google'
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { SocketProvider } from '@/components/providers/SocketProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu',
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "ThekedaarPK — Pakistan's Verified Home Improvement Marketplace",
  description:
    "Connect with trusted, verified thekedaars for all your home improvement needs in Pakistan.",
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isRtl = locale === 'ur'

  let messages: AbstractIntlMessages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default as AbstractIntlMessages
  } catch {
    messages = (await import('@/messages/en.json')).default as AbstractIntlMessages
  }

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${notoNastaliqUrdu.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <SocketProvider>
              <ToastProvider />
              <Navbar locale={locale} />
              <main className="flex-1">{children}</main>
              <Footer locale={locale} />
            </SocketProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
