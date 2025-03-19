const {app, BrowserWindow, ipcMain} = require('electron')

const os = require('os'),
  package = require('../package.json'),
  path = require('path')

let mainWindow

// Improve support for WebGL and Steam overlays
if (os.platform() == 'win32') {
  app.commandLine.appendSwitch('disable-direct-composition')
  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('disable-software-rasterizer')
  app.commandLine.appendSwitch('in-process-gpu')
} else {
  app.commandLine.appendSwitch('ignore-gpu-blacklist')
  app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder')
}

// Application lifecycle
app.on('ready', () => {
  app.accessibilitySupportEnabled = true
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (!mainWindow) {
    createWindow()
  }
})

ipcMain.on('quit', () => app.quit())

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    fullscreen: true,
    icon: path.join(__dirname, '../public/favicon.png'),
    title: package.name,
    height: 256,
    width: 256,
    webPreferences: {
      contextIsolation: true,
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  // Automatically handle permissions requests like MIDI and pointer locks
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    switch (permission) {
      case 'midi':
      case 'pointerLock':
        return callback(true)
    }

    callback(false)
  })

  // Dereference the main window when closed
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // Force aspect ratio
  mainWindow.setAspectRatio(1)

  // Uncomment to open developer tools
  //mainWindow.webContents.openDevTools()

  // Load the index file
  mainWindow.loadFile('public/index.html')
}
