engine.seed = (() => {
  let seed

  return {
    get: () => seed,
    set: function (value) {
      seed = value
      return this
    },
    valueOf: () => seed,
  }
})()

engine.state.on('export', (data = {}) => data.seed = engine.seed.get())
engine.state.on('import', (data = {}) => engine.seed.set(data.seed))
engine.state.on('reset', () => engine.seed.set())
