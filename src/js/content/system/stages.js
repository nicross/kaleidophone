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

      const ceilingZ = zi + 1,
        floorZ = zi

      if (!ceiling) {
        ceiling = content.system.stages.stage.create(ceilingZ)
      }

      if (!floor) {
        floor = content.system.stages.stage.create(floorZ)
      }

      if (ceiling.z < ceilingZ) {
        floor.destroy()
        floor = ceiling
        ceiling = content.system.stages.stage.create(ceilingZ)
      }

      if (floor.z > floorZ) {
        ceiling.destroy()
        ceiling = floor
        floor = content.system.stages.stage.create(floorZ)
      }

      mix = engine.utility.scale(z, floorZ, ceilingZ, 0, 1)

      ceiling.setMix(mix)
      floor.setMix(1 - mix)

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.system.stages.update()
})

engine.state.on('reset', () => content.system.stages.reset())
