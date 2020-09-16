engine.position = (() => {
  const proxy = engine.utility.physical.decorate({})

  return {
    export: () => ({
      quaternion: {
        w: proxy.quaternion.w,
        x: proxy.quaternion.x,
        y: proxy.quaternion.y,
        z: proxy.quaternion.z,
      },
      x: proxy.x,
      y: proxy.y,
      z: proxy.z,
    }),
    getAngularVelocity: () => proxy.angularVelocity.clone(),
    getAngularVelocityEuler: () => engine.utility.euler.fromQuaternion(proxy.angularVelocity),
    getEuler: () => proxy.euler(),
    getQuaternion: () => proxy.quaternion.clone(),
    getThrust: () => proxy.thrust.clone(),
    getVector: () => proxy.vector(),
    getVelocity: () => proxy.velocity.clone(),
    import: function ({
      quaternion = {},
      x = 0,
      y = 0,
      z = 0,
    } = {}) {
      proxy.x = x
      proxy.y = y
      proxy.z = z

      proxy.quaternion.set(quaternion)

      proxy.angularVelocity.set()
      proxy.thrust.set()
      proxy.velocity.set()

      return this
    },
    rect: () => ({
      depth: engine.const.positionRadius * 2,
      height: engine.const.positionRadius * 2,
      width: engine.const.positionRadius * 2,
      x: proxy.x - engine.const.positionRadius,
      y: proxy.y - engine.const.positionRadius,
      z: proxy.z - engine.const.positionRadius,
    }),
    reset: function () {
      return this.import()
    },
    setAngularVelocity: function ({
      w = 0,
      x = 0,
      y = 0,
      z = 0,
    } = {}) {
      proxy.angularVelocity.set({
        w,
        x,
        y,
        z,
      })

      return this
    },
    setAngularVelocityEuler: function ({
      pitch = 0,
      roll = 0,
      yaw = 0,
    } = {}) {
      proxy.angularVelocity.set(
        engine.utility.quaternion.fromEuler({
          pitch,
          roll,
          yaw,
        })
      )

      return this
    },
    setEuler: function ({
      pitch = 0,
      roll = 0,
      yaw = 0,
    } = {}) {
      proxy.quaternion.set(
        engine.utility.quaternion.fromEuler({
          pitch,
          roll,
          yaw,
        })
      )

      return this
    },
    setQuaternion: function ({
      w = 0,
      x = 0,
      y = 0,
      z = 0,
    } = {}) {
      proxy.quaternion.set({
        w,
        x,
        y,
        z,
      })

      return this
    },
    setThrust: function ({
      x = 0,
      y = 0,
      z = 0,
    } = {}) {
      proxy.thrust.set({
        x,
        y,
        z,
      })

      return this
    },
    setVector: function ({
      x = 0,
      y = 0,
      z = 0,
    } = {}) {
      proxy.x = x
      proxy.y = y
      proxy.z = z

      return this
    },
    setVelocity: function ({
      x = 0,
      y = 0,
      z = 0,
    } = {}) {
      proxy.velocity.set({
        x,
        y,
        z,
      })

      return this
    },
    update: function () {
      proxy.updatePhysics()
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

engine.state.on('export', (data = {}) => data.position = engine.position.export())
engine.state.on('import', (data = {}) => engine.position.import(data.position))
engine.state.on('reset', () => engine.position.reset())
