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

  function calculateSpeed() {
    return speedPresets[speedPreset]
  }

  function calculateZ(inputZ = 0) {
    const speed = calculateSpeed()

    if (autoMove) {
      return autoMove * speed
    }

    return inputZ * speed
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

    engine.movement.update({
      rotate: autoRotate ? 1 : game.rotate,
      translate: {
        radius: 0,
        theta: 0,
      },
    })

    content.system.z.add(calculateZ(game.z) * delta)

    if (ui.randomizeSeed) {
      engine.state.import({
        seed: Math.random(),
      })
    }
  }

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)

    engine.state.import({
      seed: Math.random(),
    })

    engine.audio.ramp.linear(engine.audio.mixer.master.param.gain, 1, 1)

    engine.loop.resume()
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame(e) {
    handleControls(e)
    app.screen.game.canvas.update(e)
  }

  return {
    activate: function () {
      root = document.querySelector('.a-game')
      app.utility.focus.trap(root)

      app.state.screen.on('enter-game', onEnter)
      app.state.screen.on('exit-game', onExit)

      return this
    },
  }
})()

app.once('activate', () => app.screen.game.activate())
