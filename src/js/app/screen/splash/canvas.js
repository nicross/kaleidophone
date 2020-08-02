app.screen.splash.canvas = (() => {
  const height = 64,
    width = 64

  let canvas,
    canvasContext

  app.once('activate', () => {
    canvas = document.querySelector('.a-splash--canvas')
    canvasContext = canvas.getContext('2d')
  })

  return {
    update: function () {
      return this
    },
  }
})()
