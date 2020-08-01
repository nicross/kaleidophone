'use strict'

content.system.frequencies = (() => {
  // TODO: Perlins

  return {
    get: function (z) {
      // TODO: Resolve frequencies from perlins at z

      return [
        110,
        165,
        220,
        330,
        440,
        660,
      ]
    },
    reset: function () {
      // TODO: Reset perlins
    },
  }
})()

engine.state.on('reset', () => content.system.frequencies.reset())
