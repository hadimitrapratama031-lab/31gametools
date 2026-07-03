import { useState } from 'react'
import { Shield, Search, Zap, Check, X, FolderOpen } from 'lucide-react'

const BYPASS_LIST = [
  { id:'1', name:'Easy Anti-Cheat', version:'2.2.10', status:'active',   games:['Fortnite','Rust','Dead by Daylight'], extractPath:'EasyAntiCheat' },
  { id:'2', name:'BattleEye',       version:'1.6.7',  status:'active',   games:['PUBG','DayZ','Arma 3'],               extractPath:'BattlEye'     },
  { id:'3', name:'GameGuard',       version:'3.1.2',  status:'active',   games:['MapleStory','Lost Ark'],              extractPath:'GameGuard'    },
  { id:'4', name:'Vanguard (VAC+)', version:'4.0.1',  status:'inactive', games:['Valorant'],                           extractPath:'Vanguard'     },
  { id:'5', name:'nProtect',        version:'2.0.5',  status:'active',   games:['Lineage 2'],                          extractPath:'nProtect'     },
]

interface BypassItem {
  id: string
  name: string
  version: string
  status: string
  games: string[]
  extractPath: string
}

function BypassModal({ item, onClose }: { item: BypassItem; onClose: () => void }) {
  const [folder, setFolder] = useState(`C:\\Program Files (x86)\\Steam\\steamapps\\common\\${item.extractPath}`)
  const [step, setStep]     = useState<'idle'|'running'|'done'|'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [log, setLog]       = useState<string[]>([])

  const handleBypass = () => {
    setStep('running')
    setProgress(0)
    setLog([])

    const steps = [
      `[INFO] Memulai bypass ${item.name} v${item.version}...`,
      `[INFO] Mendeteksi App ID...`,
      `[INFO] Mengekstrak file bypass ke: ${folder}`,
      `[OK]   File berhasil diekstrak`,
      `[INFO] Menginject DLL ke proses...`,
      `[OK]   Bypass aktif — Status: Bypass Aktif`,
    ]

    let i = 0
    let p = 0
    const t = setInterval(() => {
      if (i < steps.length) {
        setLog(prev => [...prev, steps[i]])
        i++
        p = Math.round((i / steps.length) * 100)
        setProgress(p)
      } else {
        clearInterval(t)
        setStep('done')
      }
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary border border-bg-border rounded-2xl w-full max-w-md shadow-card animate-slide-up">
        <div className="flex items-center gap-3 p-5 border-b border-bg-border">
          <div className="w-10 h-10 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center">
            <Shield size={18} className="text-violet" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-text-primary">{item.name}</div>
            <div className="text-xs text-text-muted">v{item.version}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-bg-card border border-bg-border flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
            <X size={13} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {step !== 'idle' ? (
            <>
              <div className="bg-bg-primary rounded-xl p-3 font-mono text-[10px] space-y-1 max-h-40 overflow-y-auto scrollable border border-bg-border">
                {log.map((l, i) => (
                  <div key={i} className={l.startsWith('[OK]') ? 'text-accent-green' : l.startsWith('[ERR]') ? 'text-accent-red' : 'text-text-muted'}>
                    {l}
                  </div>
                ))}
                {step === 'running' && <div className="text-violet animate-pulse">▋</div>}
              </div>
              <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-violet rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              {step === 'done' && (
                <div className="flex items-center gap-2 text-accent-green text-sm font-semibold">
                  <Check size={16} /> Bypass berhasil diaktifkan
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-2 block">Games yang didukung</label>
                <div className="flex gap-1.5 flex-wrap">
                  {item.games.map(g => (
                    <span key={g} className="badge-violet">{g}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-2 block">Lokasi Ekstrak</label>
                <div className="flex gap-2">
                  <input value={folder} onChange={e => setFolder(e.target.value)} className="input-field flex-1 text-xs" />
                  <button className="w-10 h-10 rounded-xl bg-bg-card border border-bg-border flex items-center justify-center text-text-muted hover:text-violet hover:border-violet/40 transition-all">
                    <FolderOpen size={15} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-5 pb-5 flex gap-3">
          {step === 'done' ? (
            <button onClick={onClose} className="btn-violet w-full flex items-center justify-center gap-2 text-sm">
              <Check size={14} /> Selesai
            </button>
          ) : step === 'running' ? (
            <div className="w-full py-2.5 rounded-xl bg-bg-card border border-bg-border text-center text-sm text-text-muted">
              Memproses...
            </div>
          ) : (
            <>
              <button onClick={onClose} className="btn-ghost flex-1 text-sm">Batal</button>
              <button onClick={handleBypass} className="btn-violet flex-1 flex items-center justify-center gap-2 text-sm">
                <Zap size={14} /> Aktifkan Bypass
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BypassPage() {
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState<typeof BYPASS_LIST[0] | null>(null)

  const filtered = BYPASS_LIST.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-5 border-b border-bg-border flex-shrink-0">
        <h1 className="font-display font-bold text-xl text-text-primary mb-0.5">Bypass</h1>
        <p className="text-sm text-text-muted">Bypass anti-cheat terbaru dengan aman dan stabil</p>
      </div>

      <div className="px-6 py-3 border-b border-bg-border flex-shrink-0">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari anti-cheat..." className="input-field pl-9 text-sm" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollable p-6">
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="glass p-4 flex items-center gap-4 hover:border-violet/30 transition-all cursor-pointer group" onClick={() => setSelected(item)}>
              <div className="w-10 h-10 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-violet" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text-primary text-sm">{item.name}</div>
                <div className="text-xs text-text-muted mt-0.5">v{item.version} · {item.games.slice(0,2).join(', ')}{item.games.length > 2 ? ` +${item.games.length-2}` : ''}</div>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                item.status === 'active'
                  ? 'text-accent-green bg-accent-green/10 border-accent-green/20'
                  : 'text-text-muted bg-bg-card border-bg-border'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-accent-green' : 'bg-text-muted'}`} />
                {item.status === 'active' ? 'Tersedia' : 'Tidak Aktif'}
              </div>
              <button className="btn-violet text-xs px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                <Zap size={12} /> Bypass
              </button>
            </div>
          ))}
        </div>
      </div>

      {selected && <BypassModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
