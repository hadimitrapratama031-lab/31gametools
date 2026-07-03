import axios from 'axios'

// 5 Ryu API keys - rotasi otomatis
const RYU_KEYS = [
  process.env.RYU_KEY_1 || '',
  process.env.RYU_KEY_2 || '',
  process.env.RYU_KEY_3 || '',
  process.env.RYU_KEY_4 || '',
  process.env.RYU_KEY_5 || '',
].filter(Boolean)

let currentKeyIndex = 0

async function ryuRequest(endpoint: string) {
  for (let attempt = 0; attempt < RYU_KEYS.length; attempt++) {
    const key = RYU_KEYS[currentKeyIndex % RYU_KEYS.length]
    currentKeyIndex++
    try {
      const res = await axios.get(`https://api.ryu.games/v1${endpoint}`, {
        headers: { Authorization: `Bearer ${key}` },
        timeout: 8000,
      })
      return res.data
    } catch {
      // Try next key
    }
  }
  return null
}

async function steamGridDBFallback(appId: string) {
  const key = process.env.STEAMGRIDDB_KEY || ''
  if (!key) return null
  try {
    const [grids, heroes, logos] = await Promise.allSettled([
      axios.get(`https://www.steamgriddb.com/api/v2/grids/steam/${appId}`, { headers: { Authorization: `Bearer ${key}` }, timeout: 8000 }),
      axios.get(`https://www.steamgriddb.com/api/v2/heroes/steam/${appId}`, { headers: { Authorization: `Bearer ${key}` }, timeout: 8000 }),
      axios.get(`https://www.steamgriddb.com/api/v2/logos/steam/${appId}`, { headers: { Authorization: `Bearer ${key}` }, timeout: 8000 }),
    ])
    return {
      cover: grids.status  === 'fulfilled' ? grids.value.data.data?.[0]?.url  : null,
      hero:  heroes.status === 'fulfilled' ? heroes.value.data.data?.[0]?.url : null,
      logo:  logos.status  === 'fulfilled' ? logos.value.data.data?.[0]?.url  : null,
    }
  } catch {
    return null
  }
}

export async function getGameImages(appId: string) {
  // 1. Try Ryu
  const ryu = await ryuRequest(`/app/${appId}/images`)
  if (ryu?.cover) return ryu

  // 2. Fallback SteamGridDB
  const sgdb = await steamGridDBFallback(appId)
  if (sgdb?.cover) return sgdb

  // 3. Last resort Steam CDN
  return {
    cover: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`,
    grid:  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`,
    hero:  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`,
    logo:  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/logo.png`,
  }
}
