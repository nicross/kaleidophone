app.controls.mouse = (() => {
  const sensitivity = 100

  window.addEventListener('click', () => {
    if (!isPointerLock()) {
      requestPointerLock()
    }
  })

  function isPointerLock() {
    return Boolean(document.pointerLockElement)
  }

  function requestPointerLock() {
    document.querySelector('.a-app').requestPointerLock()
  }

  return {
    game: () => {
      const mouse = engine.input.mouse.get(),
        state = {}

      if (!isPointerLock()) {
        return state
      }

      if (mouse.button[0] && !mouse.button[2]) {
        state.z = 1
      }

      if (mouse.button[2] && !mouse.button[0]) {
        state.z = -1
      }

      if (mouse.moveX) {
        state.rotate = engine.utility.scale(mouse.moveX, -window.innerWidth, window.innerWidth, 1, -1) * sensitivity
      }

      return state
    },
    ui: () => {
      const mouse = engine.input.mouse.get(),
        state = {}

      if (!isPointerLock()) {
        return state
      }

      if (mouse.button[1]) {
        state.randomizeSeed = true
      }

      if (mouse.button[3] && !mouse.button[4]) {
        state.rewind = true
      }

      if (mouse.button[4] && !mouse.button[3]) {
        state.play = true
      }

      if (mouse.wheelY < 0) {
        state.increaseSpeed = true
      } else if (mouse.wheelY > 0) {
        state.decreaseSpeed = true
      }

      return state
    },
  }
})()
