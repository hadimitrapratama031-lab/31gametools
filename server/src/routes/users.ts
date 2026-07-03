// users.ts
import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { Response } from 'express'

const router = Router()
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  const u = req.user!
  res.json({ success: true, data: {
    id: String(u._id), discordId: u.discordId, username: u.username,
    avatar: u.avatar, role: u.role, downloadCount: u.downloadCount,
    downloadLimit: u.downloadLimit, expiresAt: u.expiresAt, joinedAt: u.createdAt,
  }})
})
export default router
