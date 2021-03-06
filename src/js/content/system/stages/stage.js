content.system.stages.stage = {}

content.system.stages.stage.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.system.stages.stage.prototype = {
  construct: function (t) {
    this.t = t

    this.bus = content.system.kaleido.createSend()
    this.bus.gain.value = engine.const.zeroGain
    this.gain = engine.const.zeroGain

    this.generate()

    return this
  },
  destroy: function () {
    engine.props.destroy(...this.props)
    this.props = []

    setTimeout(() => {
      this.bus.disconnect()
    }, content.prop.tone.fadeOutDuration * 1000)

    return this
  },
  generate: function () {
    if (this.props) {
      return this
    }

    const frequencies = content.system.frequencies.get(this.t)

    this.props = []

    for (let i = 0; i < content.const.stagePropCount; i += 1) {
      this.props.push(
        this.generateProp(i, frequencies)
      )
    }

    return this
  },
  generateProp: function (index, frequencies) {
    const srand = engine.utility.srand('stage', this.t, 'prop', index)

    const angle = srand(0, Math.PI * 2),
      distance = srand(content.const.stageMinRadius, content.const.stageMaxRadius)

    return engine.props.create(content.prop.tone, {
      destination: this.bus,
      detune: srand(0),
      frequency: engine.utility.choose(frequencies, srand()),
      modFrequency: srand(),
      radius: 0,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    })
  },
  setMix: function (gain) {
    this.gain = gain
    engine.audio.ramp.linear(this.bus.gain, gain, engine.loop.delta())
    return this
  },
}
