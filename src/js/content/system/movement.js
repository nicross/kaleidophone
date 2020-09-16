content.system.movement = (() => {
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

      const maxRotation = Math.min(Math.abs(content.const.movementMaxRotation * rotate), content.const.movementMaxRotation),
        maxVelocity = Math.min(content.const.movementMaxVelocity * translate.radius, content.const.movementMaxVelocity)

      if (translate.radius > 0) {
        if (state.velocity <= maxVelocity - (delta * content.const.movementAcceleration)) {
          state.velocity += delta * content.const.movementAcceleration
        } else if (state.velocity > maxVelocity) {
          state.velocity -= delta * content.const.movementDeceleration
        }
      } else if (state.velocity >= delta * content.const.movementDeceleration) {
        state.velocity -= delta * content.const.movementDeceleration
      } else if (state.velocity != 0) {
        state.velocity = 0
      }

      if (rotate > 0) {
        if (state.rotation < maxRotation) {
          state.rotation += delta * content.const.movementRotationalAcceleration * rotate
        }
      } else if (rotate < 0) {
        if (state.rotation > -maxRotation) {
          state.rotation += delta * content.const.movementRotationalAcceleration * rotate
        }
      } else if (state.rotation >= content.const.movementRotationalDeceleration) {
        state.rotation -= delta * content.const.movementRotationalDeceleration
      } else if (state.rotation <= -content.const.movementRotationalDeceleration) {
        state.rotation += delta * content.const.movementRotationalDeceleration
      } else if (state.rotation != 0) {
        state.rotation = 0
      }

      if (translate.radius) {
        state.angle = translate.theta
      }

      state.deltaRotation = delta * state.rotation
      state.deltaVelocity = delta * state.velocity

      engine.position.setEuler({
        yaw: engine.position.getEuler().yaw + state.deltaRotation,
      })

      return this
    },
  }
})()

engine.state.on('reset', () => content.system.movement.reset())
