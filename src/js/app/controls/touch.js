app.controls.touch = (() => {
  const touches = new Map()

  let height = 0,
    width = 0

  engine.ready(() => {
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchstart', onTouchStart)

    window.addEventListener('orientationchange', cacheDimensions)
    window.addEventListener('resize', cacheDimensions)
    cacheDimensions()
  })

  // XXX: Prevent touches causing pointer lock
  window.addEventListener('touchend', (e) => {
    e.preventDefault()
  })

  function cacheDimensions() {
    height = window.innerHeight
    width = window.innerWidth
  }

  function getAction(touch) {
    const x = touch.clientX,
      y = touch.clientY

    // Top, left to right
    if (
         engine.utility.between(x, 0, width * 1/3)
      && engine.utility.between(y, 0, height * 1/3)
    ) {
      return 'freeze'
    }
    if (
         engine.utility.between(x, width * 1/3, width * 2/3)
      && engine.utility.between(y, 0, height * 1/3)
    ) {
      return 'increaseSpeed'
    }
    // No top right

    // Center, left to right
    if (
         engine.utility.between(x, 0, width * 1/3)
      && engine.utility.between(y, height * 1/3, height * 2/3)
    ) {
      return 'rewind'
    }

    if (
         engine.utility.between(x, width * 1/3, width * 2/3)
      && engine.utility.between(y, height * 1/3, height * 2/3)
    ) {
      return 'randomizeSeed'
    }

    if (
         engine.utility.between(x, width * 2/3, width)
      && engine.utility.between(y, height * 1/3, height * 2/3)
    ) {
      return 'play'
    }

    // Bottom, left to right
    // No bottom left
    if (
         engine.utility.between(x, width * 1/3, width * 2/3)
      && engine.utility.between(y, height * 2/3, height)
    ) {
      return 'decreaseSpeed'
    }

    if (
         engine.utility.between(x, width * 2/3, width)
      && engine.utility.between(y, height * 2/3, height)
    ) {
      return 'toggleRotate'
    }

    return 'unknown'
  }

  function onTouchStart(e) {
    for (const touch of e.changedTouches) {
      touches.set(touch.identifier, getAction(touch))
    }
  }

  function onTouchEnd(e) {
    for (const touch of e.changedTouches) {
      touches.delete(touch.identifier)
    }
  }

  return {
    ui: () => {
      const state = {}

      for (const [key, action] of touches) {
        state[action] = true
      }

      return state
    },
  }
})()
