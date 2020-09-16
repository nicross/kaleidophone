content.prop.tone = engine.prop.base.invent({
  name: 'tone',
  onConstruct: function ({
    detune = 0,
    frequency = 440,
    modFrequency = 0,
  } = {}) {
    this.synth = engine.audio.synth.createAm({
      carrierDetune: engine.utility.lerp(-12.5, 12.5, detune),
      carrierFrequency: frequency,
      carrierGain: 3/4,
      carrierType: 'triangle',
      gain: engine.utility.fromDb(-1.5),
      modDepth: 1/4,
      modFrequency: engine.utility.lerp(1/16, 1/4, modFrequency),
    }).filtered({
      frequency: frequency * 4,
    }).connect(this.output)
  },
  onDestroy: function () {
    this.synth.stop()
  },
})
