'use strict'

app.controls.keyboard = (() => {
  const controls = {
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    Delete: false,
    Digit0: false,
    Digit1: false,
    Digit2: false,
    Digit3: false,
    Digit4: false,
    Digit5: false,
    Digit6: false,
    Digit7: false,
    Digit8: false,
    Digit9: false,
    End: false,
    Enter: false,
    Equal: false,
    Home: false,
    KeyA: false,
    KeyD: false,
    KeyE: false,
    KeyF: false,
    KeyQ: false,
    KeyR: false,
    KeyS: false,
    KeyW: false,
    KeyZ: false,
    Minus: false,
    Numpad0: false,
    Numpad4: false,
    Numpad5: false,
    Numpad6: false,
    Numpad7: false,
    Numpad8: false,
    Numpad9: false,
    NumpadAdd: false,
    NumpadDecimal: false,
    NumpadMultiply: false,
    NumpadSubtract: false,
    PageDown: false,
    PageUp: false,
    Space: false,
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
      const scrubBackward = controls.ArrowDown || controls.KeyS || controls.Numpad5,
        scrubForward = controls.ArrowUp || controls.KeyW || controls.Numpad8,
        turnLeft = controls.ArrowLeft || controls.KeyA || controls.Numpad4,
        turnRight = controls.ArrowRight || controls.KeyD || controls.Numpad6

      const state = {}

      let z = 0

      if (scrubBackward && !scrubForward) {
        z = -1
      } else if (scrubForward && !scrubBackward) {
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

      if (controls.Space) {
        state.space = true
      }

      if (controls.KeyE || controls.Numpad9 || controls.PageUp) {
        state.play = true
      }

      if (controls.KeyQ || controls.Numpad7 || controls.PageDown) {
        state.rewind = true
      }

      if (controls.Equal || controls.NumpadAdd) {
        state.increaseSpeed = true
      }

      if (controls.Minus || controls.NumpadSubtract) {
        state.decreaseSpeed = true
      }

      if (controls.Digit0) {
        state.setSpeed0 = true
      }

      if (controls.Digit1) {
        state.setSpeed1 = true
      }

      if (controls.Digit2) {
        state.setSpeed2 = true
      }

      if (controls.Digit3) {
        state.setSpeed3 = true
      }

      if (controls.Digit4) {
        state.setSpeed4 = true
      }

      if (controls.Digit5) {
        state.setSpeed5 = true
      }

      if (controls.Digit6) {
        state.setSpeed6 = true
      }

      if (controls.Digit7) {
        state.setSpeed7 = true
      }

      if (controls.Digit8) {
        state.setSpeed8 = true
      }

      if (controls.Digit9) {
        state.setSpeed9 = true
      }

      if (controls.Home || controls.KeyR || controls.NumpadMultiply) {
        state.randomizeSeed = true
      }

      if (controls.End || controls.KeyF || controls.Numpad0) {
        state.toggleRotate = true
      }

      if (controls.Delete || controls.KeyZ || controls.NumpadDecimal) {
        state.freeze = true
      }

      return state
    },
  }
})()
