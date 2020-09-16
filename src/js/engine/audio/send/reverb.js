engine.audio.send.reverb = {}

engine.audio.send.reverb.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.audio.send.reverb.prototype = {
  construct: function () {
    const context = engine.audio.context()

    this.input = context.createGain()
    this.delay = context.createDelay()
    this.send = engine.audio.mixer.auxiliary.reverb.createSend()

    this.relative = engine.utility.vector3d.create()

    this.onSendActivate = this.onSendActivate.bind(this)
    engine.audio.mixer.auxiliary.reverb.on('activate', this.onSendActivate)

    this.onSendDeactivate = this.onSendDeactivate.bind(this)
    engine.audio.mixer.auxiliary.reverb.on('deactivate', this.onSendDeactivate)

    if (engine.audio.mixer.auxiliary.reverb.isActive()) {
      this.onSendActivate()
    } else {
      this.onSendDeactivate()
    }

    return this
  },
  destroy: function () {
    engine.audio.mixer.auxiliary.reverb.off('activate', this.onSendActivate)
    engine.audio.mixer.auxiliary.reverb.off('deactivate', this.onSendDeactivate)
    this.send.disconnect()
    return this
  },
  from: function (input) {
    input.connect(this.input)
    return this
  },
  onSendActivate: function () {
    this.update(this.relative)
    this.input.connect(this.delay)
    this.delay.connect(this.send)
    return this
  },
  onSendDeactivate: function () {
    this.input.disconnect()
    this.delay.disconnect()
    return this
  },
  update: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    this.relative.set({
      x,
      y,
      z,
    })

    if (!engine.audio.mixer.auxiliary.reverb.isActive()) {
      return this
    }

    // TODO: Consider a distance model that doesn't rely on engine.streamer.getRadius()
    // e.g. a constant ratio that forces users to turn reverb send way down
    // BUT what's nice about this solution is close sounds are present and further are roomy

    const distance = this.relative.distance(),
      distancePower = engine.utility.distanceToPower(distance),
      distanceRatio = 0.5 + (engine.utility.clamp(distance / engine.streamer.getRadius(), 0, 1) * 0.5)

    const delayTime = engine.utility.clamp(distance / engine.const.speedOfSound, engine.const.zeroTime, 1),
      inputGain = engine.utility.clamp(distancePower * distanceRatio, engine.const.zeroGain, 1)

    engine.audio.ramp.set(this.delay.delayTime, delayTime)
    engine.audio.ramp.set(this.input.gain, inputGain)

    return this
  },
}
