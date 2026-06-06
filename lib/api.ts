import type {
  User,
  ThekedaarProfile,
  ServiceCategory,
  City,
  JobPost,
  Quote,
  Booking,
  Review,
  ChatRoom,
  Message,
  Notification,
  PaginatedResponse,
  AdminStats,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Token accessor — works in both client and server contexts
let _clientToken: string | null = null

export function setClientToken(token: string | null) {
  _clientToken = token
}

async function getToken(): Promise<string | null> {
  // Client side: use in-memory token set by store
  if (typeof window !== 'undefined') {
    return _clientToken
  }
  // Server side: try to read from cookies
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    return cookieStore.get('token')?.value ?? null
  } catch {
    return null
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const token = options.token ?? (await getToken())
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

// Auth
export async function requestOtp(phone: string): Promise<void> {
  return fetchApi('/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  })
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<{ accessToken: string; isNewUser: boolean }> {
  return fetchApi('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  })
}

// Users
export async function getMe(token?: string): Promise<User> {
  return fetchApi('/users/me', { token })
}

export async function updateMe(
  data: Partial<Pick<User, 'name' | 'avatarUrl' | 'preferredLang'>>
): Promise<User> {
  return fetchApi('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function completeOnboarding(data: {
  name: string
  role: 'HOMEOWNER' | 'THEKEDAAR'
}): Promise<User> {
  return fetchApi('/users/me/complete-onboarding', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Catalog
export async function getCategories(): Promise<ServiceCategory[]> {
  return fetchApi('/catalog/categories')
}

export async function getCities(): Promise<City[]> {
  return fetchApi('/catalog/cities')
}

// Thekedaars
export async function getThekedaars(params?: {
  category?: string
  city?: string
  page?: number
  limit?: number
}): Promise<PaginatedResponse<User>> {
  const qs = new URLSearchParams()
  if (params?.category) qs.set('category', params.category)
  if (params?.city) qs.set('city', params.city)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  return fetchApi(`/thekedaars?${qs}`)
}

export async function getThekedaar(id: string): Promise<User> {
  return fetchApi(`/thekedaars/${id}`)
}

export async function updateMyThekedaarProfile(
  data: Partial<{
    bio: string
    cnicNumber: string
    serviceCategorySlugs: string[]
    citySlugs: string[]
    pricingRangeMin: number
    pricingRangeMax: number
  }>
): Promise<ThekedaarProfile> {
  return fetchApi('/thekedaars/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// Jobs
export async function createJob(data: {
  title: string
  description: string
  categorySlug: string
  citySlug: string
  area?: string
  photos?: string[]
  budgetMin?: number
  budgetMax?: number
}): Promise<JobPost> {
  return fetchApi('/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getJobs(params?: {
  status?: string
  city?: string
  category?: string
  page?: number
  limit?: number
}): Promise<PaginatedResponse<JobPost>> {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.city) qs.set('city', params.city)
  if (params?.category) qs.set('category', params.category)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  return fetchApi(`/jobs?${qs}`)
}

export async function getJob(id: string): Promise<JobPost> {
  return fetchApi(`/jobs/${id}`)
}

export async function updateJobStatus(
  id: string,
  status: string
): Promise<JobPost> {
  return fetchApi(`/jobs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// Quotes
export async function createQuote(
  jobId: string,
  data: { amount: number; description: string; estimatedDays: number }
): Promise<Quote> {
  return fetchApi(`/jobs/${jobId}/quotes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getJobQuotes(jobId: string): Promise<Quote[]> {
  return fetchApi(`/jobs/${jobId}/quotes`)
}

export async function acceptQuote(quoteId: string): Promise<Quote> {
  return fetchApi(`/quotes/${quoteId}/accept`, {
    method: 'PATCH',
  })
}

// Bookings
export async function getBookings(): Promise<Booking[]> {
  return fetchApi('/bookings')
}

export async function getBooking(id: string): Promise<Booking> {
  return fetchApi(`/bookings/${id}`)
}

export async function completeBooking(id: string): Promise<Booking> {
  return fetchApi(`/bookings/${id}/complete`, {
    method: 'PATCH',
  })
}

// Reviews
export async function createReview(data: {
  bookingId: string
  rating: number
  comment?: string
}): Promise<Review> {
  return fetchApi('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getThekedaarReviews(thekedaarId: string): Promise<Review[]> {
  return fetchApi(`/thekedaars/${thekedaarId}/reviews`)
}

// Chat
export async function getChatRooms(): Promise<ChatRoom[]> {
  return fetchApi('/chat/rooms')
}

export async function getChatMessages(
  roomId: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Message>> {
  const qs = new URLSearchParams()
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  return fetchApi(`/chat/rooms/${roomId}/messages?${qs}`)
}

// Uploads
export async function uploadFile(file: File): Promise<{ url: string }> {
  const token = await getToken()
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE_URL}/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

// Payments
export async function initiatePayment(data: {
  bookingId: string
  method: string
}): Promise<{ paymentUrl?: string; status: string }> {
  return fetchApi('/payments/initiate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Notifications
export async function getNotifications(): Promise<Notification[]> {
  return fetchApi('/notifications')
}

export async function markNotificationRead(id: string): Promise<Notification> {
  return fetchApi(`/notifications/${id}/read`, {
    method: 'PATCH',
  })
}

// Admin
export async function getAdminStats(): Promise<AdminStats> {
  return fetchApi('/admin/stats')
}

export async function getAdminThekedaars(status?: string): Promise<User[]> {
  const qs = status ? `?status=${status}` : ''
  return fetchApi(`/admin/thekedaars${qs}`)
}

export async function verifyThekedaar(
  id: string,
  status: 'APPROVED' | 'REJECTED'
): Promise<ThekedaarProfile> {
  return fetchApi(`/admin/thekedaars/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function getAdminDisputes(): Promise<Booking[]> {
  return fetchApi('/admin/disputes')
}
