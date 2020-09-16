engine.audio.mixer.auxiliary.reverb = (() => {
  const context = engine.audio.context(),
    input = context.createGain(),
    output = engine.audio.mixer.createBus(),
    pubsub = engine.utility.pubsub.create()

  let active = true,
    convolver = context.createConvolver()

  if (active) {
    input.connect(convolver)
  }

  convolver.buffer = engine.audio.buffer.impulse.large()
  convolver.connect(output)

  return engine.utility.pubsub.decorate({
    createSend: () => {
      const gain = context.createGain()
      gain.connect(input)
      return gain
    },
    isActive: () => active,
    output: () => output,
    setActive: function (state) {
      if (active == state) {
        return this
      }

      active = Boolean(state)

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
      input.disconnect()

      convolver = context.createConvolver()
      convolver.buffer = buffer
      convolver.connect(output)

      if (active) {
        input.connect(convolver)
      }

      return this
    },
  }, pubsub)
})()
