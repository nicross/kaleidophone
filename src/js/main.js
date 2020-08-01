'use strict'

document.addEventListener('DOMContentLoaded', () => {
  app.activate()
  engine.loop.start()

  engine.const.reverbActive = false
  engine.audio.mixer.auxiliary.reverb.refreshActive()
})

// TODO: Call engine.audio.start() on first user gesture
