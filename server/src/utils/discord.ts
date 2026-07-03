import axios from 'axios'

const WEBHOOK_URL    = process.env.DISCORD_WEBHOOK_URL    || ''
const BOT_TOKEN      = process.env.DISCORD_BOT_TOKEN      || ''
const GUILD_ID       = process.env.DISCORD_GUILD_ID       || ''
const REQUIRED_ROLE  = process.env.DISCORD_REQUIRED_ROLE  || ''

// Role ID dari Discord → mapping ke role di app
const ROLE_ADMIN    = process.env.DISCORD_ROLE_ADMIN    || ''
const ROLE_PLATINUM = process.env.DISCORD_ROLE_PLATINUM || ''
const ROLE_GOLD     = process.env.DISCORD_ROLE_GOLD     || ''
const ROLE_PUBLIC   = process.env.DISCORD_ROLE_PUBLIC   || ''

// ── Cek guild membership & ambil role app dari role Discord ──
export async function checkGuildMember(discordId: string): Promise<{
  isMember: boolean
  hasRole:  boolean
  appRole:  'admin' | 'platinum' | 'gold' | 'public'
}> {
  try {
    const res = await axios.get(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`,
      { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
    )
    const discordRoles: string[] = res.data.roles || []

    // Tentukan role app berdasarkan role Discord — prioritas: admin > platinum > gold > public
    let appRole: 'admin' | 'platinum' | 'gold' | 'public' = 'public'
    if (ROLE_ADMIN    && discordRoles.includes(ROLE_ADMIN))    appRole = 'admin'
    else if (ROLE_PLATINUM && discordRoles.includes(ROLE_PLATINUM)) appRole = 'platinum'
    else if (ROLE_GOLD     && discordRoles.includes(ROLE_GOLD))     appRole = 'gold'
    else if (ROLE_PUBLIC   && discordRoles.includes(ROLE_PUBLIC))   appRole = 'public'

    return {
      isMember: true,
      hasRole:  !REQUIRED_ROLE || discordRoles.includes(REQUIRED_ROLE),
      appRole,
    }
  } catch {
    return { isMember: false, hasRole: false, appRole: 'public' }
  }
}

// ── Send DM ke user ───────────────────────────────────────────
export async function sendDM(discordId: string, content: string, embed?: object) {
  if (!BOT_TOKEN) return
  try {
    // Create DM channel
    const ch = await axios.post(
      'https://discord.com/api/v10/users/@me/channels',
      { recipient_id: discordId },
      { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
    )
    const channelId = ch.data.id
    await axios.post(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      { content, ...(embed ? { embeds: [embed] } : {}) },
      { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
    )
  } catch { /* ignore if DM fails */ }
}

// ── Send ke webhook server Discord ───────────────────────────
export async function sendWebhook(title: string, description: string, color = 0x7c6ef7, fields?: object[]) {
  if (!WEBHOOK_URL) return
  try {
    await axios.post(WEBHOOK_URL, {
      embeds: [{
        title,
        description,
        color,
        fields: fields || [],
        timestamp: new Date().toISOString(),
        footer: { text: 'ThreeOne Store' },
      }]
    })
  } catch { /* ignore */ }
}

// ── Preset notifikasi ─────────────────────────────────────────
export const Notify = {
  login: (username: string, discordId: string) => {
    const desc = `**${username}** berhasil login ke ThreeOne Store`
    sendWebhook('🔐 Login', desc, 0x22c55e)
    sendDM(discordId, '', {
      title: '✅ Login Berhasil',
      description: 'Kamu berhasil login ke **ThreeOne Store**.\nJika bukan kamu, segera hubungi admin.',
      color: 0x22c55e,
      timestamp: new Date().toISOString(),
    })
  },
  download: (username: string, discordId: string, gameName: string) => {
    const desc = `**${username}** menginstall **${gameName}**`
    sendWebhook('⬇️ Install Game', desc, 0x7c6ef7)
    sendDM(discordId, '', {
      title: '⬇️ Install Game',
      description: `Kamu berhasil menginstall **${gameName}**.`,
      color: 0x7c6ef7,
      timestamp: new Date().toISOString(),
    })
  },
  bypass: (username: string, discordId: string, bypassName: string) => {
    sendWebhook('🛡️ Bypass', `**${username}** mengaktifkan bypass **${bypassName}**`, 0x3b82f6)
    sendDM(discordId, '', {
      title: '🛡️ Bypass Aktif',
      description: `**${bypassName}** berhasil diaktifkan di akunmu.`,
      color: 0x3b82f6,
      timestamp: new Date().toISOString(),
    })
  },
  voucherRedeem: (username: string, discordId: string, role: string, days: number) => {
    sendWebhook('🎟️ Voucher', `**${username}** mengaktifkan voucher **${role.toUpperCase()}** (${days} hari)`, 0xf59e0b)
    sendDM(discordId, '', {
      title: '🎟️ Voucher Aktif',
      description: `Akun kamu sudah di-upgrade ke **${role.toUpperCase()}** selama **${days} hari**.`,
      color: 0xf59e0b,
      timestamp: new Date().toISOString(),
    })
  },
  ban: (username: string, reason: string) => {
    sendWebhook('🚫 Ban User', `**${username}** dibanned. Alasan: ${reason}`, 0xef4444)
  },
}