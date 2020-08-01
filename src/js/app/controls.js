'use strict'

app.controls = (() => {
  let uiCache = {},
    uiDelta = {}

  let gameCache = {
    rotate: 0,
    translate: {
      radius: 0,
      theta: 0,
    },
  }

  return {
    game: () => ({...gameCache}),
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
        ...this.gamepad.game(),
        ...this.keyboard.game(),
      }

      gameCache.translate.theta = engine.utility.normalizeAngleSigned(gameCache.translate.theta)

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

  engine.movement.update({
    ...app.controls.game(),
  })
})
