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

    const buttons = {}

    let rotate = 0,
      z = 0

    for (let i = 0; i < gamepads.length; i += 1) {
      const gamepad = gamepads[i]

      if (!gamepad) {
        continue
      }

      if (0 in gamepad.axes && 1 in gamepad.axes) {
        z += this.deadzone(gamepad.axes[1])
      }

      if (2 in gamepad.axes && 3 in gamepad.axes) {
        rotate += this.deadzone(gamepad.axes[2])
      } else {
        rotate += this.deadzone(gamepad.axes[0])
      }

      gamepad.buttons.forEach((button, i) => {
        buttons[i] |= button.pressed
      })
    }

    const down = buttons[13],
      left = buttons[14],
      right = buttons[15],
      up = buttons[12]

    if (left && !right) {
      rotate = -1
    } else if (right && !left) {
      rotate = 1
    }

    // TODO: Triggers for analog up/down controls
    // buttons[6].value (backward)
    // buttons[7].value (forward)

    if (down && !up) {
      z = -1
    } else if (up && !down) {
      z = 1
    }

    z = engine.utility.clamp(z, -1, 1)

    return {
      rotate,
      z,
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

    if (buttons[0]) {
      // XXX: Only for splash
      state.confirm = true
    }

    if (buttons[0] || buttons[4]) {
      state.automoveDown = true
    }

    if (buttons[1] || buttons[8]) {
      state.randomizeSeed = true
    }

    if (buttons[3] || buttons[5]) {
      state.automoveUp = true
    }

    if (buttons[9]) {
      state.start = true
    }

    return state
  },
}
