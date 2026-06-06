'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { getMe } from '@/lib/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const user = await getMe()
        setUser(user)
      } catch {
        // Token invalid or expired
        logout()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return <>{children}</>
}
