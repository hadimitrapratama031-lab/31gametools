import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoginPage from '@/pages/Login/LoginPage'
import AppShell from '@/components/layout/AppShell'
import DashboardPage from '@/pages/Dashboard/DashboardPage'
import InstallGamePage from '@/pages/InstallGame/InstallGamePage'
import BypassPage from '@/pages/Bypass/BypassPage'
import HistoryPage from '@/pages/History/HistoryPage'
import VoucherPage from '@/pages/Voucher/VoucherPage'
import SettingsPage from '@/pages/Settings/SettingsPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <SplashLoader />
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function SplashLoader() {
  return (
    <div className="fixed inset-0 bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-violet flex items-center justify-center shadow-violet-glow">
          <span className="font-display font-black text-white text-xl">31</span>
        </div>
        <div className="w-32 h-0.5 bg-bg-border rounded-full overflow-hidden">
          <div className="h-full bg-gradient-violet rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <PrivateRoute>
          <AppShell />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"    element={<DashboardPage />} />
        <Route path="install-game" element={<InstallGamePage />} />
        <Route path="bypass"       element={<BypassPage />} />
        <Route path="history"      element={<HistoryPage />} />
        <Route path="voucher"      element={<VoucherPage />} />
        <Route path="settings"     element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
