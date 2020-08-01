const {app, BrowserWindow} = require('electron')

const os = require('os'),
  package = require('../package.json'),
  path = require('path')

let mainWindow

// XXX: Crashes on Ubuntu
if (os.platform() == 'win32') {
  // XXX: Steam Overlay support
  app.commandLine.appendSwitch('disable-direct-composition')
  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('disable-software-rasterizer')
  app.commandLine.appendSwitch('in-process-gpu')
}

function createWindow() {
  mainWindow = new BrowserWindow({
    frame: false,
    fullscreen: true,
    icon: path.join(__dirname, '../public/favicon.png'),
    title: package.name,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    switch (permission) {
      case 'midi':
      case 'pointerLock':
        return callback(true)
    }

    callback(false)
  })

  mainWindow.loadFile('public/index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', () => {
  app.accessibilitySupportEnabled = true
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    createWindow()
  }
})
