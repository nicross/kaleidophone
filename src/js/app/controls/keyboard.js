app.controls.keyboard = {
  game: () => {
    const keys = engine.input.keyboard.get(),
      state = {}

    const scrubBackward = keys.ArrowDown || keys.KeyS || keys.Numpad5,
      scrubForward = keys.ArrowUp || keys.KeyW || keys.Numpad8,
      turnLeft = keys.ArrowLeft || keys.KeyA || keys.Numpad4,
      turnRight = keys.ArrowRight || keys.KeyD || keys.Numpad6

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
  ui: () => {
    const keys = engine.input.keyboard.get(),
      state = {}

    if (keys.Enter) {
      state.enter = true
    }

    if (keys.Space) {
      state.space = true
    }

    if (keys.KeyE || keys.Numpad9 || keys.PageUp) {
      state.play = true
    }

    if (keys.KeyQ || keys.Numpad7 || keys.PageDown) {
      state.rewind = true
    }

    if (keys.Equal || keys.NumpadAdd) {
      state.increaseSpeed = true
    }

    if (keys.Minus || keys.NumpadSubtract) {
      state.decreaseSpeed = true
    }

    if (keys.Digit0) {
      state.setSpeed0 = true
    }

    if (keys.Digit1) {
      state.setSpeed1 = true
    }

    if (keys.Digit2) {
      state.setSpeed2 = true
    }

    if (keys.Digit3) {
      state.setSpeed3 = true
    }

    if (keys.Digit4) {
      state.setSpeed4 = true
    }

    if (keys.Digit5) {
      state.setSpeed5 = true
    }

    if (keys.Digit6) {
      state.setSpeed6 = true
    }

    if (keys.Digit7) {
      state.setSpeed7 = true
    }

    if (keys.Digit8) {
      state.setSpeed8 = true
    }

    if (keys.Digit9) {
      state.setSpeed9 = true
    }

    if (keys.Home || keys.KeyR || keys.NumpadMultiply) {
      state.randomizeSeed = true
    }

    if (keys.End || keys.KeyF || keys.Numpad0) {
      state.toggleRotate = true
    }

    if (keys.Delete || keys.KeyZ || keys.NumpadDecimal) {
      state.freeze = true
    }

    return state
  },
}
