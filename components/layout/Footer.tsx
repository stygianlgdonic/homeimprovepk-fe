import Link from 'next/link'
import { Hammer } from 'lucide-react'

interface FooterProps {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  const isUr = locale === 'ur'

  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-green-600"
          >
            <Hammer className="h-5 w-5" />
            <span className="font-bold">
              {isUr ? 'ہوم امپروو پی کے' : 'HomeImprovePK'}
            </span>
          </Link>

          <p className="text-sm text-gray-500 text-center">
            {isUr
              ? 'پاکستان کا پہلا تصدیق شدہ گھریلو بہتری مارکیٹ پلیس'
              : "Pakistan's First Verified Home Improvement Marketplace"}
          </p>

          <p className="text-xs text-gray-400">
            {isUr
              ? '© 2024 ہوم امپروو پی کے'
              : '© 2024 HomeImprovePK'}
          </p>
        </div>
      </div>
    </footer>
  )
}
