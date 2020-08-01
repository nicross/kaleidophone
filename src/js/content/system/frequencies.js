'use strict'

content.system.frequencies = (() => {
  const chords = [
    [-8, -5, -1],
    [-7, -3, 0],
    [-5, -1, 2],
    [-3, 0, 4],
    [0, 4, 7],
    [4, 7, 11],
    [5, 9, 12],
    [7, 11, 14],
    [9, 12, 16],
  ]

  const chordField = engine.utility.perlin1d.create('frequencies', 'chord'),
    colorField = engine.utility.perlin1d.create('frequencies', 'color'),
    inversionField = engine.utility.perlin1d.create('frequencies', 'inversion'),
    octaveField = engine.utility.perlin1d.create('frequencies', 'octave')

  let root = 0

  function getChord(z) {
    const value = chordField.value(z / content.const.frequenciesChordScale)

    const chord = engine.utility.choose(chords, value),
      inversion = getInversion(z),
      octave = getOctave(z)

    return chord.map((note, index) => {
      note += root + (octave * 12)

      if (index < inversion) {
        note += 12
      }

      return engine.utility.midiToFrequency(note)
    })
  }

  function getColor(z) {
    const value = colorField.value(z / content.const.frequenciesColorScale)
    return Math.round(engine.utility.lerp(2, 4, value))
  }

  function getInversion(z) {
    const value = inversionField.value(z / content.const.frequenciesInversionScale)
    return Math.round(engine.utility.lerp(0, 2, value))
  }

  function getOctave(z) {
    const value = octaveField.value(z / content.const.frequenciesOctaveScale)
    return Math.round(engine.utility.lerp(2, 4, value))
  }

  function toHarmonicSeries(f, color) {
    const series = []

    for (let i = 1; i <= color; i += 1) {
      series.push(f * i)
    }

    return series
  }

  return {
    get: function (z) {
      const chord = getChord(z),
        color = getColor(z)

      return chord.reduce((fs, f) => [...fs, ...toHarmonicSeries(f, color)], [])
    },
    import: function () {
      const srand = engine.utility.srand('frequencies')

      root = Math.round(srand(0, 11))

      chordField.reset()
      colorField.reset()
      inversionField.reset()
      octaveField.reset()

      return this
    },
    inspect: (z) => ({
      color: getColor(z),
      inversion: getInversion(z),
      octave: getOctave(z),
    }),
  }
})()

engine.state.on('import', () => content.system.frequencies.import())
