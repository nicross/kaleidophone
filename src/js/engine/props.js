engine.props = (() => {
  const pool = new Set()

  return {
    add: function (...props) {
      for (const prop of props) {
        pool.add(prop)
      }

      return this
    },
    create: function (prototype, options) {
      const prop = Object.create(prototype).construct(options)
      pool.add(prop)
      return prop
    },
    destroy: function (...props) {
      for (const prop of props) {
        if (prop.destroy) {
          prop.destroy()
        }

        pool.delete(prop)
      }

      return this
    },
    get: () => [...pool],
    reset: function () {
      pool.forEach((prop) => prop.destroy())
      pool.clear()
      return this
    },
    update: function ({delta, paused}) {
      pool.forEach((prop) => prop.update({delta, paused}))
      return this
    },
  }
})()

engine.loop.on('frame', (e) => engine.props.update(e))
engine.state.on('reset', () => engine.props.reset())
