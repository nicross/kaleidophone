'use strict'

document.addEventListener('DOMContentLoaded', () => {
  app.activate()

  engine.state.import({
    seed: Math.random(),
  })

  engine.loop.start()

  engine.const.reverbActive = false
  engine.audio.mixer.auxiliary.reverb.refreshActive()
})

// TODO: Call engine.audio.start() on first user gesture
