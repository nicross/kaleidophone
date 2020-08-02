app.screen.game.canvas = (() => {
  const height = 64,
    width = 64

  let canvas,
    canvasContext

  app.once('activate', () => {
    canvas = document.querySelector('.a-game--canvas')
    canvasContext = canvas.getContext('2d')
  })

  return {
    update: function () {
      return this
    },
  }
})()
