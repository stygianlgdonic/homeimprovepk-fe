'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { setClientToken } from '@/lib/api'

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setToken: (token) => {
        setClientToken(token)
        set({ token, isAuthenticated: !!token })
      },

      setUser: (user) => {
        set({ user })
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      logout: () => {
        setClientToken(null)
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'thekedaar-auth',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setClientToken(state.token)
        }
      },
    }
  )
)
