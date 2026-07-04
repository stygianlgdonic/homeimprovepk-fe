'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, Hammer } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface NavbarProps {
  locale: string
}

export function Navbar({ locale }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const isUr = locale === 'ur'
  const altLocale = isUr ? 'en' : 'ur'

  const handleLocaleSwitch = () => {
    // Switch locale prefix in URL
    const path = window.location.pathname
    const newPath = path.replace(`/${locale}`, `/${altLocale}`)
    router.push(newPath + window.location.search)
  }

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/auth/login`)
  }

  const navLinks = [
    { label: isUr ? 'تلاش کریں' : 'Browse', href: `/${locale}/browse` },
    ...(isAuthenticated && user?.role === 'HOMEOWNER'
      ? [{ label: isUr ? 'کام پوسٹ کریں' : 'Post a Job', href: `/${locale}/post-job` }]
      : []),
  ]

  const dashboardHref =
    user?.role === 'CONTRACTOR'
      ? `/${locale}/contractor`
      : user?.role === 'ADMIN'
      ? `/${locale}/admin`
      : `/${locale}/dashboard`

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <Hammer className="h-6 w-6" />
            <span className={cn('font-bold text-lg', isUr && 'font-urdu')}>
              {isUr ? 'ہوم امپروو پی کے' : 'HomeImprovePK'}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium text-gray-600 hover:text-green-600 transition-colors',
                  isUr && 'font-urdu'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Locale toggle */}
            <button
              onClick={handleLocaleSwitch}
              className="hidden md:flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {isUr ? 'EN' : 'اردو'}
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-2.5 hover:bg-gray-50 transition-colors">
                  <div className="h-7 w-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                    {(user.name || user.phone).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700 max-w-[100px] truncate">
                    {user.name || user.phone}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="z-50 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                    sideOffset={8}
                    align="end"
                  >
                    <DropdownMenu.Item asChild>
                      <Link
                        href={dashboardHref}
                        className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer"
                      >
                        {isUr ? 'میرا ڈیش بورڈ' : 'My Dashboard'}
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href={`/${locale}/profile`}
                        className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer"
                      >
                        {isUr ? 'میری پروفائل' : 'My Profile'}
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 border-t border-gray-100" />
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        {isUr ? 'لاگ آؤٹ' : 'Logout'}
                      </button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <Link href={`/${locale}/auth/login`} className="hidden md:block">
                <Button size="sm">{isUr ? 'لاگ ان' : 'Login'}</Button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-gray-700 hover:text-green-600"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { handleLocaleSwitch(); setMobileOpen(false) }}
            className="block py-2 text-sm text-gray-600"
          >
            {isUr ? 'Switch to English' : 'اردو میں دیکھیں'}
          </button>
          {isAuthenticated ? (
            <>
              <Link
                href={dashboardHref}
                className="block py-2 text-sm text-gray-700 hover:text-green-600"
                onClick={() => setMobileOpen(false)}
              >
                {isUr ? 'میرا ڈیش بورڈ' : 'My Dashboard'}
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false) }}
                className="block w-full text-left py-2 text-sm text-red-600"
              >
                {isUr ? 'لاگ آؤٹ' : 'Logout'}
              </button>
            </>
          ) : (
            <Link
              href={`/${locale}/auth/login`}
              className="block"
              onClick={() => setMobileOpen(false)}
            >
              <Button size="sm" className="w-full">
                {isUr ? 'لاگ ان' : 'Login'}
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
