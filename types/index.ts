export interface User {
  id: string
  phone: string
  name?: string
  role: 'HOMEOWNER' | 'THEKEDAAR' | 'ADMIN'
  preferredLang: 'en' | 'ur'
  avatarUrl?: string
  thekedaarProfile?: ThekedaarProfile
}

export interface ThekedaarProfile {
  id: string
  userId: string
  bio?: string
  cnicNumber?: string
  cnicVerified: boolean
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  portfolioPhotos: string[]
  pricingRangeMin?: number
  pricingRangeMax?: number
  avgRating: number
  totalJobs: number
  serviceCategories: ServiceCategory[]
  cities: City[]
}

export interface ServiceCategory {
  id: string
  slug: string
  nameEn: string
  nameUr: string
  icon: string
}

export interface City {
  id: string
  slug: string
  nameEn: string
  nameUr: string
}

export interface JobPost {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  category: ServiceCategory
  city: City
  area?: string
  photos: string[]
  budgetMin?: number
  budgetMax?: number
  homeowner: User
  quotes?: Quote[]
  booking?: Booking
  createdAt: string
}

export interface Quote {
  id: string
  jobPostId: string
  amount: number
  description: string
  estimatedDays: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  thekedaar: User
}

export interface Booking {
  id: string
  jobPostId: string
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISPUTED'
  scheduledAt?: string
  completedAt?: string
  homeowner: User
  thekedaar: User
  payment?: Payment
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  status: 'PENDING' | 'PAID' | 'REFUNDED'
  method: string
}

export interface Review {
  id: string
  rating: number
  comment?: string
  author: User
  createdAt: string
}

export interface ChatRoom {
  id: string
  jobPostId: string
  homeowner: User
  thekedaar: User
}

export interface Message {
  id: string
  chatRoomId: string
  senderId: string
  content: string
  readAt?: string
  createdAt: string
}

export interface Notification {
  id: string
  type: string
  payload: Record<string, unknown>
  readAt?: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface AdminStats {
  totalUsers: number
  totalThekedaars: number
  totalJobs: number
  completedJobs: number
  totalRevenue: number
}
