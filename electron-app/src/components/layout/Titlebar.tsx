import { Minus, Square, X, Bell, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

declare global {
  interface Window {
    electron?: {
      invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
    }
  }
}

const ipc = (channel: string, ...args: unknown[]) =>
  window.electron?.invoke(channel, ...args)

interface TitlebarProps {
  searchValue: string
  onSearchChange: (v: string) => void
  notifCount?: number
  onNotifClick?: () => void
  serverOnline?: boolean
}

export default function Titlebar({
  searchValue, onSearchChange, notifCount = 0,
  onNotifClick, serverOnline = true,
}: TitlebarProps) {
  const { user } = useAuth()

  const roleColors: Record<string, string> = {
    platinum: 'text-violet bg-violet/10 border-violet/30',
    gold:     'text-accent-gold bg-accent-gold/10 border-accent-gold/30',
    public:   'text-accent-green bg-accent-green/10 border-accent-green/30',
    admin:    'text-accent-red bg-accent-red/10 border-accent-red/30',
  }

  return (
    <header className="drag-region h-12 bg-bg-secondary/90 border-b border-bg-border flex items-center px-4 gap-3 flex-shrink-0 z-50">
      {/* Search */}
      <div className="no-drag flex-1 max-w-md">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Cari game, patch, atau aktivitas..."
            className="w-full bg-bg-primary border border-bg-border rounded-lg pl-9 pr-4 py-2 text-sm
                       text-text-primary placeholder-text-muted outline-none
                       focus:border-violet/50 transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="no-drag ml-auto flex items-center gap-3">
        {/* Server status */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-accent-green' : 'bg-accent-red'} animate-pulse-slow`} />
          {serverOnline ? 'Online' : 'Offline'}
        </div>

        {/* Notifications */}
        <button onClick={onNotifClick} className="no-drag relative w-8 h-8 rounded-lg bg-bg-card border border-bg-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-violet/40 transition-all">
          <Bell size={15} />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>

        {/* User chip */}
        {user && (
          <div className="flex items-center gap-2 bg-bg-card border border-bg-border rounded-xl px-3 py-1.5">
            <img
              src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=32`}
              onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.username}&background=7c6ef7&color=fff` }}
              alt={user.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-semibold text-text-primary">{user.username}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${roleColors[user.role] || roleColors.public}`}>
              {user.role}
            </span>
          </div>
        )}

        {/* Window controls */}
        <div className="flex items-center gap-1">
          <button onClick={() => ipc('win-minimize')} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-hover hover:text-text-primary transition-all">
            <Minus size={12} />
          </button>
          <button onClick={() => ipc('win-maximize')} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-hover hover:text-text-primary transition-all">
            <Square size={11} />
          </button>
          <button onClick={() => ipc('win-close')} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:bg-accent-red hover:text-white transition-all">
            <X size={13} />
          </button>
        </div>
      </div>
    </header>
  )
}
