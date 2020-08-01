const {remote} = require('electron')

process.once('loaded', () => {
  global.ElectronApi = {
    quit: () => remote.app.quit(),
  }
})
