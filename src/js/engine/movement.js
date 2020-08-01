'use strict'

engine.movement = (() => {
  const defaults = {
    angle: 0,
    deltaRotation: 0,
    deltaVelocity: 0,
    rotation: 0,
    velocity: 0,
  }

  let state = {...defaults}

  return {
    get: () => ({...state}),
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
    update: function ({rotate, translate}) {
      const delta = engine.loop.delta()

      const maxRotation = Math.min(Math.abs(engine.const.movementMaxRotation * rotate), engine.const.movementMaxRotation),
        maxVelocity = Math.min(engine.const.movementMaxVelocity * translate.radius, engine.const.movementMaxVelocity)

      if (translate.radius > 0) {
        if (state.velocity <= maxVelocity - (delta * engine.const.movementAcceleration)) {
          state.velocity += delta * engine.const.movementAcceleration
        } else if (state.velocity > maxVelocity) {
          state.velocity -= delta * engine.const.movementDeceleration
        }
      } else if (state.velocity >= delta * engine.const.movementDeceleration) {
        state.velocity -= delta * engine.const.movementDeceleration
      } else if (state.velocity != 0) {
        state.velocity = 0
      }

      if (rotate > 0) {
        if (state.rotation < maxRotation) {
          state.rotation += delta * engine.const.movementRotationalAcceleration * rotate
        }
      } else if (rotate < 0) {
        if (state.rotation > -maxRotation) {
          state.rotation += delta * engine.const.movementRotationalAcceleration * rotate
        }
      } else if (state.rotation >= engine.const.movementRotationalDeceleration) {
        state.rotation -= delta * engine.const.movementRotationalDeceleration
      } else if (state.rotation <= -engine.const.movementRotationalDeceleration) {
        state.rotation += delta * engine.const.movementRotationalDeceleration
      } else if (state.rotation != 0) {
        state.rotation = 0
      }

      if (translate.radius) {
        state.angle = translate.theta
      }

      state.deltaRotation = delta * state.rotation
      state.deltaVelocity = delta * state.velocity

      return this
    },
  }
})()

engine.state.on('reset', () => engine.movement.reset())
