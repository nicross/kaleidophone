'use strict'

content.system.sub = (() => {
  const bus = engine.audio.mixer.createBus()

  const simple = engine.audio.synth.createSimple({
    gain: 1,
  }).connect(bus)

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
      engine.audio.ramp.linear(simple.param.frequency, frequency, delta)

      return this
    },
  }
})()

engine.loop.on('frame', () => content.system.sub.update())
