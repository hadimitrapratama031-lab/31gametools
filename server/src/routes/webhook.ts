import { Router, Request, Response } from 'express'
import { sendWebhook } from '../utils/discord'

const router = Router()

// Test webhook
router.post('/test', async (req: Request, res: Response) => {
  const { url, title, description } = req.body
  if (!url) return res.status(400).json({ success: false, error: 'URL wajib diisi' })
  try {
    await sendWebhook(title || 'Test', description || 'Webhook test dari ThreeOne Store')
    res.json({ success: true, message: 'Webhook terkirim' })
  } catch {
    res.status(500).json({ success: false, error: 'Gagal mengirim webhook' })
  }
})

export default router
