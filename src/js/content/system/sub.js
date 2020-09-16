content.system.sub = (() => {
  const bus = engine.audio.mixer.createBus(),
    context = engine.audio.context(),
    merger = context.createChannelMerger(2)

  const left = engine.audio.synth.createSimple({
    frequency: 0,
    gain: 0.5,
  }).connect(merger, 0, 0)

  const right = engine.audio.synth.createSimple({
    frequency: 0,
    gain: 0.5,
  }).connect(merger, 0, 1)

  merger.connect(bus)
  bus.gain.value = engine.utility.fromDb(-12)

  return {
    update: function () {
      const delta = engine.loop.delta(),
        z = content.system.z.get(),
        zi = Math.floor(z)

      const ceiling = content.system.frequencies.sub(zi + 1),
        floor = content.system.frequencies.sub(zi),
        mix = z - zi

      const frequency = engine.utility.lerp(floor, ceiling, mix)

      engine.audio.ramp.linear(left.param.frequency, frequency - content.const.subBeat/2, delta)
      engine.audio.ramp.linear(right.param.frequency, frequency + content.const.subBeat/2, delta)

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.system.sub.update()
})
