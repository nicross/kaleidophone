app.screen.splash.canvas = (() => {
  const height = 64,
    width = 64

  let canvas,
    canvasContext

  return {
    activate: function () {
      canvas = document.querySelector('.a-splash--canvas')
      canvasContext = canvas.getContext('2d')

      return this
    },
    update: function () {
      return this
    },
  }
})()

app.once('activate', () => app.screen.splash.canvas.activate())
