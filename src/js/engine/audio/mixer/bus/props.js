'use strict'

engine.audio.mixer.bus.props = (() => {
  const bus = engine.audio.mixer.createBus()
  return () => bus
})()
