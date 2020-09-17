const app = {
  activate: function () {
    document.querySelector('.a-app').classList.add('a-app-active')
    return this
  },
  isElectron: () => typeof ElectronApi != 'undefined',
  quit: function () {
    if (this.isElectron()) {
      ElectronApi.quit()
    }

    return this
  },
  screen: {},
  state: {},
  utility: {},
}

engine.ready(() => app.activate())
