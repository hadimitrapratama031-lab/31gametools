import { Router, Response } from 'express'
import User from '../models/User'
import Game from '../models/Game'
import { History, Voucher } from '../models/History'
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth'
import { Notify } from '../utils/discord'
import crypto from 'crypto'

const router = Router()

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin)

// ── Dashboard stats ────────────────────────────────────────────
router.get('/stats', async (_req, res: Response) => {
  const [totalUsers, totalGames, totalHistory, totalVouchers] = await Promise.all([
    User.countDocuments(),
    Game.countDocuments(),
    History.countDocuments(),
    Voucher.countDocuments(),
  ])
  const roleCounts = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ])
  res.json({ success: true, data: { totalUsers, totalGames, totalHistory, totalVouchers, roleCounts } })
})

// ── Users CRUD ─────────────────────────────────────────────────
router.get('/users', async (req, res: Response) => {
  const { page = 1, limit = 20, role, search } = req.query
  const filter: Record<string, unknown> = {}
  if (role) filter.role = role
  if (search) filter.username = { $regex: search, $options: 'i' }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((+page-1)*+limit).limit(+limit),
    User.countDocuments(filter),
  ])
  res.json({ success: true, data: users, total })
})

router.patch('/users/:id/role', async (req, res: Response) => {
  const { role, days } = req.body
  const user = await User.findByIdAndUpdate(req.params.id, {
    role,
    ...(days ? { expiresAt: new Date(Date.now() + days * 86400000) } : {}),
  }, { new: true })
  if (!user) return res.status(404).json({ success: false, error: 'User not found' })
  res.json({ success: true, data: user })
})

router.patch('/users/:id/ban', async (req, res: Response) => {
  const { banned, reason } = req.body
  const user = await User.findByIdAndUpdate(req.params.id, { banned }, { new: true })
  if (!user) return res.status(404).json({ success: false, error: 'User not found' })
  if (banned) Notify.ban(user.username, reason || 'Tidak ada alasan')
  res.json({ success: true, data: user })
})

router.delete('/users/:id', async (req, res: Response) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

// ── Games CRUD ─────────────────────────────────────────────────
router.get('/games', async (_req, res: Response) => {
  const games = await Game.find().sort({ createdAt: -1 })
  res.json({ success: true, data: games })
})

router.post('/games', async (req, res: Response) => {
  try {
    const game = await Game.create(req.body)
    res.json({ success: true, data: game })
  } catch (err: unknown) {
    res.status(400).json({ success: false, error: (err as Error).message })
  }
})

router.patch('/games/:id', async (req, res: Response) => {
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!game) return res.status(404).json({ success: false, error: 'Game not found' })
  res.json({ success: true, data: game })
})

router.delete('/games/:id', async (req, res: Response) => {
  await Game.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

// ── Vouchers CRUD ──────────────────────────────────────────────
router.get('/vouchers', async (_req, res: Response) => {
  const vouchers = await Voucher.find().sort({ createdAt: -1 })
  res.json({ success: true, data: vouchers })
})

router.post('/vouchers', async (req, res: Response) => {
  const { role, days, maxUse = 1, expiresAt, count = 1 } = req.body
  const created = []
  for (let i = 0; i < Math.min(count, 50); i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    const v = await Voucher.create({ code, role, days, maxUse, expiresAt: expiresAt || undefined })
    created.push(v)
  }
  res.json({ success: true, data: created })
})

router.delete('/vouchers/:id', async (req, res: Response) => {
  await Voucher.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

// ── History (all users) ────────────────────────────────────────
router.get('/history', async (req, res: Response) => {
  const { page = 1, limit = 50, type } = req.query
  const filter: Record<string, unknown> = {}
  if (type && type !== 'all') filter.type = type

  const [items, total] = await Promise.all([
    History.find(filter).populate('userId', 'username discordId role').sort({ createdAt: -1 }).skip((+page-1)*+limit).limit(+limit),
    History.countDocuments(filter),
  ])
  res.json({ success: true, data: items, total })
})

// ── Bypass entries (using Game model with bypass files) ────────
router.get('/bypasses', async (_req, res: Response) => {
  const games = await Game.find({ bypassFile: { $exists: true, $ne: '' } })
  res.json({ success: true, data: games })
})

router.patch('/games/:id/bypass', async (req, res: Response) => {
  const { bypassFile } = req.body
  const game = await Game.findByIdAndUpdate(req.params.id, { bypassFile }, { new: true })
  res.json({ success: true, data: game })
})

export default router
