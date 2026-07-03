import { Router, Request, Response } from 'express'
import axios from 'axios'
import User from '../models/User'
import { signToken, requireAuth, AuthRequest } from '../middleware/auth'
import { checkGuildMember, Notify } from '../utils/discord'

const router = Router()

const DISCORD_CLIENT_ID     = process.env.DISCORD_CLIENT_ID     || ''
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || ''
const DISCORD_REDIRECT_URI  = process.env.DISCORD_REDIRECT_URI  || 'http://localhost:4000/auth/discord/callback'

// Step 1: Redirect ke Discord OAuth
router.get('/discord', (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id:     DISCORD_CLIENT_ID,
    redirect_uri:  DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope:         'identify email guilds.members.read',
  })
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`)
})

// Step 2: Discord callback
router.get('/discord/callback', async (req: Request, res: Response) => {
  const { code } = req.query
  if (!code) return res.redirect('threeone://auth-error?msg=no_code')

  try {
    // Exchange code for token
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id:     DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type:    'authorization_code',
        code:          code as string,
        redirect_uri:  DISCORD_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    const accessToken: string = tokenRes.data.access_token

    // Get Discord user info
    const userRes = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    const discordUser = userRes.data

    // Cek guild membership & ambil role dari Discord
    const { isMember, appRole } = await checkGuildMember(discordUser.id)
    if (!isMember) {
      return res.send(`
        <html><body>
          <h2>❌ Kamu belum join Discord kami!</h2>
          <p>Join dulu di <a href="https://discord.gg/threeone">discord.gg/threeone</a> lalu login lagi.</p>
          <script>setTimeout(() => window.close(), 5000)</script>
        </body></html>
      `)
    }

    // Download limit berdasarkan role
    const downloadLimitMap: Record<string, number> = {
      public:   3,
      gold:     3,
      platinum: 999999,
      admin:    999999,
    }

    // Upsert user di DB — role selalu sync dari Discord setiap login
    let user = await User.findOne({ discordId: discordUser.id })
    if (!user) {
      user = await User.create({
        discordId:     discordUser.id,
        username:      discordUser.username,
        avatar:        discordUser.avatar || '',
        email:         discordUser.email,
        role:          appRole,
        downloadCount: 0,
        downloadLimit: downloadLimitMap[appRole] ?? 3,
        guildMember:   true,
      })
    } else {
      user.username      = discordUser.username
      user.avatar        = discordUser.avatar || ''
      user.guildMember   = true
      user.role          = appRole   // sync role dari Discord setiap login
      user.downloadLimit = downloadLimitMap[appRole] ?? 3
      await user.save()
    }

    if (user.banned) {
      return res.send('<html><body><h2>🚫 Akun kamu dibanned.</h2><script>setTimeout(window.close,3000)</script></body></html>')
    }

    // Sign JWT
    const token = signToken(String(user._id))

    // Kirim notif login
    Notify.login(user.username, user.discordId)

    // Redirect ke Electron local server (port 9731)
    const userData = encodeURIComponent(JSON.stringify({
      id:            String(user._id),
      discordId:     user.discordId,
      username:      user.username,
      avatar:        user.avatar,
      role:          user.role,
      downloadCount: user.downloadCount,
      downloadLimit: user.downloadLimit,
      joinedAt:      user.createdAt,
    }))
    res.redirect(`http://localhost:9731/auth/callback?token=${token}&user=${userData}`)

  } catch (err) {
    console.error(err)
    res.status(500).send('<html><body><h2>Server error. Coba lagi.</h2></body></html>')
  }
})

// Get current user
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  const u = req.user!
  res.json({ success: true, data: {
    id:            String(u._id),
    discordId:     u.discordId,
    username:      u.username,
    avatar:        u.avatar,
    role:          u.role,
    downloadCount: u.downloadCount,
    downloadLimit: u.downloadLimit,
    expiresAt:     u.expiresAt,
    joinedAt:      u.createdAt,
  }})
})

export default router