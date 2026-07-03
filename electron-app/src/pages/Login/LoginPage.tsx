import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Zap, Gamepad2, Globe, Sun, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { BASE_URL } from '@/utils/api'
import type { User } from '@/types'

declare global {
  interface Window {
    electron?: { invoke: (ch: string, ...a: unknown[]) => Promise<unknown> }
  }
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  // Listen for auth callback from Electron IPC
  useEffect(() => {
    const handler = (_: unknown, data: { token: string; user: User }) => {
      login(data.token, data.user)
      navigate('/dashboard', { replace: true })
    }
    // @ts-expect-error electron ipc
    window.electron?.on?.('auth-success', handler)
    return () => { /* @ts-expect-error electron ipc */ window.electron?.off?.('auth-success', handler) }
  }, [login, navigate])

  const handleDiscordLogin = async () => {
    setIsLoggingIn(true)
    setError('')
    try {
      await window.electron?.invoke('discord-login', BASE_URL)
    } catch {
      setError('Gagal membuka browser. Coba lagi.')
      setIsLoggingIn(false)
    }
  }

  const FEATURES = [
    { icon: Shield,   label: 'Aman',   desc: 'Sistem anti-ban terbaru & aman' },
    { icon: Zap,      label: 'Cepat',  desc: 'Inject instan tanpa menunggu' },
    { icon: Gamepad2, label: 'Stabil', desc: 'Update rutin setiap hari' },
  ]

  return (
    <div className="h-screen w-full bg-bg-primary flex overflow-hidden select-none">

      {/* Left panel — hero */}
      <div className="flex-1 relative flex flex-col justify-between p-10 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet/8 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-violet flex items-center justify-center shadow-violet-glow">
            <span className="font-display font-black text-white text-lg">31</span>
          </div>
          <div>
            <div className="font-display font-bold text-base text-text-primary leading-none">THREEONE</div>
            <div className="text-[9px] text-text-muted font-semibold tracking-widest">STORE</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          {/* Big "31" watermark */}
          <div className="absolute -top-20 -left-4 font-display font-black text-[180px] leading-none text-white/3 select-none pointer-events-none">
            31
          </div>

          <div className="relative">
            <p className="text-text-muted text-sm font-semibold uppercase tracking-widest mb-4">
              Threeone Store
            </p>
            <h1 className="font-display font-black text-5xl leading-tight text-text-primary mb-1">
              INJECT. PLAY.
            </h1>
            <h1 className="font-display font-black text-5xl leading-tight text-gradient-violet mb-6">
              DOMINATE.
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Platform inject game favoritmu ke Steam dengan aman, cepat, dan stabil.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex gap-4 mt-8">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center">
                  <Icon size={18} className="text-violet" />
                </div>
                <div className="text-sm font-bold text-text-primary">{label}</div>
                <div className="text-xs text-text-muted leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-text-muted">
          © 2024 Threeone Store. All rights reserved.
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-[420px] flex-shrink-0 bg-bg-secondary border-l border-bg-border flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-b border-bg-border">
          <button className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary border border-bg-border rounded-lg px-3 py-1.5 transition-all hover:border-violet/40">
            <Globe size={12} />
            Indonesian
          </button>
          <button className="w-8 h-8 rounded-lg border border-bg-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-violet/40 transition-all">
            <Sun size={14} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 py-6">
          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl text-text-primary mb-1">
              Welcome <span className="text-gradient-violet">Back!</span>
            </h2>
            <p className="text-text-secondary text-sm">Login untuk melanjutkan ke Threeone Store</p>
          </div>

          {/* Discord login — primary */}
          <button
            onClick={handleDiscordLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-[#5865f2] hover:bg-[#4752c4]
                       text-white font-bold rounded-xl py-3.5 text-sm transition-all duration-200
                       hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed mb-6"
          >
            {isLoggingIn ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.02.014.04.028.05a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
            )}
            {isLoggingIn ? 'Membuka Discord...' : 'Login dengan Discord'}
            {!isLoggingIn && <ArrowRight size={16} />}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-bg-border" />
            <span className="text-xs text-text-muted">atau lanjutkan dengan</span>
            <div className="flex-1 h-px bg-bg-border" />
          </div>

          {/* Email/password — disabled (placeholder only) */}
          <div className="space-y-3 opacity-50 pointer-events-none mb-4">
            <div className="relative">
              <input
                disabled
                placeholder="Username atau Email"
                className="input-field pl-10 cursor-not-allowed"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
            </div>
            <div className="relative">
              <input
                disabled
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                className="input-field pl-10 pr-10 cursor-not-allowed"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-auto">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-text-muted cursor-not-allowed">
                <input type="checkbox" disabled className="rounded" />
                Ingat Saya
              </label>
              <button className="text-violet pointer-events-none">Lupa Password?</button>
            </div>
            <button disabled className="btn-violet w-full flex items-center justify-center gap-2">
              Login <ArrowRight size={14} />
            </button>
          </div>

          {/* Other login options */}
          <div className="flex gap-3 justify-center mb-6">
            {[
              { label: 'Steam',   icon: '🎮', disabled: true },
              { label: 'Google',  icon: '🔵', disabled: true },
            ].map(({ label, icon, disabled }) => (
              <button
                key={label}
                disabled={disabled}
                className="flex-1 flex items-center justify-center gap-2 bg-bg-card border border-bg-border rounded-xl py-2.5 text-sm text-text-secondary hover:border-violet/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-accent-red/10 border border-accent-red/20 rounded-xl px-4 py-3 text-sm text-accent-red mb-4">
              {error}
            </div>
          )}

          <p className="text-center text-xs text-text-muted">
            Belum punya akun?{' '}
            <a
              href="#"
              className="text-violet font-semibold hover:underline"
              onClick={e => { e.preventDefault(); window.electron?.invoke('open-external', 'https://discord.gg/threeone') }}
            >
              Join Discord Kami
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
