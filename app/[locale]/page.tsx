import Link from 'next/link'
import {
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Grid3x3,
  RotateCcw,
  Sparkles,
  CheckCircle,
  MessageSquare,
  Star,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface LandingPageProps {
  params: Promise<{ locale: string }>
}

const CATEGORIES = [
  { slug: 'plumbing', icon: Wrench, nameEn: 'Plumbing', nameUr: 'پلمبنگ', color: 'bg-blue-50 text-blue-600' },
  { slug: 'electrical', icon: Zap, nameEn: 'Electrical', nameUr: 'الیکٹریکل', color: 'bg-yellow-50 text-yellow-600' },
  { slug: 'painting', icon: Paintbrush, nameEn: 'Painting', nameUr: 'پینٹنگ', color: 'bg-pink-50 text-pink-600' },
  { slug: 'carpentry', icon: Hammer, nameEn: 'Carpentry', nameUr: 'بڑھئی کا کام', color: 'bg-amber-50 text-amber-600' },
  { slug: 'tiling', icon: Grid3x3, nameEn: 'Tiling', nameUr: 'ٹائلنگ', color: 'bg-purple-50 text-purple-600' },
  { slug: 'renovation', icon: RotateCcw, nameEn: 'Renovation', nameUr: 'تزئین و آرائش', color: 'bg-green-50 text-green-600' },
  { slug: 'cleaning', icon: Sparkles, nameEn: 'Cleaning', nameUr: 'صفائی', color: 'bg-teal-50 text-teal-600' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    iconEn: 'Post Your Job',
    iconUr: 'اپنا کام پوسٹ کریں',
    descEn: 'Describe your home improvement project, set your budget, and upload photos',
    descUr: 'اپنے گھریلو بہتری کے منصوبے کی تفصیل بیان کریں، بجٹ طے کریں، اور تصاویر اپلوڈ کریں',
  },
  {
    step: '02',
    iconEn: 'Get Quotes',
    iconUr: 'قیمتیں حاصل کریں',
    descEn: 'Verified contractors in your city will send you competitive quotes',
    descUr: 'آپ کے شہر میں تصدیق شدہ ٹھیکیدار آپ کو مسابقتی قیمتیں بھیجیں گے',
  },
  {
    step: '03',
    iconEn: 'Hire & Get It Done',
    iconUr: 'ملازمت کریں اور کام مکمل کروائیں',
    descEn: 'Choose the best quote, communicate via chat, and track your project',
    descUr: 'بہترین قیمت چنیں، چیٹ کے ذریعے رابطہ کریں، اور اپنا منصوبہ ٹریک کریں',
  },
]

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params
  const isUr = locale === 'ur'

  return (
    <div className={isUr ? 'font-urdu' : ''}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')] opacity-20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Star className="h-4 w-4 fill-white" />
              <span>
                {isUr ? 'پاکستان کا پہلا تصدیق شدہ پلیٹ فارم' : "Pakistan's First Verified Platform"}
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {isUr
                ? 'پاکستان کا پہلا تصدیق شدہ گھریلو بہتری مارکیٹ پلیس'
                : "Pakistan's First Verified Home Improvement Marketplace"}
            </h1>
            <p className="mt-6 text-lg text-green-100 max-w-xl">
              {isUr
                ? 'اپنی تمام گھریلو بہتری کی ضروریات کے لیے قابل اعتماد، تصدیق شدہ ٹھیکیداروں سے رابطہ کریں'
                : 'Connect with trusted, verified contractors for all your home improvement needs'}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/${locale}/browse`}>
                <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-green-50 border-0">
                  {isUr ? 'ٹھیکیدار تلاش کریں' : 'Browse Contractors'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/${locale}/post-job`}>
                <Button size="lg" variant="ghost" className="text-white border-white/30 hover:bg-white/10 border">
                  {isUr ? 'کام پوسٹ کریں' : 'Post a Job'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {isUr ? 'قسم کے مطابق تلاش کریں' : 'Browse by Category'}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {CATEGORIES.map(({ slug, icon: Icon, nameEn, nameUr, color }) => (
              <Link
                key={slug}
                href={`/${locale}/browse?category=${slug}`}
                className="flex flex-col items-center gap-3 rounded-xl p-4 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {isUr ? nameUr : nameEn}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {isUr ? 'یہ کیسے کام کرتا ہے' : 'How It Works'}
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, iconEn, iconUr, descEn, descUr }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white text-xl font-bold">
                  {step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isUr ? iconUr : iconEn}
                </h3>
                <p className="text-sm text-gray-600">
                  {isUr ? descUr : descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contractor CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Hammer className="h-12 w-12 opacity-90" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {isUr ? 'کیا آپ ٹھیکیدار ہیں؟' : 'Are You a Contractor?'}
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-xl mx-auto">
            {isUr
              ? 'پاکستان کے سب سے قابل اعتماد پلیٹ فارم پر شامل ہوں اور تصدیق شدہ کلائنٹس کے ساتھ اپنا کاروبار بڑھائیں'
              : "Join Pakistan's most trusted platform and grow your business with verified clients"}
          </p>
          <Link href={`/${locale}/auth/login`}>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-green-700 hover:bg-green-50 border-0"
            >
              {isUr ? 'ٹھیکیدار کے طور پر رجسٹر کریں' : 'Register as Contractor'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: CheckCircle, label: isUr ? 'تصدیق شدہ ٹھیکیدار' : 'Verified Contractors', color: 'text-green-600' },
              { icon: MessageSquare, label: isUr ? 'براہ راست چیٹ' : 'Direct Chat', color: 'text-blue-600' },
              { icon: Star, label: isUr ? 'جائزہ شدہ خدمات' : 'Reviewed Services', color: 'text-yellow-500' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className={`h-8 w-8 ${color}`} />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
