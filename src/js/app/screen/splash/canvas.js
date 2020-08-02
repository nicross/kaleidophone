app.screen.splash.canvas = (() => {
  const interactFrequency = 1/2,
    height = 64,
    width = 64

  let canvas,
    context,
    interactSprite,
    logoSprite

  function cloneImageData(imageData) {
    return new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    )
  }

  function loadSprites() {
    loadSprite('./img/splash/interact.png', 31, 3).then((imageData) => {
      interactSprite = imageData
    })

    loadSprite('./img/splash/logo.png', 54, 26).then((imageData) => {
      logoSprite = imageData
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

  function paintInteractSprite(frame) {
    const opacity = 0.5 + Math.abs(Math.sin(interactFrequency * Math.PI * frame / 60) / 2),
      sprite = cloneImageData(interactSprite)

    const data = sprite.data

    for (let i = 3; i < data.length; i += 4) {
      data[i] = Math.round(opacity * 255)
    }

    context.putImageData(sprite, 16, 53)
  }

  function paintLogoSprite(frame) {
    const sprite = cloneImageData(logoSprite)
    context.putImageData(sprite, 5, 13)
  }

  return {
    activate: function () {
      canvas = document.querySelector('.a-splash--canvas')
      context = canvas.getContext('2d')

      loadSprites()

      return this
    },
    update: function ({frame}) {
      context.clearRect(0, 0, width, height)

      if (interactSprite) {
        paintInteractSprite(frame)
      }

      if (logoSprite) {
        paintLogoSprite(frame)
      }

      return this
    },
  }
})()

app.once('activate', () => app.screen.splash.canvas.activate())
