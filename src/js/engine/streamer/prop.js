'use strict'

engine.streamer.prop = {}

engine.streamer.prop.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.streamer.prop.prototype = {
  construct: function ({options, prototype, token}) {
    this.prop = engine.props.create(prototype, options)
    this.token = token
    return this
  },
  cull: function (state = true) {
    this.prop.willCull = true
    return this
  },
  destroy: function () {
    engine.props.destroy(this.prop)
    this.prop = null
    return this
  },
}
