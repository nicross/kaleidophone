engine.audio.ramp = {}

engine.audio.ramp.createMachine = function (audioParam, rampFn) {
  let timeout,
    state = false

  const container = (value, duration) => {
    rampFn(audioParam, value, duration)

    state = true
    timeout = engine.utility.timing.cancelablePromise(duration * 1000)

    timeout.then(() => {
      state = false
      timeout = null
    }, () => engine.audio.ramp.hold(audioParam))

    return timeout
  }

  container.cancel = function () {
    if (timeout) {
      timeout.cancel()
    }
    return this
  }

  container.state = () => state

  return container
}

engine.audio.ramp.curve = function (audioParam, curve, duration = engine.const.zeroTime) {
  audioParam.cancelScheduledValues(0)
  audioParam.setValueCurveAtTime(curve, engine.audio.time(), engine.audio.time(duration))
  return this
}

engine.audio.ramp.exponential = function (audioParam, value, duration = engine.const.zeroTime) {
  engine.audio.ramp.hold(audioParam)
  audioParam.exponentialRampToValueAtTime(value, engine.audio.time(duration))
  return this
}

engine.audio.ramp.hold = function (audioParam) {
  audioParam.value = audioParam.value
  audioParam.cancelScheduledValues(0)
  return this
}

engine.audio.ramp.linear = function (audioParam, value, duration = engine.const.zeroTime) {
  engine.audio.ramp.hold(audioParam)
  audioParam.linearRampToValueAtTime(value, engine.audio.time(duration))
  return this
}

engine.audio.ramp.set = function (audioParam, value) {
  engine.audio.ramp.linear(audioParam, value, engine.performance.delta())
  return this
}
