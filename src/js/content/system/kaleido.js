content.system.kaleido = (() => {
  const bus = engine.audio.mixer.createBus(),
    context = engine.audio.context(),
    input = context.createGain()

  for (let i = 0; i < content.const.kaleidoMirrors; i += 1) {
    createMirror(i / content.const.kaleidoMirrors * Math.PI)
  }

  function createMirror(angle = 0) {
    const delay = context.createDelay(),
      left0 = context.createGain(),
      left1 = context.createGain(),
      merger = context.createChannelMerger(2),
      right0 = context.createGain(),
      right1 = context.createGain(),
      splitter = context.createChannelSplitter(2)

    delay.delayTime.value = angle / Math.PI * content.const.kaleidoDelay
    left0.gain.value = Math.sin(angle) / content.const.kaleidoMirrors
    left1.gain.value = Math.cos(angle) / content.const.kaleidoMirrors
    right0.gain.value = Math.cos(angle) / content.const.kaleidoMirrors
    right1.gain.value = Math.sin(angle) / content.const.kaleidoMirrors

    input.connect(delay)
    delay.connect(splitter)
    splitter.connect(left0, 0, 0)
    splitter.connect(right0, 0, 0)
    splitter.connect(left1, 1, 0)
    splitter.connect(right1, 1, 0)
    left0.connect(merger, 0, 0)
    left1.connect(merger, 0, 0)
    right0.connect(merger, 0, 1)
    right1.connect(merger, 0, 1)
    merger.connect(bus)
  }

  return {
    createSend: function () {
      const send = context.createGain()
      send.connect(input)
      return send
    },
  }
})()
