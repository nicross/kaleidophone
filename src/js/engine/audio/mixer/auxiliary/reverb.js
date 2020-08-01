'use strict'

engine.audio.mixer.auxiliary.reverb = (() => {
  const context = engine.audio.context(),
    convolver = context.createConvolver(),
    input = context.createGain(),
    output = engine.audio.mixer.createBus(),
    pubsub = engine.utility.pubsub.create()

  let active = engine.const.reverbActive

  if (active) {
    input.connect(convolver)
  }

  convolver.buffer = engine.audio.buffer.impulse[engine.const.reverbImpulse]()
  convolver.connect(output)

  return engine.utility.pubsub.decorate({
    createSend: () => {
      const gain = context.createGain()
      gain.connect(input)
      return gain
    },
    isActive: () => active,
    output: () => output,
    refreshActive: function () {
      if (active == engine.const.reverbActive) {
        return this
      }

      active = engine.const.reverbActive

      if (active) {
        input.connect(convolver)
        pubsub.emit('activate')
      } else {
        input.disconnect(convolver)
        pubsub.emit('deactivate')
      }

      return this
    },
    setGain: function (gain, duration) {
      engine.audio.ramp.linear(output.gain, gain, duration)
      return this
    },
    setImpulse: function (buffer) {
      convolver.buffer = buffer
      return this
    },
  }, pubsub)
})()
