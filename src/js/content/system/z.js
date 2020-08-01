'use strict'

content.system.z = (() => {
  let z = 0

  return {
    add: function (value) {
      z += Number(value)
      return this
    },
    get: () => z,
    reset: function () {
      return this.set(0)
    },
    set: function (value) {
      z = Number(value)
      return this
    },
  }
})()

engine.state.on('reset', () => content.system.z.reset())
