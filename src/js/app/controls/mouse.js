app.controls.mouse = (() => {
  window.addEventListener('click', () => {
    if (!isPointerLock()) {
      requestPointerLock()
    }
  })

  // XXX: Default behavior not working in Electron
  window.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
      document.exitPointerLock()
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
        state.rotate = Math.sign(mouse.moveX)
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
