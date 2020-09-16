engine.performance = (() => {
  const deltas = [],
    maxFrames = 30

  let index = 0,
    medianDelta = 0,
    medianFps = 0

  return {
    delta: () => medianDelta,
    fps: () => medianFps,
    update: function ({delta}) {
      deltas[index] = delta

      if (index < maxFrames - 1) {
        index += 1
      } else {
        index = 0
      }

      const sortedDeltas = deltas.slice().sort()

      medianDelta = engine.utility.choose(sortedDeltas, 0.5)
      medianFps = 1 / medianDelta

      return this
    },
  }
})()

engine.loop.on('frame', (e) => engine.performance.update(e))
