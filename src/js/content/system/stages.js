'use strict'

content.system.stages = (() => {
  let ceiling,
    floor,
    mix = 0

  return {
    ceiling: () => ceiling,
    floor: () => floor,
    reset: function () {
      if (ceiling) {
        ceiling.destroy()
      }

      if (floor) {
        floor.destroy()
      }

      ceiling = null
      floor = null

      return this
    },
    update: function () {
      const z = content.system.z.get(),
        zi = Math.floor(z)

      if (!ceiling) {
        ceiling = content.system.stages.stage.create(zi + 1)
      }

      if (!floor) {
        floor = content.system.stages.stage.create(zi)
      }

      if (z > ceiling.z) {
        floor.destroy()
        floor = ceiling
        ceiling = content.system.stages.stage.create(zi + 1)
      } else if (z < floor.z) {
        ceiling.destroy()
        ceiling = floor
        floor = content.system.stages.stage.create(zi - 1)
      }

      mix = engine.utility.scale(z, zi, zi + 1, 0, 1)

      ceiling.setMix(mix)
      floor.setMix(1 - mix)

      return this
    },
  }
})()

engine.loop.on('frame', () => content.system.stages.update())
engine.state.on('reset', () => content.system.stages.reset())
