import { Users, HardHat, Briefcase, CheckCircle, DollarSign } from 'lucide-react'
import { getAdminStats } from '@/lib/api'
import { StatsCard } from '@/components/admin/StatsCard'
import { formatPKR } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isUr = locale === 'ur'

  let stats
  try {
    stats = await getAdminStats()
  } catch {
    stats = {
      totalUsers: 0,
      totalThekedaars: 0,
      totalJobs: 0,
      completedJobs: 0,
      totalRevenue: 0,
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isUr ? 'ایڈمن ڈیش بورڈ' : 'Admin Dashboard'}
          </h1>
          <div className="flex gap-3">
            <Link href={`/${locale}/admin/thekedaars`}>
              <Button variant="secondary" size="sm">
                {isUr ? 'تصدیق کی قطار' : 'Verification Queue'}
              </Button>
            </Link>
            <Link href={`/${locale}/admin/disputes`}>
              <Button variant="secondary" size="sm">
                {isUr ? 'تنازعات' : 'Disputes'}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatsCard
            label={isUr ? 'کل صارفین' : 'Total Users'}
            value={stats.totalUsers}
            icon={<Users className="h-6 w-6" />}
          />
          <StatsCard
            label={isUr ? 'کل ٹھیکیدار' : 'Total Thekedaars'}
            value={stats.totalThekedaars}
            icon={<HardHat className="h-6 w-6" />}
          />
          <StatsCard
            label={isUr ? 'کل کام' : 'Total Jobs'}
            value={stats.totalJobs}
            icon={<Briefcase className="h-6 w-6" />}
          />
          <StatsCard
            label={isUr ? 'مکمل کام' : 'Completed Jobs'}
            value={stats.completedJobs}
            icon={<CheckCircle className="h-6 w-6" />}
          />
          <StatsCard
            label={isUr ? 'کل آمدنی' : 'Total Revenue'}
            value={formatPKR(stats.totalRevenue)}
            icon={<DollarSign className="h-6 w-6" />}
          />
        </div>
      </div>
    </div>
  )
}
