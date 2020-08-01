'use strict'

engine.state = engine.utility.pubsub.decorate({
  export: function () {
    const data = {
      seed: engine.const.seed,
    }

    this.emit('export', data)

    return data
  },
  import: function (data = {}) {
    engine.const.seed = data.seed

    this.reset()
    this.emit('import', data)

    return this
  },
  reset: function () {
    this.emit('reset')
    return this
  }
})
