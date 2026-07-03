import { useState } from 'react'
import { Ticket, Check, X, Crown, Zap } from 'lucide-react'

const PLANS = [
  { role:'gold',     label:'Gold',     days:8,  price:15000,  features:['3x download/hari','Akses game Gold','Support prioritas'],              color:'text-accent-gold',  bg:'bg-accent-gold/10 border-accent-gold/30' },
  { role:'platinum', label:'Platinum', days:30, price:35000,  features:['Unlimited download','Akses semua game','Support 24/7','Early access'], color:'text-violet',        bg:'bg-violet/10 border-violet/30', popular: true },
]

export default function VoucherPage() {
  const [code, setCode]     = useState('')
  const [msg, setMsg]       = useState<{type:'success'|'error'; text:string} | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRedeem = async () => {
    if (!code.trim()) return
    setLoading(true)
    setMsg(null)
    await new Promise(r => setTimeout(r, 1200))
    if (code.toUpperCase() === 'DEMO2024') {
      setMsg({ type:'success', text:'Voucher berhasil diaktifkan! Akun kamu sudah di-upgrade.' })
    } else {
      setMsg({ type:'error', text:'Kode voucher tidak valid atau sudah digunakan.' })
    }
    setLoading(false)
  }

  return (
    <div className="h-full overflow-y-auto scrollable p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-xl text-text-primary mb-0.5">Voucher</h1>
        <p className="text-sm text-text-muted mb-6">Aktifkan kode voucher atau pilih paket premium</p>

        {/* Voucher input */}
        <div className="glass p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Ticket size={16} className="text-violet" />
            <h2 className="font-semibold text-text-primary text-sm">Kode Voucher</h2>
          </div>
          <div className="flex gap-3">
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: GOLD7DAY"
              maxLength={20}
              className="input-field flex-1 font-mono"
              onKeyDown={e => e.key === 'Enter' && handleRedeem()}
            />
            <button
              onClick={handleRedeem}
              disabled={loading || !code.trim()}
              className="btn-violet px-6 flex items-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
              Gunakan
            </button>
          </div>
          {msg && (
            <div className={`mt-3 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border ${
              msg.type === 'success'
                ? 'bg-accent-green/10 border-accent-green/20 text-accent-green'
                : 'bg-accent-red/10 border-accent-red/20 text-accent-red'
            }`}>
              {msg.type === 'success' ? <Check size={14} /> : <X size={14} />}
              {msg.text}
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-2 gap-4">
          {PLANS.map(plan => (
            <div
              key={plan.role}
              className={`glass p-5 relative ${plan.popular ? 'border-violet/40' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-violet text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-violet-glow">
                    POPULER
                  </span>
                </div>
              )}
              <div className={`inline-flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-full border mb-4 ${plan.bg} ${plan.color}`}>
                <Crown size={11} />
                {plan.label.toUpperCase()}
              </div>
              <div className="mb-1">
                <span className="font-display font-black text-3xl text-text-primary">
                  {new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 }).format(plan.price)}
                </span>
              </div>
              <div className="text-xs text-text-muted mb-4">/ {plan.days} hari</div>
              <ul className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-text-secondary">
                    <Zap size={11} className={plan.color} />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                plan.popular
                  ? 'btn-violet'
                  : 'border border-bg-border text-text-primary hover:border-violet/40 hover:bg-bg-hover'
              }`}>
                Pilih {plan.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
