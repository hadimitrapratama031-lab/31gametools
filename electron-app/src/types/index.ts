export type UserRole = 'public' | 'gold' | 'platinum' | 'admin'

export interface User {
  id: string
  discordId: string
  username: string
  avatar: string
  role: UserRole
  downloadCount: number
  downloadLimit: number
  expiresAt?: string
  joinedAt: string
}

export interface Game {
  id: string
  appId: string
  name: string
  coverUrl: string
  gridUrl?: string
  logoUrl?: string
  heroUrl?: string
  status: 'online' | 'offline' | 'maintenance'
  category: string
  minRole: UserRole
  bypassFile?: string
  injectorFile?: string
  injectModes: string[]
  featured?: boolean
}

export interface HistoryItem {
  id: string
  userId: string
  type: 'inject' | 'bypass' | 'patch' | 'system' | 'uninstall'
  gameName: string
  gameIcon?: string
  detail: string
  status: 'success' | 'failed' | 'pending'
  errorMsg?: string
  createdAt: string
}

export interface ServerStatus {
  online: boolean
  ping: number
  activeUsers: number
  totalGames: number
  version: string
  dailyQuota: string
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface Voucher {
  code: string
  role: UserRole
  days: number
  used: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
