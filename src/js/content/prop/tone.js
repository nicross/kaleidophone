'use strict'

content.prop.tone = engine.prop.base.invent({
  name: 'tone',
  onConstruct: function ({
    detune = 0,
    frequency = 440,
    gain = engine.utility.fromDb(-6),
  } = {}) {
    this.synth = engine.audio.synth.createSimple({
      detune,
      frequency,
      gain,
    }).connect(this.output.input)
  },
  onDestroy: function () {
    this.synth.stop()
  },
})
