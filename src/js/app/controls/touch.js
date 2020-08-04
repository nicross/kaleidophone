app.controls.touch = (() => {
  const touches = new Map()

  let height = 0,
    width = 0

  function cacheDimensions() {
    height = window.innerHeight
    width = window.innerWidth
  }

  function getAction(touch) {
    const x = touch.clientX,
      y = touch.clientY

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

    if (
         engine.utility.between(x, 0, width * 1/3)
      && engine.utility.between(y, height * 1/3, height * 2/3)
    ) {
      return 'rewind'
    }

    if (
         engine.utility.between(x, width * 1/3, width * 2/3)
      && engine.utility.between(y, 0, height * 1/3)
    ) {
      return 'increaseSpeed'
    }

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

    if (
         engine.utility.between(x, 0, width * 1/3)
      && engine.utility.between(y, 0, height * 1/3)
    ) {
      return 'freeze'
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
    activate: function () {
      const game = document.querySelector('.a-game--canvas')

      game.addEventListener('touchend', onTouchEnd)
      game.addEventListener('touchstart', onTouchStart)

      window.addEventListener('orientationchange', cacheDimensions)
      window.addEventListener('resize', cacheDimensions)
      cacheDimensions()

      return this
    },
    ui: () => {
      const state = {}

      for (const [key, action] of touches) {
        state[action] = true
      }

      return state
    },
  }
})()

app.once('activate', () => app.controls.touch.activate())
