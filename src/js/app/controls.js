app.controls = (() => {
  const gameDefaults = {
    rotate: 0,
    z: 0,
  }

  let uiCache = {},
    uiDelta = {}

  let gameCache = {...gameDefaults}

  function updateGame() {
    gameCache = {
      ...gameDefaults,
      ...app.controls.gamepad.game(),
      ...app.controls.keyboard.game(),
    }
  }

  function updateUi() {
    const values = {
      ...app.controls.gamepad.ui(),
      ...app.controls.keyboard.ui(),
    }

    uiDelta = {}

    for (const key in values) {
      if (!uiCache[key]) {
        uiDelta[key] = values[key]
      }
    }

    uiCache = values
  }

  return {
    game: () => ({...gameCache}),
    ui: () => ({...uiDelta}),
    reset: function () {
      gameCache = {}
      uiCache = {}
      uiDelta = {}
      return this
    },
    update: function () {
      updateGame()
      updateUi()
      return this
    },
  }
})()

engine.loop.on('frame', () => app.controls.update())
