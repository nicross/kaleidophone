'use strict'

document.addEventListener('DOMContentLoaded', () => {
  app.activate()

  engine.loop.start().pause()

  engine.audio.mixer.auxiliary.reverb.setActive(false)

  engine.audio.mixer.master.param.gain.value = engine.const.zeroGain
})
