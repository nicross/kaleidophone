'use strict'

engine.position = (() => {
  const defaults = {
    angle: 0,
    delta: 0,
    x: 0,
    y: 0,
  }

  let state = {...defaults}

  return {
    get: () => ({...state}),
    rect: () => ({
      height: engine.const.positionRadius * 2,
      width: engine.const.positionRadius * 2,
      x: state.x - engine.const.positionRadius,
      y: state.y - engine.const.positionRadius,
    }),
    reset: function () {
      return this.set()
    },
    set: function (values = {}) {
      state = {
        ...defaults,
        ...values,
      }

      return this
    },
    turn: function (amount = 0) {
      state.angle = engine.utility.normalizeAngle(state.angle + amount)
      return this
    },
    update: function () {
      const {angle, deltaRotation, deltaVelocity} = engine.movement.get()

      state.angle = engine.utility.normalizeAngle(state.angle + deltaRotation)
      state.x += deltaVelocity * Math.cos(state.angle + angle)
      state.y += deltaVelocity * Math.sin(state.angle + angle)

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  engine.position.update()
})

engine.state.on('export', (data = {}) => data.position = engine.position.get())
engine.state.on('import', (data = {}) => engine.position.set(data.position))
engine.state.on('reset', () => engine.position.set())
