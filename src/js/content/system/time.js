content.system.time = (() => {
  let time = 0

  return {
    add: function (value) {
      time += Number(value)
      return this
    },
    get: () => time,
    reset: function () {
      return this.set(0)
    },
    set: function (value) {
      time = Number(value)
      return this
    },
  }
})()

engine.state.on('reset', () => content.system.time.reset())
