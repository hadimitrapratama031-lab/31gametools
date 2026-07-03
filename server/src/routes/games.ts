// ── games.ts ──────────────────────────────────────────────────
import { Router, Response } from 'express'
import Game from '../models/Game'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { getGameImages } from '../utils/ryuApi'

const gamesRouter = Router()

gamesRouter.get('/', requireAuth, async (_req, res) => {
  const games = await Game.find({ status: { $ne: 'offline' } }).sort({ featured: -1, name: 1 })
  res.json({ success: true, data: games })
})

gamesRouter.get('/:appId/images', requireAuth, async (req, res) => {
  try {
    const images = await getGameImages(req.params.appId)
    res.json({ success: true, data: images })
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch images' })
  }
})

export { gamesRouter as default }

// ── users.ts ──────────────────────────────────────────────────
export const usersRouter = Router()

usersRouter.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: req.user })
})

// ── history.ts ────────────────────────────────────────────────
import { History } from '../models/History'

export const historyRouter = Router()

historyRouter.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { type, page = 1, limit = 20 } = req.query
  const filter: Record<string, unknown> = { userId: req.user!._id }
  if (type && type !== 'all') filter.type = type

  const [items, total] = await Promise.all([
    History.find(filter).sort({ createdAt: -1 }).skip((+page-1)*+limit).limit(+limit),
    History.countDocuments(filter),
  ])
  res.json({ success: true, data: items, total, page: +page })
})

historyRouter.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const item = await History.create({ userId: req.user!._id, ...req.body })
  res.json({ success: true, data: item })
})

// ── vouchers.ts ───────────────────────────────────────────────
import { Voucher } from '../models/History'
import { Notify } from '../utils/discord'

export const vouchersRouter = Router()

vouchersRouter.post('/redeem', requireAuth, async (req: AuthRequest, res: Response) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ success: false, error: 'Kode wajib diisi' })

  const voucher = await Voucher.findOne({ code: code.toUpperCase(), active: true })
  if (!voucher) return res.status(404).json({ success: false, error: 'Kode tidak valid atau sudah tidak aktif' })
  if (voucher.usedCount >= voucher.maxUse) return res.status(400).json({ success: false, error: 'Voucher sudah habis digunakan' })
  if (voucher.expiresAt && voucher.expiresAt < new Date()) return res.status(400).json({ success: false, error: 'Voucher sudah kadaluarsa' })

  const userId = req.user!._id
  if (voucher.usedBy.includes(userId as unknown as never)) return res.status(400).json({ success: false, error: 'Kamu sudah menggunakan voucher ini' })

  // Upgrade user
  const user     = req.user!
  user.role      = voucher.role as 'gold' | 'platinum'
  user.expiresAt = new Date(Date.now() + voucher.days * 86400000)
  if (voucher.role === 'platinum') user.downloadLimit = 99999
  await user.save()

  voucher.usedCount++
  voucher.usedBy.push(userId as unknown as never)
  await voucher.save()

  Notify.voucherRedeem(user.username, user.discordId, voucher.role, voucher.days)

  res.json({ success: true, message: `Berhasil! Akun di-upgrade ke ${voucher.role.toUpperCase()} selama ${voucher.days} hari` })
})
