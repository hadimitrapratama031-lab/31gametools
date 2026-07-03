// history.ts
import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { History } from '../models/History'
import { Response } from 'express'

const router = Router()
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { type, page = 1, limit = 20 } = req.query
  const filter: Record<string, unknown> = { userId: req.user!._id }
  if (type && type !== 'all') filter.type = type
  const [items, total] = await Promise.all([
    History.find(filter).sort({ createdAt: -1 }).skip((+page-1)*+limit).limit(+limit),
    History.countDocuments(filter),
  ])
  res.json({ success: true, data: items, total })
})
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const item = await History.create({ userId: req.user!._id, ...req.body })
  res.json({ success: true, data: item })
})
export default router
