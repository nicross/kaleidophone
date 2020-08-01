'use strict'

app.controls = (() => {
  let automove = 0,
    uiCache = {},
    uiDelta = {}

  let gameCache = {
    rotate: 0,
    translate: {
      radius: 0,
      theta: 0,
    },
    z: 0,
  }

  return {
    game: () => ({...gameCache}),
    setAutomove: function (state) {
      isAutomove = Number(state)
      return this
    },
    ui: () => ({...uiDelta}),
    update: function () {
      return this.updateGame().updateUi()
    },
    updateGame: function () {
      gameCache = {
        rotate: 0,
        translate: {
          radius: 0,
          theta: 0,
        },
        z: 0,
        ...this.gamepad.game(),
        ...this.keyboard.game(),
      }

      if (automove) {
        gameCache.z = automove
      }

      return this
    },
    updateUi: function () {
      const values = {
        ...this.gamepad.ui(),
        ...this.keyboard.ui(),
      }

      uiDelta = {}

      for (const key in values) {
        if (!uiCache[key]) {
          uiDelta[key] = values[key]
        }
      }

      uiCache = values

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  app.controls.update()

  if (paused) {
    return
  }

  const {rotate, z} = app.controls.game()

  engine.movement.update({
    rotate,
    translate: {
      radius: 0,
      theta: 0,
    },
  })

  content.system.z.add(z / 60 / 4)
})
