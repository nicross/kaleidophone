'use strict'

engine.audio.binaural = {}

engine.audio.binaural.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.audio.binaural.prototype = {
  construct: function () {
    const context = engine.audio.context()

    this.left = engine.audio.binaural.monaural.create({
      pan: -1,
    })

    this.right = engine.audio.binaural.monaural.create({
      pan: 1,
    })

    this.merger = context.createChannelMerger()
    this.left.to(this.merger, 0, 0)
    this.right.to(this.merger, 0, 1)

    return this
  },
  destroy: function () {
    this.left.destroy()
    this.right.destroy()
    this.merger.disconnect()
    return this
  },
  from: function (input) {
    this.left.from(input)
    this.right.from(input)
    return this
  },
  to: function (output) {
    this.merger.connect(output)
    return this
  },
  update: function (...args) {
    this.left.update(...args)
    this.right.update(...args)
    return this
  },
}
