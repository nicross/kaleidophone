'use strict'

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
    this.x = 0
    this.y = 0

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
    this.update()
    this.input.connect(this.delay)
    this.delay.connect(this.send)
    return this
  },
  onSendDeactivate: function () {
    this.input.disconnect()
    this.delay.disconnect()
    return this
  },
  update: function ({x = this.x, y = this.y} = {}) {
    this.x = x
    this.y = y

    if (!engine.audio.mixer.auxiliary.reverb.isActive()) {
      return this
    }

    const distance = engine.utility.distanceOrigin(this.x, this.y),
      distancePower = engine.utility.distanceToPower(distance),
      distanceRatio = 0.5 + (engine.utility.clamp(distance / engine.const.streamerRadius, 0, 1) * 0.5)

    const delayTime = engine.utility.clamp(distance / engine.const.speedOfSound, engine.const.zeroTime, 1),
      inputGain = engine.utility.clamp(distancePower * distanceRatio, engine.const.zeroGain, 1)

    this.delay.delayTime.value = delayTime
    this.input.gain.value = inputGain

    return this
  },
}
