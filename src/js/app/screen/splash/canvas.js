app.screen.splash.canvas = (() => {
  const height = 64,
    width = 64

  let canvas,
    canvasContext,
    interactSpriteData,
    logoSpriteData

  function loadSprites() {
    loadSprite('./img/splash/interact.png', 31, 3).then((imageData) => {
      interactSpriteData = imageData
    })

    loadSprite('./img/splash/logo.png', 54, 26).then((imageData) => {
      logoSpriteData = imageData
    })
  }

  function loadSprite(src, width = 0, height = 0) {
    return new Promise((resolve) => {
      const tempCanvas = document.createElement('canvas'),
        tempContext = tempCanvas.getContext('2d')

      tempCanvas.height = height
      tempCanvas.width = width

      const image = new Image()
      image.src = src

      image.onload = () => {
        tempContext.drawImage(image, 0, 0)
        resolve(tempContext.getImageData(0, 0, width, height))
        tempCanvas.remove()
      }
    })
  }

  return {
    activate: function () {
      canvas = document.querySelector('.a-splash--canvas')
      canvasContext = canvas.getContext('2d')

      loadSprites()

      return this
    },
    update: function () {
      // TODO: Clear canvas
      // TODO: Paint sprites

      return this
    },
  }
})()

app.once('activate', () => app.screen.splash.canvas.activate())
