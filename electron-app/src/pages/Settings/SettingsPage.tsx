import { useState } from 'react'
import { Settings, Bell, Shield, Info, Monitor } from 'lucide-react'

export default function SettingsPage() {
  const [notifLogin, setNotifLogin]   = useState(true)
  const [notifDl, setNotifDl]         = useState(true)
  const [autoUpdate, setAutoUpdate]   = useState(true)

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-all relative ${value ? 'bg-violet' : 'bg-bg-border'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )

  const SECTIONS = [
    {
      icon: Bell, label: 'Notifikasi',
      items: [
        { label:'Notif saat login', sub:'DM Discord saat login berhasil', value:notifLogin, onChange:setNotifLogin },
        { label:'Notif saat download', sub:'DM Discord saat download game', value:notifDl, onChange:setNotifDl },
      ]
    },
    {
      icon: Monitor, label: 'Aplikasi',
      items: [
        { label:'Auto update', sub:'Update otomatis saat ada versi baru', value:autoUpdate, onChange:setAutoUpdate },
      ]
    },
  ]

  return (
    <div className="h-full overflow-y-auto scrollable p-6">
      <div className="max-w-lg">
        <h1 className="font-display font-bold text-xl text-text-primary mb-0.5">Pengaturan</h1>
        <p className="text-sm text-text-muted mb-6">Konfigurasi aplikasi ThreeOne Store</p>

        <div className="space-y-4">
          {SECTIONS.map(sec => (
            <div key={sec.label} className="glass p-5">
              <div className="flex items-center gap-2 mb-4">
                <sec.icon size={15} className="text-violet" />
                <h2 className="font-semibold text-text-primary text-sm">{sec.label}</h2>
              </div>
              <div className="space-y-4">
                {sec.items.map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-text-primary font-medium">{item.label}</div>
                      <div className="text-xs text-text-muted">{item.sub}</div>
                    </div>
                    <Toggle value={item.value} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* App info */}
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Info size={15} className="text-violet" />
              <h2 className="font-semibold text-text-primary text-sm">Tentang Aplikasi</h2>
            </div>
            <div className="space-y-2 text-xs">
              {[['Versi','2.0.0'],['Platform','Electron + React + TypeScript'],['Build','2024']].map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-text-muted">{k}</span>
                  <span className="text-text-secondary">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
