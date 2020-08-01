'use strict'

app.controls.keyboard = (() => {
  const controls = {
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    Backspace: false,
    Delete: false,
    Enter: false,
    Escape: false,
    KeyA: false,
    KeyD: false,
    KeyE: false,
    KeyQ: false,
    KeyS: false,
    KeyW: false,
    Numpad4: false,
    Numpad5: false,
    Numpad6: false,
    Numpad7: false,
    Numpad8: false,
    Numpad9: false,
    NumpadDecimal: false,
    NumpadEnter: false,
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
      const moveBackward = controls.ArrowDown || controls.KeyS || controls.Numpad5,
        moveForward = controls.ArrowUp || controls.KeyW || controls.Numpad8,
        strafeLeft = controls.KeyA || controls.Numpad4,
        strafeRight = controls.KeyD || controls.Numpad6,
        turnLeft = controls.ArrowLeft || controls.KeyQ || controls.Numpad7,
        turnRight = controls.ArrowRight || controls.KeyE || controls.Numpad9

      const state = {}

      let x = 0,
        y = 0

      if (moveBackward && !moveForward) {
        y = -1
      } else if (moveForward && !moveBackward) {
        y = 1
      }

      if (strafeLeft && !strafeRight) {
        x = -1
      } else if (strafeRight && !strafeLeft) {
        x = 1
      }

      if (turnLeft && !turnRight) {
        state.rotate = 1
      } else if (turnRight && !turnLeft) {
        state.rotate = -1
      }

      if (x || y) {
        state.translate = {
          radius: 1,
          theta: Math.atan2(-x, y), // NOTE: Rotated -90°
        }
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

      if (controls.Backspace) {
        state.backspace = true
      }

      if (controls.Delete || controls.NumpadDecimal) {
        state.delete = true
      }

      if (controls.Enter || controls.NumpadEnter) {
        state.enter = true
      }

      if (controls.Escape) {
        state.escape = true
      }

      if (controls.Space) {
        state.space = true
      }

      if (controls.ArrowDown || controls.KeyS || controls.Numpad5) {
        state.down = true
      }

      if (controls.ArrowLeft || controls.KeyA || controls.Numpad4) {
        state.left = true
      }

      if (controls.ArrowRight || controls.KeyD || controls.Numpad6) {
        state.right = true
      }

      if (controls.ArrowUp || controls.KeyW || controls.Numpad8) {
        state.up = true
      }

      return state
    },
  }
})()
