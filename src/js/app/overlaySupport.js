engine.ready(() => {
  const canvas = document.querySelector('.a-app--overlaySupport'),
    context = canvas.getContext('2d')

  canvas.height = 1
  canvas.width = 1

  engine.loop.on('frame', () => context.clearRect(0, 0, 1, 1))
})
