const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('ElectronApi', {
  quit: () => ipcRenderer.send('quit')
})
