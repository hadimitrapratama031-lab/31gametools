import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { Voucher } from '../models/History'
import User from '../models/User'
import { Notify } from '../utils/discord'
import { Response } from 'express'

const router = Router()

router.post('/redeem', requireAuth, async (req: AuthRequest, res: Response) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ success: false, error: 'Kode wajib diisi' })

  const voucher = await Voucher.findOne({ code: code.toUpperCase(), active: true })
  if (!voucher) return res.status(404).json({ success: false, error: 'Kode tidak valid atau sudah tidak aktif' })
  if (voucher.usedCount >= voucher.maxUse) return res.status(400).json({ success: false, error: 'Voucher sudah habis' })
  if (voucher.expiresAt && voucher.expiresAt < new Date()) return res.status(400).json({ success: false, error: 'Voucher kadaluarsa' })

  const user = await User.findById(req.user!._id)
  if (!user) return res.status(404).json({ success: false, error: 'User not found' })

  user.role      = voucher.role as 'gold' | 'platinum'
  user.expiresAt = new Date(Date.now() + voucher.days * 86400000)
  if (voucher.role === 'platinum') user.downloadLimit = 99999
  await user.save()

  voucher.usedCount++
  voucher.usedBy.push(user._id as unknown as never)
  await voucher.save()

  Notify.voucherRedeem(user.username, user.discordId, voucher.role, voucher.days)

  res.json({ success: true, message: `Upgrade ke ${voucher.role.toUpperCase()} berhasil! Berlaku ${voucher.days} hari.` })
})

export default router
