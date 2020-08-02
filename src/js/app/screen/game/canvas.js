app.screen.game.canvas = (() => {
  const height = 64,
    width = 64

  let canvas,
    canvasContext

  return {
    activate: function () {
      canvas = document.querySelector('.a-game--canvas')
      canvasContext = canvas.getContext('2d')

      return this
    },
    update: function () {
      return this
    },
  }
})()

app.once('activate', () => app.screen.game.canvas.activate())
