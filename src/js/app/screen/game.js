app.screen.game = (() => {
  const speedPresets = [
    1/64,
    1/32,
    1/24,
    1/16,
    1/12,
    1/8,
    1/6,
    1/4,
    1/2,
    1,
  ]

  let autoMove = 0,
    autoRotate = false,
    speedPreset = 5,
    root

  engine.ready(() => {
    root = document.querySelector('.a-game')
    app.utility.focus.trap(root)

    app.state.screen.on('enter-game', onEnter)
    app.state.screen.on('exit-game', onExit)
  })

  function calculateSpeed() {
    return speedPresets[speedPreset]
  }

  function calculateTime(inputZ = 0) {
    const speed = calculateSpeed()

    if (inputZ) {
      return inputZ * speed
    }

    if (autoMove) {
      return autoMove * speed
    }

    return 0
  }

  function handleControls({delta}) {
    const game = app.controls.game(),
      ui = app.controls.ui()

    if (ui.play) {
      autoMove = autoMove != 1 ? 1 : 0
    }

    if (ui.rewind) {
      autoMove = autoMove != -1 ? -1 : 0
    }

    if (ui.toggleRotate) {
      autoRotate = !autoRotate
    }

    if (ui.freeze) {
      autoMove = 0
      autoRotate = false
    }

    if (ui.decreaseSpeed) {
      speedPreset = Math.max(speedPreset - 1, 0)
    }

    if (ui.increaseSpeed) {
      speedPreset = Math.min(speedPreset + 1, speedPresets.length - 1)
    }

    if (ui.setSpeed0) {
      speedPreset = 0
    }

    if (ui.setSpeed1) {
      speedPreset = 1
    }

    if (ui.setSpeed2) {
      speedPreset = 2
    }

    if (ui.setSpeed3) {
      speedPreset = 3
    }

    if (ui.setSpeed4) {
      speedPreset = 4
    }

    if (ui.setSpeed5) {
      speedPreset = 5
    }

    if (ui.setSpeed6) {
      speedPreset = 6
    }

    if (ui.setSpeed7) {
      speedPreset = 7
    }

    if (ui.setSpeed8) {
      speedPreset = 8
    }

    if (ui.setSpeed9) {
      speedPreset = 9
    }

    handleRotate(game.rotate)
    content.system.time.add(calculateTime(game.z) * delta)

    if (ui.randomizeSeed) {
      engine.state.import({
        seed: Math.random(),
      })
    }
  }

  function handleRotate(inputRotate) {
    const amount = content.const.rotationSpeed * (inputRotate || (autoRotate ? -1 : 0))

    engine.position.setAngularVelocityEuler({
      yaw: amount,
    })
  }

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    engine.state.import({
      seed: Math.random(),
    })

    engine.audio.ramp.linear(engine.audio.mixer.master.param.gain, 1, 1)

    engine.audio.start()
    engine.loop.resume()
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame(e) {
    handleControls(e)
    app.screen.game.canvas.update(e)
  }

  return {}
})()
