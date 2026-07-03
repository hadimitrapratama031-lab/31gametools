import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import http from 'http'

// Fix backdrop-filter on Windows
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion')

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 780,
    minWidth: 960,
    minHeight: 640,
    frame: false,
    resizable: true,
    backgroundColor: '#0d0d14',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
  })

  // Dev: load Vite dev server. Prod: load built index.html
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('maximize',   () => mainWindow?.webContents.send('win-state', { maximized: true }))
  mainWindow.on('unmaximize', () => mainWindow?.webContents.send('win-state', { maximized: false }))
}

// ── Discord OAuth local callback server ──
let authServer: http.Server | null = null

function startAuthServer() {
  authServer = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.method === 'GET' && req.url?.startsWith('/auth/callback')) {
      const url  = new URL(req.url, 'http://localhost:9731')
      const token = url.searchParams.get('token')
      const userData = url.searchParams.get('user')

      if (token && userData) {
        mainWindow?.webContents.send('auth-success', {
          token,
          user: JSON.parse(decodeURIComponent(userData)),
        })
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('<html><body><script>window.close()</script><p>Login berhasil! Kembali ke aplikasi.</p></body></html>')
      } else {
        res.writeHead(400)
        res.end('Invalid callback')
      }
    } else {
      res.writeHead(404)
      res.end()
    }
  })
  authServer.listen(9731)
}

// ── IPC handlers ──
ipcMain.handle('win-minimize',  () => mainWindow?.minimize())
ipcMain.handle('win-maximize',  () => mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow?.maximize())
ipcMain.handle('win-close',     () => mainWindow?.close())
ipcMain.handle('open-external', (_, url: string) => shell.openExternal(url))

ipcMain.handle('discord-login', async (_, apiUrl: string) => {
  await shell.openExternal(`${apiUrl}/auth/discord`)
  return { ok: true }
})

app.whenReady().then(() => {
  createWindow()
  startAuthServer()
})

app.on('window-all-closed', () => {
  authServer?.close()
  if (process.platform !== 'darwin') app.quit()
})
