'use strict'

engine.streamer = (() => {
  const propRegistry = new Map(),
    streamedProps = new Map()

  let currentX,
    currentY

  function createRegisteredProp(token) {
    if (!propRegistry.has(token)) {
      return
    }

    const streamedProp = engine.streamer.prop.create(
      propRegistry.get(token)
    )

    streamedProps.set(token, streamedProp)
  }

  function destroyStreamedProp(token) {
    if (!streamedProps.has(token)) {
      return
    }

    const streamedProp = streamedProps.get(token)

    streamedProp.destroy()
    streamedProps.delete(token)
  }

  function generateToken() {
    let token

    do {
      token = engine.utility.uuid()
    } while (propRegistry.has(token))

    return token
  }

  function isWithinRadius(x, y) {
    return engine.utility.distance(x, y, currentX, currentY) <= engine.const.streamerRadius
  }

  return {
    cullProp: function (token) {
      const streamedProp = streamedProps.get(token)

      if (streamedProp) {
        streamedProp.cull()
      }

      return this
    },
    deregisterProp: function(token) {
      propRegistry.delete(token)
      return this
    },
    getRegisteredProp: (token) => propRegistry.get(token),
    getRegisteredProps: () => propRegistry.values(),
    getStreamedProp: (token) => streamedProps.get(token),
    getStreamedProps: () => streamedProps.values(),
    hasRegisteredProp: (token) => propRegistry.has(token),
    hasStreamedProp: (token) => streamedProps.has(token),
    registerProp: function(prototype, options = {}) {
      const token = generateToken()

      propRegistry.set(token, {
        options,
        prototype,
        token,
      })

      if (isWithinRadius(options.x, options.y)) {
        createRegisteredProp(token)
      }

      return token
    },
    reset: function() {
      propRegistry.clear()

      streamedProps.forEach((streamedProp) => streamedProp.destroy())
      streamedProps.clear()

      currentX = null
      currentY = null

      return this
    },
    update: (force = false) => {
      const position = engine.position.get(),
        positionX = Math.round(position.x),
        positionY = Math.round(position.y)

      if (currentX === positionX && currentY === positionY && !force) {
        return this
      }

      currentX = positionX
      currentY = positionY

      streamedProps.forEach((streamedProp, token) => {
        if (!streamedProp.prop.shouldCull) {
          if (isWithinRadius(streamedProp.prop.x, streamedProp.prop.y)) {
            return
          }

          if (isWithinRadius(streamedProp.prop.spawnX, streamedProp.prop.spawnY)) {
            return
          }
        }

        destroyStreamedProp(token)
      })

      propRegistry.forEach((registeredProp, token) => {
        if (streamedProps.has(token)) {
          return
        }

        if (!isWithinRadius(registeredProp.options.x, registeredProp.options.y)) {
          return
        }

        createRegisteredProp(token)
      })

      return this
    },
    updateRegisteredProp: function (token, options = {}) {
      // XXX: If changing prototype then probably doing it wrong
      // XXX: If changing a streamed prop then probably doing it wrong

      const registeredProp = propRegistry.get(token)

      if (!registeredProp) {
        return this
      }

      registeredProp.options = {
        ...registeredProp.options,
        ...options,
      }

      return this
    },
  }
})()

engine.loop.on('frame', ({ paused }) => {
  if (paused) {
    return
  }

  engine.streamer.update()
})

engine.state.on('reset', () => engine.streamer.reset())
