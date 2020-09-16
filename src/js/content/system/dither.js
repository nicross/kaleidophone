content.system.dither = (() => {
  const bus = engine.audio.mixer.createBus()

  engine.audio.synth.createBuffer({
    buffer: engine.audio.buffer.noise.white(),
    gain: 1,
  }).connect(bus)

  bus.gain.value = engine.utility.fromDb(-36)

  return {}
})()
