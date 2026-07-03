import { useState } from 'react'
import { History, Trash2, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'
import type { HistoryItem } from '@/types'

const MOCK_HISTORY: HistoryItem[] = [
  { id:'1', userId:'u1', type:'inject',   gameName:'Call of Duty: MW III',  gameIcon:'https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/header.jpg', detail:'Mode: FPS · File: mw3_injector.exe',            status:'success', createdAt:'2024-05-17T14:32:00Z' },
  { id:'2', userId:'u1', type:'bypass',   gameName:'Easy Anti-Cheat',       gameIcon:'', detail:'Versi: 2.2.10 · Status: Bypass Aktif',             status:'success', createdAt:'2024-05-17T13:48:00Z' },
  { id:'3', userId:'u1', type:'patch',    gameName:'Fix ST Patch',           gameIcon:'', detail:'Perbaikan file sistem · Jumlah file: 12',           status:'success', createdAt:'2024-05-17T12:05:00Z' },
  { id:'4', userId:'u1', type:'inject',   gameName:'GTA V',                  gameIcon:'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',  detail:'Mode: Story · File: gta5_injector.exe',          status:'success', createdAt:'2024-05-16T21:17:00Z' },
  { id:'5', userId:'u1', type:'bypass',   gameName:'BattleEye',              gameIcon:'', detail:'Versi: 1.6.7 · Status: Bypass Aktif',              status:'success', createdAt:'2024-05-16T20:33:00Z' },
  { id:'6', userId:'u1', type:'system',   gameName:'Restart Steam',          gameIcon:'', detail:'Restart service Steam · Status: Berhasil',         status:'success', createdAt:'2024-05-16T19:02:00Z' },
  { id:'7', userId:'u1', type:'inject',   gameName:'Red Dead Redemption 2',  gameIcon:'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg', detail:'Mode: Story · File: rdr2_injector.exe',          status:'failed',  errorMsg:'File tidak ditemukan', createdAt:'2024-05-15T18:41:00Z' },
  { id:'8', userId:'u1', type:'bypass',   gameName:'GameGuard',              gameIcon:'', detail:'Versi: 3.1.2 · Status: Bypass Aktif',              status:'success', createdAt:'2024-05-15T17:10:00Z' },
]

const INSTALLED_GAMES = [
  { name:'Call of Duty: MW III',    size:'85.4 GB',  appId:'1938090' },
  { name:'GTA V',                   size:'112.5 GB', appId:'271590'  },
  { name:'Forza Horizon 5',         size:'103.2 GB', appId:'1286830' },
  { name:'Red Dead Redemption 2',   size:'119.5 GB', appId:'1174180' },
  { name:'Elden Ring',              size:'80.3 GB',  appId:'1245620' },
]

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  inject:    { label: 'Inject Game', color: 'text-violet',        bg: 'bg-violet/10 border-violet/20' },
  bypass:    { label: 'Bypass',      color: 'text-accent-blue',   bg: 'bg-accent-blue/10 border-accent-blue/20' },
  patch:     { label: 'Patch',       color: 'text-accent-gold',   bg: 'bg-accent-gold/10 border-accent-gold/20' },
  system:    { label: 'Sistem',      color: 'text-text-secondary',bg: 'bg-bg-card border-bg-border' },
  uninstall: { label: 'Uninstall',   color: 'text-accent-red',    bg: 'bg-accent-red/10 border-accent-red/20' },
}

const FILTER_TABS = ['Semua', 'Inject', 'Bypass', 'Patch', 'Sistem']

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' }),
    time: d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }),
  }
}

