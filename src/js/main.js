'use strict'

document.addEventListener('DOMContentLoaded', () => {
  app.activate()

  engine.loop.start().pause()

  engine.const.reverbActive = false
  engine.audio.mixer.auxiliary.reverb.refreshActive()

  engine.audio.mixer.master.param.gain.value = engine.const.zeroGain
})
