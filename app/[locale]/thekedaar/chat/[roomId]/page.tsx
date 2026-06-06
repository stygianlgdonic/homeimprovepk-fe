'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useAuthStore } from '@/stores/auth.store'
import { Card } from '@/components/ui/Card'

export default function ThekedaarChatPage({
  params,
}: {
  params: Promise<{ locale: string; roomId: string }>
}) {
  const { locale, roomId } = use(params)
  const isUr = locale === 'ur'
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`)
    }
  }, [isAuthenticated, locale, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/${locale}/thekedaar`}
            className="rounded-lg p-2 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="font-semibold text-gray-900">
            {isUr ? 'چیٹ' : 'Chat'}
          </h1>
        </div>

        <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ChatWindow roomId={roomId} />
        </Card>
      </div>
    </div>
  )
}
