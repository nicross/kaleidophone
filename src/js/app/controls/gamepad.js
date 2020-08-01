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

    const buttons = {},
      sticks = []

    for (let i = 0; i < gamepads.length; i += 1) {
      const gamepad = gamepads[i]

      if (!gamepad) {
        continue
      }

      if (0 in gamepad.axes && 1 in gamepad.axes) {
        sticks[0] = {
          x: this.deadzone(gamepad.axes[0]),
          y: -this.deadzone(gamepad.axes[1]),
        }
      }

      if (2 in gamepad.axes && 3 in gamepad.axes) {
        sticks[1] = {
          x: this.deadzone(gamepad.axes[2]),
          y: -this.deadzone(gamepad.axes[3]),
        }
      }

      gamepad.buttons.forEach((button, i) => {
        buttons[i] |= button.pressed
      })
    }

    let rotate = 0

    if (sticks.length == 1) {
      rotate = -sticks[0].x
    } else if (sticks.length == 2) {
      rotate = -sticks[1].x
    }

    if (buttons[4] && !buttons[5]) {
      rotate = 1
    }

    if (buttons[5] && !buttons[4]) {
      rotate = -1
    }

    let x = sticks.length ? sticks[0].x : 0

    if (buttons[14]) {
      x = -1
    }

    if (buttons[15]) {
      x = 1
    }

    x = engine.utility.clamp(x, -1, 1)

    let y = sticks.reduce((y, stick) => y + stick.y, 0)

    if (buttons[12]) {
      y = 1
    }

    if (buttons[13]) {
      y = -1
    }

    // XXX: Math.atan2() returns 180° if y is negative zero, so coalesce to positive zero
    y = engine.utility.clamp(y, -1, 1) || 0

    return {
      rotate,
      translate: {
        radius: Math.min(1, engine.utility.distance(0, 0, x, y)),
        theta: Math.atan2(-x, y), // NOTE: Rotated -90°
      },
    }
  },
  ui: function () {
    const gamepads = navigator.getGamepads(),
      state = {}

    if (!gamepads.length) {
      return state
    }

    let x = 0,
      y = 0

    for (let i = 0; i < gamepads.length; i += 1) {
      const gamepad = gamepads[i],
        isPressed = (i) => i in gamepad.buttons && gamepad.buttons[i].pressed

      if (!gamepad) {
        continue
      }

      if (isPressed(1)) {
        state.cancel = true
      }

      if (isPressed(0)) {
        state.confirm = true
      }

      if (isPressed(8)) {
        state.select = true
      }

      if (isPressed(9)) {
        state.start = true
      }

      if (isPressed(3) || isPressed(10) || isPressed(11)) {
        state.automove = true
      }

      if (isPressed(12)) {
        y = 1
      }

      if (isPressed(13)) {
        y = -1
      }

      if (isPressed(14)) {
        x = -1
      }

      if (isPressed(15)) {
        x = 1
      }
    }

    const absX = Math.abs(x),
      absY = Math.abs(y)

    if (absX - absY >= 0.125) {
      if (x < 0) {
        state.left = true
      } else {
        state.right = true
      }
    } else if (absY - absX >= 0.125) {
      if (y < 0) {
        state.down = true
      } else {
        state.up = true
      }
    }

    return state
  },
}
