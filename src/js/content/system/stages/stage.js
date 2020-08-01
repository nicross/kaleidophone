'use strict'

content.system.stages.stage = {}

content.system.stages.stage.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.system.stages.stage.prototype = {
  construct: function (z) {
    this.z = z

    this.bus = engine.audio.mixer.createBus()
    this.bus.gain.value = engine.const.zeroGain

    this.generate()

    return this
  },
  destroy: function () {
    engine.props.destroy(...this.props)
    this.props = []

    setTimeout(() => {
      this.bus.disconnect()
    }, engine.const.propFadeDuration * 1000)

    return this
  },
  generate: function () {
    if (this.props) {
      return this
    }

    this.props = []

    for (let i = 0; i < content.const.stagePropCount; i += 1) {
      this.props.push(
        this.generateProp(i)
      )
    }

    return this
  },
  generateProp: function (index) {
    const srand = engine.utility.srand('stage', this.z, 'prop', index)

    const angle = srand(0, Math.PI * 2),
      distance = srand(0, 1) * content.const.stageRadius

    return engine.props.create(content.prop.tone, {
      detune: srand(-25, 25),
      frequency: srand(110, 440), // TODO: Select from scale or chord
      output: this.bus,
      radius: 0,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    })
  },
  setMix: function (gain) {
    engine.audio.ramp.linear(this.bus.gain, gain, engine.loop.delta())
    return this
  },
}
