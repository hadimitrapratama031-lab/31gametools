import axios from 'axios'

// Ganti dengan URL server kamu saat production
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

// Auto-attach token
api.interceptors.request.use((config) => {
  const saved = localStorage.getItem('threeone_auth')
  if (saved) {
    const { token } = JSON.parse(saved)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── RYU API (5 keys rotasi) ──
const RYU_KEYS: string[] = [
  import.meta.env.VITE_RYU_KEY_1 || '',
  import.meta.env.VITE_RYU_KEY_2 || '',
  import.meta.env.VITE_RYU_KEY_3 || '',
  import.meta.env.VITE_RYU_KEY_4 || '',
  import.meta.env.VITE_RYU_KEY_5 || '',
].filter(Boolean)

let ryuKeyIndex = 0

export async function getGameImages(appId: string) {
  // Try Ryu API first (rotasi 5 key)
  for (let attempt = 0; attempt < RYU_KEYS.length; attempt++) {
    const key = RYU_KEYS[ryuKeyIndex % RYU_KEYS.length]
    ryuKeyIndex++
    try {
      const res = await axios.get(
        `https://api.ryu.games/v1/app/${appId}/images`,
        { headers: { Authorization: `Bearer ${key}` }, timeout: 8000 }
      )
      if (res.data?.cover) return res.data
    } catch { /* try next key */ }
  }

  // Fallback: SteamGridDB
  try {
    const sgdbKey = import.meta.env.VITE_STEAMGRIDDB_KEY || ''
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/grids/steam/${appId}`,
      { headers: { Authorization: `Bearer ${sgdbKey}` }, timeout: 8000 }
    )
    const grid = res.data?.data?.[0]
    if (grid) return { cover: grid.url, grid: grid.url }
  } catch { /* ignore */ }

  // Last resort: Steam CDN
  return {
    cover: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`,
    grid:  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`,
    hero:  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`,
    logo:  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/logo.png`,
  }
}
