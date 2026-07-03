# ThreeOne Store — Project Setup Guide

## Struktur Project
```
threeone/
├── electron-app/   ← Aplikasi desktop user (Electron + React + TSX + Tailwind)
├── server/         ← Backend API (Express + MongoDB)
└── admin-web/      ← Admin panel (HTML, buka di browser)
```

---

## 1. Setup Server (Backend)

```bash
cd server
cp .env.example .env
# Edit .env — isi semua credential

npm install
npm run dev       # development
npm run build && npm start  # production
```

**Isi .env yang wajib:**
- `MONGO_URI` — connection string MongoDB Atlas atau lokal
- `JWT_SECRET` — string random panjang (misal generate: `openssl rand -hex 32`)
- `DISCORD_CLIENT_ID` & `DISCORD_CLIENT_SECRET` — dari Discord Developer Portal
- `DISCORD_BOT_TOKEN` — bot token Discord
- `DISCORD_GUILD_ID` — ID server Discord kamu
- `DISCORD_WEBHOOK_URL` — webhook channel notif
- `RYU_KEY_1..5` — API keys Ryu (opsional, fallback ke Steam CDN)
- `STEAMGRIDDB_KEY` — API key SteamGridDB (opsional)

---

## 2. Setup Discord App

1. Buka https://discord.com/developers/applications
2. Buat New Application → beri nama "ThreeOne Store"
3. Tab **OAuth2**:
   - Copy **Client ID** dan **Client Secret** → isi di `.env`
   - Tambah Redirect: `http://localhost:4000/auth/discord/callback`
   - Scopes: `identify`, `email`, `guilds.members.read`
4. Tab **Bot**:
   - Copy **Token** → `DISCORD_BOT_TOKEN` di `.env`
   - Enable: Server Members Intent, Guild Members Intent

---

## 3. Setup Electron App

```bash
cd electron-app

# Copy dan isi .env
cp .env.example .env
# VITE_API_URL=http://localhost:4000
# VITE_RYU_KEY_1=... dst

npm install
npm run electron:dev     # development
npm run electron:build   # build .exe
```

---

## 4. Admin Web Panel

Buka file `admin-web/index.html` langsung di browser.

Untuk production: deploy ke hosting statis (Vercel, Netlify) atau serve dengan nginx.

> **Keamanan**: Jangan share link admin panel ke publik!

---

## Role & Limit

| Role     | Download/hari | Akses Game   | Durasi      |
|----------|--------------|--------------|-------------|
| Public   | 3x           | Game Public  | Selamanya   |
| Gold     | 3x           | Public+Gold  | Sesuai paket|
| Platinum | Unlimited    | Semua game   | 30 hari     |
| Admin    | Unlimited    | Semua        | Selamanya   |

---

## Discord OAuth Flow

```
User klik "Login Discord"
  → Electron buka browser → Discord OAuth
    → User izinkan akses
      → Discord redirect ke server: /auth/discord/callback
        → Server cek guild membership
          → Jika bukan member → tampilkan pesan error
          → Jika member → buat/update user di DB
            → Kirim notif DM + webhook
              → Redirect ke localhost:9731/auth/callback
                → Electron local server tangkap token
                  → Login berhasil, masuk dashboard
```

---

## Webhook Notifications

Semua webhook menggunakan format embed Discord.
Tinggal paste URL webhook di Settings admin panel.

Events yang dikirim:
- 🔐 Login user
- ⬇️ Download/install game  
- 🛡️ Bypass diaktifkan
- 🎟️ Voucher diredeem
- 🚫 User dibanned
