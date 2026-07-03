import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Download, Shield, History,
  Ticket, Settings, LogOut, Zap, ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/install-game', icon: Download,         label: 'Install Game' },
  { to: '/bypass',       icon: Shield,           label: 'Bypass' },
  { to: '/history',      icon: History,          label: 'Histori' },
  { to: '/voucher',      icon: Ticket,           label: 'Voucher' },
  { to: '/settings',     icon: Settings,         label: 'Pengaturan' },
]

const ROLE_LABEL: Record<string, string> = {
  public:   'Public',
  gold:     'Gold',
  platinum: 'Platinum',
  admin:    'Admin',
}

const QUOTA_LABEL: Record<string, string> = {
  public:   '3x / hari',
  gold:     '3x / hari',
  platinum: 'Unlimited',
  admin:    'Unlimited',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-[220px] flex-shrink-0 bg-bg-secondary border-r border-bg-border flex flex-col">
      {/* Logo */}
      <div className="h-12 flex items-center px-5 border-b border-bg-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-violet flex items-center justify-center shadow-violet-glow">
            <span className="font-display font-black text-white text-sm">31</span>
          </div>
          <div>
            <div className="font-display font-bold text-sm text-text-primary leading-none">THREEONE</div>
            <div className="text-[9px] text-text-muted font-semibold tracking-widest leading-none mt-0.5">STORE</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollable">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info bottom */}
      {user && (
        <div className="px-3 pb-4 border-t border-bg-border pt-3 space-y-2">
          {/* Quota card */}
          <div className="bg-bg-card rounded-xl p-3 border border-bg-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={13} className="text-violet" />
              <span className="text-[11px] text-text-muted font-semibold uppercase tracking-wide">Kuota Harian</span>
            </div>
            <div className="text-sm font-bold text-text-primary">
              {QUOTA_LABEL[user.role] || '3x / hari'}
            </div>
            {user.role !== 'platinum' && user.role !== 'admin' && (
              <div className="mt-2 h-1 bg-bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-violet rounded-full transition-all"
                  style={{ width: `${Math.min(100, (user.downloadCount / user.downloadLimit) * 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* User chip */}
          <button className="w-full flex items-center gap-2.5 hover:bg-bg-hover rounded-xl p-2 transition-all group">
            <img
              src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=64`}
              onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.username}&background=7c6ef7&color=fff` }}
              alt={user.username}
              className="w-8 h-8 rounded-full border border-bg-border"
            />
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-semibold text-text-primary truncate">{user.username}</div>
              <div className="text-[11px] text-violet font-semibold">{ROLE_LABEL[user.role]}</div>
            </div>
            <ChevronDown size={13} className="text-text-muted group-hover:text-text-secondary" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-muted hover:text-accent-red hover:bg-accent-red/5 transition-all"
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      )}
    </aside>
  )
}
