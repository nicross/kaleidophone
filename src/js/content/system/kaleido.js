'use strict'

content.system.kaleido = (() => {
  const bus = engine.audio.mixer.createBus(),
    context = engine.audio.context(),
    input = context.createGain()

  // TODO: Processing
  input.connect(bus)

  return {
    createSend: function () {
      const send = context.createGain()
      send.connect(input)
      return send
    },
  }
})()
