app.controls.gamepad = {
  game: function () {
    let rotate = 0,
      z = 0

    if (engine.input.gamepad.hasAxis(0, 1)) {
      rotate += engine.input.gamepad.getAxis(0, true)
      z += engine.input.gamepad.getAxis(1, true)
    }

    if (engine.input.gamepad.hasAxis(2, 3)) {
      rotate += engine.input.gamepad.getAxis(2, true)
      z += engine.input.gamepad.getAxis(3, true)
    }

    z += engine.input.gamepad.getAnalog(7)
    z -= engine.input.gamepad.getAnalog(6)

    return {
      rotate: engine.utility.clamp(rotate, -1, 1),
      z: engine.utility.clamp(z, -1, 1),
    }
  },
  ui: function () {
    const state = {}

    if (engine.input.gamepad.isDigital(9)) {
      state.start = true
    }

    if (engine.input.gamepad.isDigital(0)) {
      state.confirm = true
    }

    if (engine.input.gamepad.isDigital(5) || engine.input.gamepad.isDigital(15)) {
      state.play = true
    }

    if (engine.input.gamepad.isDigital(4) || engine.input.gamepad.isDigital(14)) {
      state.rewind = true
    }

    if (engine.input.gamepad.isDigital(12)) {
      state.increaseSpeed = true
    }

    if (engine.input.gamepad.isDigital(13)) {
      state.decreaseSpeed = true
    }

    if (engine.input.gamepad.isDigital(2) || engine.input.gamepad.isDigital(8)) {
      state.randomizeSeed = true
    }

    if (engine.input.gamepad.isDigital(0)) {
      state.toggleRotate = true
    }

    if (engine.input.gamepad.isDigital(1) || engine.input.gamepad.isDigital(9)) {
      state.freeze = true
    }

    return state
  },
}
