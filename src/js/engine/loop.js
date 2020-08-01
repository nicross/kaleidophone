'use strict'

engine.loop = (() => {
  const pubsub = engine.utility.pubsub.create()

  let activeRequest,
    delta = 0,
    frameCount = 0,
    idleRequest,
    isPaused = false,
    isRunning = false,
    lastFrame

  function cancelFrame() {
    cancelAnimationFrame(activeRequest)
    clearTimeout(idleRequest)
  }

  function doActiveFrame() {
    const now = performance.now()

    delta = (lastFrame ? now - lastFrame : 0) / 1000
    lastFrame = now

    frame()
  }

  function doIdleFrame() {
    delta = engine.const.idleDelta
    lastFrame = performance.now()

    frame()
  }

  function getNextIdleDelay() {
    const deltaTime = lastFrame ? performance.now() - lastFrame : 0
    return Math.max(0, (engine.const.idleDelta * 1000) - deltaTime)
  }

  function frame() {
    frameCount += 1

    pubsub.emit('frame', {
      delta,
      frame: frameCount,
      paused: isPaused,
    })

    scheduleFrame()
  }

  function scheduleFrame() {
    if (!isRunning) {
      return
    }

    if (document.hidden) {
      idleRequest = setTimeout(doIdleFrame, getNextIdleDelay())
    } else {
      activeRequest = requestAnimationFrame(doActiveFrame)
    }
  }

  document.addEventListener('visibilitychange', () => {
    lastFrame = null
    cancelFrame()
    scheduleFrame()
  })

  return engine.utility.pubsub.decorate({
    delta: () => delta,
    frame: () => frameCount,
    isPaused: () => isPaused,
    isRunning: () => isRunning,
    pause: function () {
      if (isPaused) {
        return this
      }

      isPaused = true
      pubsub.emit('pause')

      return this
    },
    resume: function () {
      if (!isPaused) {
        return this
      }

      isPaused = false
      pubsub.emit('resume')

      return this
    },
    start: function () {
      if (isRunning) {
        return this
      }


      isRunning = true
      lastFrame = null

      scheduleFrame()
      pubsub.emit('start')

      return this
    },
    stop: function () {
      if (!isRunning) {
        return this
      }

      cancelFrame()

      delta = 0
      frameCount = 0
      isRunning = false
      lastFrame = null

      pubsub.emit('stop')

      return this
    }
  }, pubsub)
})()
