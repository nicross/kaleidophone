'use strict'

const app = engine.utility.pubsub.decorate({
  activate: function () {
    document.querySelector('.sg-a-app').classList.add('sg-a-app-active')
    this.pubsub.emit('activate')
    return this
  },
  isElectron: () => typeof ElectronApi != 'undefined',
  quit: function () {
    if (this.isElectron()) {
      ElectronApi.quit()
    }

    return this
  },
  utility: {},
})
