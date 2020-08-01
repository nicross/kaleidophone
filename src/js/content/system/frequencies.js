'use strict'

content.system.frequencies = (() => {
  // TODO: Perlins
  // TODO: Root

  function getChord(z) {
    // TODO: Query perlin: chord type, chord inversion, chord octave
    return [
      110,
      165,
    ]
  }

  function getColor(z) {
    // TODO: Query perlin
    return 6
  }

  function toHarmonicSeries(f, color) {
    const fs = []

    for (let i = 1; i <= color; i += 1) {
      fs.push(f * i)
    }

    return fs
  }

  return {
    get: function (z) {
      const chord = getChord(z),
        color = getColor(z)

      return chord.reduce((fs, f) => [...fs, ...toHarmonicSeries(f, color)], [])
    },
    import: function () {
      // TODO: Reset perlins
      // TODO: Derive root from key
      return this
    },
  }
})()

engine.state.on('import', () => content.system.frequencies.import())
