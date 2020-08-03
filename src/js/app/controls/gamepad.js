'use strict'

app.controls.gamepad = {
  deadzone: (input, threshold = 0.1875) => {
    const ratio = (Math.abs(input) - threshold) / (1 - threshold),
      sign = input > 0 ? 1 : -1

    return ratio > 0 ? sign * ratio : 0
  },
  game: function () {
    const gamepads = navigator.getGamepads()

    if (!gamepads.length) {
      return {}
    }

    let rotate = 0,
      z = 0

    for (let i = 0; i < gamepads.length; i += 1) {
      const gamepad = gamepads[i]

      if (!gamepad) {
        continue
      }

      if (2 in gamepad.axes && 3 in gamepad.axes) {
        rotate += this.deadzone(gamepad.axes[2])
      } else {
        rotate += this.deadzone(gamepad.axes[0])
      }

      if (6 in gamepad.buttons) {
        z -= gamepad.buttons[6].value
      }

      if (7 in gamepad.buttons) {
        z += gamepad.buttons[7].value
      }
    }

    return {
      rotate: engine.utility.clamp(rotate, -1, 1),
      z: engine.utility.clamp(z, -1, 1),
    }
  },
  ui: function () {
    const gamepads = navigator.getGamepads()

    if (!gamepads.length) {
      return {}
    }

    const buttons = {},
      state = {}

    for (let i = 0; i < gamepads.length; i += 1) {
      const gamepad = gamepads[i]

      if (!gamepad) {
        continue
      }

      gamepad.buttons.forEach((button, i) => {
        buttons[i] |= button.pressed
      })
    }

    if (buttons[9]) {
      state.start = true
    }

    if (buttons[0]) {
      state.confirm = true
    }

    if (buttons[5] || buttons[15]) {
      state.play = true
    }

    if (buttons[4] || buttons[14]) {
      state.rewind = true
    }

    if (buttons[12]) {
      state.increaseSpeed = true
    }

    if (buttons[13]) {
      state.decreaseSpeed = true
    }

    if (buttons[8]) {
      state.randomizeSeed = true
    }

    if (buttons[11]) {
      state.toggleRotate = true
    }

    return state
  },
}
