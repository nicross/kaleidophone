app.screen.splash = (() => {
  let root

  engine.ready(() => {
    root = document.querySelector('.a-splash')
    root.addEventListener('click', onInteract)

    app.utility.focus.trap(root)

    app.state.screen.on('enter-splash', onEnter)
    app.state.screen.on('exit-splash', onExit)
  })

  function onEnter() {
    app.utility.focus.set(root)
    engine.loop.on('frame', onFrame)
  }

  function onExit() {
    engine.loop.off('frame', onFrame)
  }

  function onFrame(e) {
    const controls = app.controls.ui()

    if (controls.confirm || controls.enter || controls.space || controls.start) {
      onInteract()
    }

    app.screen.splash.canvas.update(e)
  }

  function onInteract() {
    app.state.screen.dispatch('start')
  }

  return {}
})()