export default function HistoryPage() {
  const [filter, setFilter]     = useState('Semua')
  const [page, setPage]         = useState(1)
  const [uninstalling, setUninstalling] = useState<string | null>(null)
  const PER_PAGE = 8

  const filtered = MOCK_HISTORY.filter(h =>
    filter === 'Semua' || h.type === filter.toLowerCase()
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged      = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  // Summary counts
  const summary = {
    inject:  MOCK_HISTORY.filter(h => h.type === 'inject').length,
    bypass:  MOCK_HISTORY.filter(h => h.type === 'bypass').length,
    patch:   MOCK_HISTORY.filter(h => h.type === 'patch').length,
    system:  MOCK_HISTORY.filter(h => h.type === 'system').length,
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-bg-border flex-shrink-0">
          <h1 className="font-display font-bold text-xl text-text-primary mb-0.5">Histori Aktivitas</h1>
          <p className="text-sm text-text-muted">Riwayat semua aktivitas inject, bypass, patch, dan sistem.</p>
        </div>

        {/* Filter + date */}
        <div className="px-6 py-3 border-b border-bg-border flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-1">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setFilter(tab); setPage(1) }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filter === tab
                    ? 'bg-violet text-white border-transparent'
                    : 'bg-bg-card border-bg-border text-text-secondary hover:border-violet/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="ml-auto flex items-center gap-2 bg-bg-card border border-bg-border rounded-lg px-3 py-1.5 text-xs text-text-secondary hover:border-violet/30 transition-all">
            <History size={12} />
            10 Mei 2024 - 17 Mei 2024
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto scrollable">
          <table className="w-full">
            <thead className="sticky top-0 bg-bg-secondary border-b border-bg-border">
              <tr>
                {['WAKTU','AKTIVITAS','GAME / TOOLS','DETAIL','STATUS',''].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] text-text-muted font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(item => {
                const { date, time } = formatDate(item.createdAt)
                const tc = TYPE_CONFIG[item.type] || TYPE_CONFIG.system
                return (
                  <tr key={item.id} className="border-b border-bg-border hover:bg-bg-hover/50 transition-colors">
                    <td className="px-6 py-4 text-xs text-text-muted whitespace-nowrap">
                      <div className="text-text-secondary font-medium">{date}</div>
                      <div>{time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${tc.bg} ${tc.color}`}>
                        {tc.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        {item.gameIcon ? (
                          <img src={item.gameIcon} alt={item.gameName} className="w-8 h-8 rounded-lg object-cover border border-bg-border" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-bg-card border border-bg-border flex items-center justify-center text-text-muted">
                            <History size={12} />
                          </div>
                        )}
                        <span className="text-sm font-semibold text-text-primary">{item.gameName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted max-w-[200px]">
                      <div>{item.detail}</div>
                      {item.errorMsg && <div className="text-accent-red mt-0.5">{item.errorMsg}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={item.status === 'success' ? 'badge-success' : 'badge-error'}>
                        {item.status === 'success' ? 'Sukses' : 'Gagal'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="w-7 h-7 rounded-lg bg-bg-card border border-bg-border flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
                        <MoreVertical size={13} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-bg-border flex items-center justify-center gap-1 flex-shrink-0">
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="w-8 h-8 rounded-lg bg-bg-card border border-bg-border flex items-center justify-center text-text-muted hover:text-text-primary disabled:opacity-40 transition-all">
            <ChevronLeft size={14} />
          </button>
          {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${p===page ? 'bg-violet text-white border-transparent' : 'bg-bg-card border-bg-border text-text-muted hover:text-text-primary'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-8 h-8 rounded-lg bg-bg-card border border-bg-border flex items-center justify-center text-text-muted hover:text-text-primary disabled:opacity-40 transition-all">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[260px] flex-shrink-0 border-l border-bg-border bg-bg-secondary overflow-y-auto scrollable p-4 space-y-4">

        {/* Summary */}
        <div>
          <h3 className="text-[11px] text-text-muted font-semibold uppercase tracking-widest mb-3">Ringkasan Aktivitas</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label:'Inject', count:summary.inject, ok:summary.inject, color:'text-violet',      icon:'⚡' },
              { label:'Bypass', count:summary.bypass, ok:summary.bypass, color:'text-accent-blue', icon:'🛡️' },
              { label:'Patch',  count:summary.patch,  ok:summary.patch,  color:'text-accent-gold', icon:'📦' },
              { label:'Sistem', count:summary.system, ok:summary.system, color:'text-text-secondary',icon:'⚙️'},
            ].map(s => (
              <div key={s.label} className="glass p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span>{s.icon}</span>
                  <span className={`text-lg font-black ${s.color}`}>{s.count}</span>
                </div>
                <div className="text-xs text-text-primary font-semibold">{s.label}</div>
                <div className="text-[10px] text-text-muted">Sukses: {s.ok}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Uninstall game */}
        <div>
          <h3 className="text-[11px] text-text-muted font-semibold uppercase tracking-widest mb-1">Uninstall Game</h3>
          <p className="text-[10px] text-text-muted mb-3">Kelola game yang terinstall di sistem.</p>
          <div className="space-y-2">
            {INSTALLED_GAMES.map(g => (
              <div key={g.appId} className="glass p-3 flex items-center gap-2.5">
                <img
                  src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appId}/header.jpg`}
                  alt={g.name}
                  className="w-10 h-7 rounded-lg object-cover border border-bg-border flex-shrink-0"
                  onError={e => { (e.target as HTMLImageElement).style.display='none' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-text-primary truncate">{g.name}</div>
                  <div className="text-[10px] text-text-muted">{g.size}</div>
                </div>
                <button
                  onClick={() => setUninstalling(g.appId)}
                  className="text-[10px] font-semibold text-text-muted hover:text-accent-red border border-bg-border hover:border-accent-red/30 rounded-lg px-2 py-1 transition-all flex-shrink-0"
                >
                  Hapus
                </button>
                <button className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-accent-red transition-all flex-shrink-0">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 flex items-center justify-center gap-2 btn-ghost text-xs py-2">
            <Trash2 size={12} /> Uninstall Banyak Game
          </button>
        </div>
      </div>

      {/* Uninstall confirm modal */}
      {uninstalling && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary border border-bg-border rounded-2xl p-6 w-80 animate-slide-up">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={20} className="text-accent-red" />
              </div>
              <div className="font-bold text-text-primary mb-1">Uninstall Game?</div>
              <div className="text-xs text-text-muted mb-5">Game akan dihapus dari sistem. Tindakan ini tidak bisa dibatalkan.</div>
              <div className="flex gap-3">
                <button onClick={() => setUninstalling(null)} className="btn-ghost flex-1 text-sm">Batal</button>
                <button onClick={() => setUninstalling(null)} className="flex-1 bg-accent-red text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-600 transition-all">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
