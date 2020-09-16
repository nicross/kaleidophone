engine.audio.binaural.monaural = {}

engine.audio.binaural.monaural.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.audio.binaural.monaural.prototype = {
  construct: function ({
    pan = 0,
  }) {
    const context = engine.audio.context()

    this.panSign = engine.utility.sign(pan)
    this.angleOffset = -this.panSign * Math.PI / 2

    this.filter = context.createBiquadFilter()
    this.gain = context.createGain()

    this.filter.frequency.value = engine.const.maxFrequency
    this.gain.gain.value = engine.const.zeroGain

    this.delay = context.createDelay()
    this.gain.connect(this.delay)
    this.delay.connect(this.filter)

    return this
  },
  destroy: function () {
    this.filter.disconnect()
    return this
  },
  from: function (input, ...args) {
    input.connect(this.gain, ...args)
    return this
  },
  to: function (output, ...args) {
    this.filter.connect(output, ...args)
    return this
  },
  update: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    // NOTE: Observer is facing 0° at (0, 0)
    const ear = engine.utility.vector3d.create({
      x,
      y: y + (this.panSign * engine.const.binauralHeadWidth / 2),
      z,
    }).rotateEuler({yaw: this.angleOffse})

    const distance = ear.distance(),
      distancePower = engine.utility.distanceToPower(distance)

    const shadow = ear.rotateEuler({
      yaw: this.panSign * engine.const.binauralShadowOffset,
    }).euler()

    // TODO: Simulate shadow as a 3D cone?
    const shadowCos = Math.cos(shadow.yaw)
    const isAhead = shadowCos > 0

    const shadowTarget = isAhead
      ? engine.utility.lerp(0.75, 1, shadowCos)
      : engine.utility.lerp(0, 0.75, 1 + shadowCos)

    const shadowRolloff = engine.utility.clamp(engine.utility.scale(distance, 0, engine.const.binauralShadowRolloff, 0, 1), 0, 1),
      shadowStrength = engine.utility.lerp(1, shadowTarget, shadowRolloff)

    const delayTime = Math.min(1, distance / engine.const.speedOfSound),
      filterFrequency = engine.utility.lerpExp(engine.const.acousticShadowFrequency, engine.const.maxFrequency, shadowStrength),
      inputGain = engine.utility.clamp(distancePower, engine.const.zeroGain, 1)

    engine.audio.ramp.set(this.delay.delayTime, delayTime)
    engine.audio.ramp.set(this.filter.frequency, filterFrequency)
    engine.audio.ramp.set(this.gain.gain, inputGain)

    return this
  },
}
