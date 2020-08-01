'use strict'

engine.props = (() => {
  const archetypes = new Map(),
    pool = new Set()

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
    has: (prop) => pool.has(prop),
    filter: (...args) => [...pool].filter(...args),
    forEach: (...args) => [...pool].forEach(...args),
    get: () => [...pool],
    getPrototype: (key) => archetypes.get(key) || engine.prop.null,
    getRegistered: () => archetypes.entries(),
    map: (...args) => [...pool].map(...args),
    reduce: (...args) => [...pool].reduce(...args),
    register: function (prototype, key = '') {
      archetypes.set(key || prototype.name, prototype)
      return this
    },
    reset: function () {
      [...pool].forEach((prop) => prop.destroy())
      pool.clear()
      return this
    },
    update: function (...args) {
      [...pool].forEach((prop) => prop.update(...args))
      return this
    },
  }
})()

engine.loop.on('frame', ({delta, paused}) => engine.props.update({
  delta,
  movement: engine.movement.get(),
  paused,
  position: engine.position.get(),
}))

engine.state.on('reset', () => engine.props.reset())
