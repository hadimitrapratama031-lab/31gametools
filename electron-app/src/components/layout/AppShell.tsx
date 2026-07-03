import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Titlebar from './Titlebar'
import Sidebar from './Sidebar'

export default function AppShell() {
  const [search, setSearch] = useState('')

  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">
      <Titlebar
        searchValue={search}
        onSearchChange={setSearch}
        notifCount={3}
        serverOnline={true}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-hidden bg-bg-primary">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
