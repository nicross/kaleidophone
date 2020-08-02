'use strict'

app.controls.keyboard = (() => {
  const controls = {
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    Enter: false,
    Home: false,
    KeyA: false,
    KeyD: false,
    KeyQ: false,
    KeyR: false,
    KeyS: false,
    KeyW: false,
    KeyZ: false,
    Space: false,
    Numpad4: false,
    Numpad5: false,
    Numpad7: false,
    Numpad8: false,
    PageDown: false,
    PageUp: false,
  }

  window.addEventListener('keydown', (e) => {
    if (e.repeat) {
      return
    }

    if (e.code in controls) {
      controls[e.code] = true
    }
  })

  window.addEventListener('keyup', (e) => {
    if (e.code in controls) {
      controls[e.code] = false
    }
  })

  return {
    game: () => {
      const moveDown = controls.ArrowDown || controls.KeyS || controls.Numpad5,
        moveUp = controls.ArrowUp || controls.KeyW || controls.Numpad8,
        turnLeft = controls.ArrowLeft || controls.KeyA || controls.Numpad4,
        turnRight = controls.ArrowRight || controls.KeyD || controls.Numpad6

      const state = {}

      let z = 0

      if (moveDown && !moveUp) {
        z = -1
      } else if (moveUp && !moveDown) {
        z = 1
      }

      if (turnLeft && !turnRight) {
        state.rotate = 1
      } else if (turnRight && !turnLeft) {
        state.rotate = -1
      }

      if (z) {
        state.z = z
      }

      return state
    },
    reset: function () {
      Object.keys(controls)
        .forEach((key) => controls[key] = false)

      return this
    },
    ui: () => {
      const state = {}

      if (controls.Enter) {
        state.enter = true
      }

      if (controls.KeyZ || controls.Numpad1 || controls.PageDown) {
        state.automoveDown = true
      }

      if (controls.KeyQ || controls.Numpad7 || controls.PageUp) {
        state.automoveUp = true
      }

      if (controls.Home || controls.KeyR || controls.Numpad9) {
        state.randomizeSeed = true
      }

      if (controls.Space) {
        state.space = true
      }

      return state
    },
  }
})()
