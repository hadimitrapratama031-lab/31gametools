import { useState } from 'react'
import { Search, Zap, Star, Filter, ChevronDown, FolderOpen, X, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { Game } from '@/types'

const MOCK_GAMES: Game[] = [
  { id:'1', appId:'1938090', name:'Call of Duty: MW III',  coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/library_600x900.jpg', status:'online', category:'FPS',    minRole:'public',   injectModes:['FPS','Story'],     featured:true },
  { id:'2', appId:'271590',  name:'GTA V',                 coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900.jpg',  status:'online', category:'Action', minRole:'public',   injectModes:['Story','FreeRoam'], featured:true },
  { id:'3', appId:'1817070', name:'Spider-Man 2',          coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_600x900.jpg', status:'online', category:'Action', minRole:'gold',     injectModes:['Story'],           featured:false },
  { id:'4', appId:'1286830', name:'Forza Horizon 5',       coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1286830/library_600x900.jpg', status:'online', category:'Racing', minRole:'public',   injectModes:['Career'],          featured:true },
  { id:'5', appId:'1245620', name:'Elden Ring',            coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg', status:'online', category:'RPG',    minRole:'gold',     injectModes:['Adventure'],       featured:false },
  { id:'6', appId:'1174180', name:'Red Dead Redemption 2', coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg', status:'online', category:'Action', minRole:'public',   injectModes:['Story'],           featured:true },
  { id:'7', appId:'730',     name:'CS2',                   coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/730/library_600x900.jpg',     status:'online', category:'FPS',    minRole:'public',   injectModes:['Competitive'],     featured:false },
  { id:'8', appId:'892970',  name:'Cyberpunk 2077',        coverUrl:'https://cdn.cloudflare.steamstatic.com/steam/apps/892970/library_600x900.jpg',  status:'online', category:'RPG',    minRole:'platinum', injectModes:['Story'],           featured:false },
]

const CATEGORIES = ['Semua', 'FPS', 'Action', 'RPG', 'Racing', 'Sports']

interface InjectModalProps {
  game: Game
  onClose: () => void
  userRole: string
}

function InjectModal({ game, onClose, userRole }: InjectModalProps) {
  const [mode, setMode]         = useState(game.injectModes[0])
  const [folder, setFolder]     = useState('C:\\Program Files (x86)\\Steam\\steamapps\\common')
  const [step, setStep]         = useState<'idle'|'injecting'|'done'|'error'>('idle')
  const [progress, setProgress] = useState(0)

  const canInject = userRole !== 'public' || game.minRole === 'public'

  const handleInject = () => {
    if (!canInject) return
    setStep('injecting')
    setProgress(0)
    let p = 0
    const t = setInterval(() => {
      p += Math.random() * 15
      if (p >= 100) {
        clearInterval(t)
        setProgress(100)
        setStep('done')
      } else {
        setProgress(p)
      }
    }, 200)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary border border-bg-border rounded-2xl w-full max-w-md shadow-card animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-bg-border">
          <img src={game.coverUrl} alt={game.name} className="w-10 h-10 rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/16161f/7c6ef7?text=?' }} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-text-primary truncate">{game.name}</div>
            <div className="text-xs text-text-muted">App ID: {game.appId}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-bg-card border border-bg-border flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
            <X size={13} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {step === 'done' ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mx-auto mb-3">
                <Check size={24} className="text-accent-green" />
              </div>
              <div className="font-bold text-text-primary mb-1">Inject Berhasil!</div>
              <div className="text-xs text-text-muted">{game.name} berhasil diinstall ke folder tujuan</div>
            </div>
          ) : step === 'injecting' ? (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-text-primary">Menginstall {game.name}...</div>
              <div className="h-2 bg-bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-violet rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span>Mode: {mode}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          ) : (
            <>
              {/* Mode select */}
              <div>
                <label className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-2 block">Mode Inject</label>
                <div className="flex gap-2">
                  {game.injectModes.map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                        mode === m
                          ? 'bg-violet/15 border-violet/30 text-violet'
                          : 'bg-bg-card border-bg-border text-text-secondary hover:border-violet/20'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Folder */}
              <div>
                <label className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-2 block">Lokasi Install</label>
                <div className="flex gap-2">
                  <input
                    value={folder}
                    onChange={e => setFolder(e.target.value)}
                    className="input-field flex-1 text-xs"
                    placeholder="C:\Program Files..."
                  />
                  <button className="w-10 h-10 rounded-xl bg-bg-card border border-bg-border flex items-center justify-center text-text-muted hover:text-violet hover:border-violet/40 transition-all">
                    <FolderOpen size={15} />
                  </button>
                </div>
              </div>

              {!canInject && (
                <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-xl px-4 py-3 text-xs text-accent-gold">
                  Game ini membutuhkan akses <strong>{game.minRole.toUpperCase()}</strong>. Upgrade akun kamu untuk mengakses.
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 pb-5 flex gap-3">
          {step === 'done' ? (
            <button onClick={onClose} className="btn-violet w-full text-sm flex items-center justify-center gap-2">
              <Check size={14} /> Selesai
            </button>
          ) : step === 'injecting' ? (
            <div className="w-full py-2.5 rounded-xl bg-bg-card border border-bg-border text-center text-sm text-text-muted">
              Mohon tunggu...
            </div>
          ) : (
            <>
              <button onClick={onClose} className="btn-ghost flex-1 text-sm">Batal</button>
              <button
                onClick={handleInject}
                disabled={!canInject}
                className="btn-violet flex-1 text-sm flex items-center justify-center gap-2"
              >
                <Zap size={14} /> Install Game
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InstallGamePage() {
  const { user } = useAuth()
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('Semua')
  const [selected, setSelected]   = useState<Game | null>(null)

  const filtered = MOCK_GAMES.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = category === 'Semua' || g.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-bg-border flex-shrink-0">
        <h1 className="font-display font-bold text-xl text-text-primary mb-0.5">Install Game</h1>
        <p className="text-sm text-text-muted">Pilih game dan inject langsung ke Steam kamu</p>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 border-b border-bg-border flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari game..."
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                category === cat
                  ? 'bg-violet/15 border-violet/30 text-violet'
                  : 'bg-bg-card border-bg-border text-text-secondary hover:border-violet/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button className="btn-ghost flex items-center gap-2 text-xs ml-auto">
          <Filter size={13} /> Filter <ChevronDown size={12} />
        </button>
      </div>

      {/* Game grid */}
      <div className="flex-1 overflow-y-auto scrollable p-6">
        <div className="grid grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(game => {
            const accessible = user?.role !== 'public' || game.minRole === 'public'
            return (
              <div
                key={game.id}
                onClick={() => setSelected(game)}
                className="group cursor-pointer"
              >
                <div className="relative rounded-xl overflow-hidden border border-bg-border mb-2 aspect-[2/3] bg-bg-card">
                  <img
                    src={game.coverUrl}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x300/16161f/7c6ef7?text=?' }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-gradient-violet rounded-xl p-3 shadow-violet-glow">
                      <Zap size={20} className="text-white" />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-bg-primary/80 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${game.status === 'online' ? 'bg-accent-green' : 'bg-accent-red'}`} />
                    <span className={`text-[9px] font-semibold ${game.status === 'online' ? 'text-accent-green' : 'text-accent-red'}`}>
                      {game.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {game.featured && <Star size={12} className="text-accent-gold fill-accent-gold" />}
                    {game.minRole !== 'public' && (
                      <span className={`text-[8px] font-bold px-1 py-0.5 rounded text-center ${
                        game.minRole === 'gold' ? 'bg-accent-gold text-black' : 'bg-violet text-white'
                      }`}>
                        {game.minRole.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {!accessible && (
                    <div className="absolute inset-0 bg-bg-primary/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-xs text-text-muted">🔒</span>
                    </div>
                  )}
                </div>
                <div className="text-xs font-semibold text-text-primary truncate">{game.name}</div>
                <div className="text-[10px] text-text-muted flex items-center justify-between">
                  <span>{game.category}</span>
                  <span className="text-[9px]">⋮⋮⋮</span>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🎮</div>
            <div className="text-text-secondary font-semibold">Game tidak ditemukan</div>
            <div className="text-text-muted text-sm mt-1">Coba kata kunci lain</div>
          </div>
        )}
      </div>

      {selected && (
        <InjectModal
          game={selected}
          onClose={() => setSelected(null)}
          userRole={user?.role || 'public'}
        />
      )}
    </div>
  )
}
