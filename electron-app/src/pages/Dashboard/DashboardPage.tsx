import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Shield, RefreshCw, ArrowRight, ChevronRight, Crown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/utils/api'
import type { Game, ServerStatus } from '@/types'

const MOCK_STATUS: ServerStatus = {
  online: true, ping: 18,
  activeUsers: 128, totalGames: 256,
  version: '2.1.0', dailyQuota: 'Unlimited',
}

const MOCK_TOP_USERS = [
  { rank: 1, name: 'brooke.31',          points: 103, avatar: '' },
  { rank: 2, name: 'whitesvarogutek8904', points: 32,  avatar: '' },
  { rank: 3, name: 'juliants23_',        points: 28,  avatar: '' },
  { rank: 4, name: 'derdon0403',         points: 27,  avatar: '' },
  { rank: 5, name: '31.shop',            points: 22,  avatar: '' },
]

const MOCK_GAMES: Game[] = [
  { id:'1', appId:'1938090', name:'Call of Duty: MW III',   coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/library_600x900.jpg', status:'online', category:'FPS',      minRole:'public', injectModes:['FPS','Story'], featured:true },
  { id:'2', appId:'271590',  name:'GTA V',                  coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900.jpg',  status:'online', category:'Action',   minRole:'public', injectModes:['Story'],       featured:true },
  { id:'3', appId:'1817070', name:'Spider-Man 2',           coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_600x900.jpg', status:'online', category:'Action',   minRole:'gold',   injectModes:['Story'],       featured:true },
  { id:'4', appId:'1286830', name:'Forza Horizon 5',        coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1286830/library_600x900.jpg', status:'online', category:'Racing',   minRole:'public', injectModes:['Career'],      featured:true },
  { id:'5', appId:'1245620', name:'Elden Ring',             coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg', status:'online', category:'RPG',      minRole:'gold',   injectModes:['Adventure'],   featured:true },
  { id:'6', appId:'1174180', name:'Red Dead Redemption 2',  coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg', status:'online', category:'Action',   minRole:'public', injectModes:['Story'],       featured:true },
]

const HERO_SLIDES = [
  { title: 'INJECT &',    titleAccent: 'DOMINATE',   desc: 'Inject game favoritmu ke Steam\ndengan aman, cepat, dan stabil.', action: '/install-game' },
  { title: 'BYPASS &',    titleAccent: 'PLAY SAFE',  desc: 'Bypass anti-cheat terbaru\ndengan teknologi terkini.',           action: '/bypass' },
  { title: 'PREMIUM &',   titleAccent: 'UNLIMITED',  desc: 'Upgrade ke Platinum untuk akses\ntanpa batas setiap hari.',      action: '/voucher' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [slide, setSlide]         = useState(0)
  const [status]                  = useState<ServerStatus>(MOCK_STATUS)
  const [games]                   = useState<Game[]>(MOCK_GAMES)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const QUICK_ACTIONS = [
    { label: 'Install Game', icon: Zap,       to: '/install-game', primary: true },
    { label: 'Fix ST Patch', icon: Shield,    to: '/bypass',       primary: false },
    { label: 'Restart Steam',icon: RefreshCw, to: null,            primary: false },
  ]

  const STATUS_CARDS = [
    { icon: '🎮', label: 'STATUS STEAM',   value: 'Online',          sub: 'Steam berjalan normal',     ok: true  },
    { icon: '⚡', label: 'KUOTA HARIAN',   value: user?.role === 'platinum' || user?.role === 'admin' ? 'Unlimited' : `${user?.downloadLimit ?? 3 - (user?.downloadCount ?? 0)} tersisa`, sub: 'Sisa kuota hari ini', ok: true },
    { icon: '🛡️', label: 'ACTIVE TOOLS',   value: 'Semua Sistem Optimal', sub: 'Siap digunakan',       ok: true  },
  ]

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto scrollable p-5 space-y-5">

        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden bg-bg-secondary border border-bg-border" style={{ height: 220 }}>
          {/* Purple gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-violet/20 to-transparent z-[5]" />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8">
            <h1 className="font-display font-black text-4xl text-text-primary leading-tight">
              {HERO_SLIDES[slide].title}
            </h1>
            <h1 className="font-display font-black text-4xl text-gradient-violet leading-tight mb-3">
              {HERO_SLIDES[slide].titleAccent}
            </h1>
            <p className="text-text-secondary text-sm whitespace-pre-line mb-5 max-w-xs">
              {HERO_SLIDES[slide].desc}
            </p>
            <button
              onClick={() => navigate(HERO_SLIDES[slide].action)}
              className="btn-violet w-fit flex items-center gap-2 text-sm"
            >
              <Zap size={14} /> Mulai Inject
            </button>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-4 left-8 z-20 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1 rounded-full transition-all ${i === slide ? 'w-6 bg-violet' : 'w-2 bg-text-muted/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-3 gap-3">
          {STATUS_CARDS.map(({ icon, label, value, sub, ok }) => (
            <div key={label} className="glass p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bg-hover flex items-center justify-center text-lg flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-text-muted font-semibold uppercase tracking-wide mb-0.5">{label}</div>
                <div className={`text-sm font-bold truncate ${ok ? 'text-accent-green' : 'text-accent-red'}`}>{value}</div>
                <div className="text-[11px] text-text-muted truncate">{sub}</div>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-accent-green/20' : 'bg-accent-red/20'}`}>
                <div className={`w-2 h-2 rounded-full ${ok ? 'bg-accent-green' : 'bg-accent-red'}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-[11px] text-text-muted font-semibold uppercase tracking-widest mb-3">Quick Action</h3>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(({ label, icon: Icon, to, primary }) => (
              <button
                key={label}
                onClick={() => to && navigate(to)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  primary
                    ? 'bg-gradient-violet text-white border-transparent shadow-violet-glow'
                    : 'bg-bg-card border-bg-border text-text-primary hover:border-violet/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  {label}
                </div>
                <ChevronRight size={14} className="opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Game list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] text-text-muted font-semibold uppercase tracking-widest">Game Tersedia</h3>
            <button onClick={() => navigate('/install-game')} className="text-xs text-violet hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={11} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollable">
            {games.map(game => (
              <div
                key={game.id}
                onClick={() => navigate('/install-game')}
                className="flex-shrink-0 w-32 cursor-pointer group"
              >
                <div className="relative rounded-xl overflow-hidden border border-bg-border mb-2 aspect-[2/3]">
                  <img
                    src={game.coverUrl}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x300/16161f/7c6ef7?text=?' }}
                  />
                  {/* Status dot */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-bg-primary/80 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                    <span className="text-[9px] text-accent-green font-semibold">Online</span>
                  </div>
                  {/* Role badge */}
                  {game.minRole !== 'public' && (
                    <div className="absolute top-2 right-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${game.minRole === 'gold' ? 'bg-accent-gold text-black' : 'bg-violet text-white'}`}>
                        {game.minRole.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-xs font-semibold text-text-primary truncate">{game.name}</div>
                <div className="text-[10px] text-text-muted">{game.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[260px] flex-shrink-0 border-l border-bg-border bg-bg-secondary overflow-y-auto scrollable p-4 space-y-4">

        {/* Top users */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] text-text-muted font-semibold uppercase tracking-widest">Top User Aktif</h3>
            <button className="text-xs text-violet hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-2">
            {MOCK_TOP_USERS.map(u => (
              <div key={u.rank} className="flex items-center gap-2.5 py-1.5">
                <span className={`text-xs font-black w-4 text-center ${u.rank === 1 ? 'text-accent-gold' : u.rank <= 3 ? 'text-violet' : 'text-text-muted'}`}>
                  {u.rank}
                </span>
                <div className="w-7 h-7 rounded-full bg-bg-card border border-bg-border flex items-center justify-center text-xs font-bold text-violet flex-shrink-0">
                  {u.name[0].toUpperCase()}
                </div>
                <span className="text-xs text-text-primary flex-1 truncate">{u.name}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-violet">
                  <span className="text-violet">♦</span> {u.points}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Server status */}
        <div className="glass p-3 space-y-2">
          <h3 className="text-[11px] text-text-muted font-semibold uppercase tracking-widest mb-2">Server Status</h3>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow" />
              <span className="text-accent-green font-semibold">Online</span>
            </div>
            <span className="text-text-muted">Ping {status.ping}ms</span>
          </div>
        </div>

        {/* Server info */}
        <div className="glass p-3">
          <h3 className="text-[11px] text-text-muted font-semibold uppercase tracking-widest mb-3">Info Server</h3>
          <div className="space-y-2">
            {[
              { label: 'Kuota Harian',  value: status.dailyQuota },
              { label: 'Active Users',  value: status.activeUsers },
              { label: 'Total Game',    value: status.totalGames },
              { label: 'Version',       value: status.version },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-text-muted">{label}</span>
                <span className="text-text-primary font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium upgrade card */}
        {user?.role === 'public' && (
          <div className="glass p-3 border-violet/20 bg-violet/5 relative overflow-hidden">
            <div className="absolute right-2 top-2 text-4xl opacity-10">👑</div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={14} className="text-accent-gold" />
              <span className="text-xs font-bold text-accent-gold uppercase tracking-wide">Premium User</span>
            </div>
            <p className="text-xs text-text-secondary mb-3">Nikmati fitur premium tanpa batas & lebih stabil.</p>
            <button
              onClick={() => navigate('/voucher')}
              className="w-full btn-violet text-xs py-2 flex items-center justify-center gap-1.5"
            >
              Upgrade Sekarang <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
