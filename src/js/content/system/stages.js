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
      const t = content.system.time.get(),
        ti = Math.floor(t)

      const ceilingT = ti + 1,
        floorT = ti

      if (!ceiling) {
        ceiling = content.system.stages.stage.create(ceilingT)
      }

      if (!floor) {
        floor = content.system.stages.stage.create(floorT)
      }

      if (ceiling.t < ceilingT) {
        floor.destroy()
        floor = ceiling
        ceiling = content.system.stages.stage.create(ceilingT)
      }

      if (floor.t > floorT) {
        ceiling.destroy()
        ceiling = floor
        floor = content.system.stages.stage.create(floorT)
      }

      mix = engine.utility.scale(t, floorT, ceilingT, 0, 1)

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
