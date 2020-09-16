content.system.frequencies = (() => {
  const chordField = engine.utility.perlin1d.create('frequencies', 'chord'),
    colorField = engine.utility.perlin1d.create('frequencies', 'color'),
    inversionField = engine.utility.perlin1d.create('frequencies', 'inversion'),
    octaveField = engine.utility.perlin1d.create('frequencies', 'octave')

  let chords = [],
    chordScale = 0,
    colorScale = 0,
    inversionScale = 0,
    octaveScale = 0,
    root = 0

  function getChord(z) {
    const value = chordField.value(z / chordScale)

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
    const value = colorField.value(z / colorScale)
    return Math.round(engine.utility.lerp(2, 4, value))
  }

  function getInversion(z) {
    const value = inversionField.value(z / inversionScale)
    return Math.round(engine.utility.lerp(0, 2, value))
  }

  function getOctave(z) {
    const value = octaveField.value(z / octaveScale)
    return Math.round(engine.utility.lerp(2, 4, value))
  }

  function selectChords(srand) {
    const isMajor = srand() > 0.5

    return isMajor
      ? [
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
      : [
          [-9, -5, -2],
          [-5, -2, 2],
          [-4, 0, 3],
          [-2, 2, 5],
          [0, 3, 7],
          [3, 7, 10],
          [7, 10, 14],
          [8, 12, 15],
          [10, 14, 17],
        ]
  }

  function toHarmonicSeries(f, color) {
    const series = []

    for (let i = 1; i <= color; i += 1) {
      series.push(f * i)
    }

    return series
  }

  return {
    get: (z) => {
      const chord = getChord(z),
        color = getColor(z)

      return chord.reduce((fs, f) => [...fs, ...toHarmonicSeries(f, color)], [])
    },
    import: function () {
      const srand = engine.utility.srand('frequencies')

      chords = selectChords(srand)
      root = Math.round(srand(0, 11))

      chordScale = 4 * (2 ** Math.round(srand(1, 4)))
      colorScale = 4 * (2 ** Math.round(srand(1, 4)))
      inversionScale = 4 * (2 ** Math.round(srand(1, 4)))
      octaveScale = 4 * (2 ** Math.round(srand(1, 4)))

      chordField.reset()
      colorField.reset()
      inversionField.reset()
      octaveField.reset()

      return this
    },
    root: () => root,
    sub: (z) => {
      const chord = getChord(z)

      let frequency = chord[0]

      if (frequency < 40) {
        frequency *= 2
      }

      return engine.utility.toSubFrequency(frequency, 80)
    },
  }
})()

engine.state.on('import', () => content.system.frequencies.import())
