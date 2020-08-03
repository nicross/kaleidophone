app.screen.game.canvas = (() => {
  const height = 64,
    patternCanvas = document.createElement('canvas'),
    patternContext = patternCanvas.getContext('2d'),
    patternHeight = 32,
    patternWidth = 32,
    width = 64

  const patternData = patternContext.createImageData(patternWidth, patternHeight)

  let canvas,
    context

  patternCanvas.height = patternHeight
  patternCanvas.width = patternWidth

  function analyze() {
    const ceiling = content.system.stages.ceiling(),
      floor = content.system.stages.floor()

    return [
      ...analyzeStage(floor),
      ...analyzeStage(ceiling),
    ]
  }

  function analyzeStage(stage) {
    if (!stage) {
      return []
    }

    const gain = stage.bus.gain.value,
      maxFrequency = engine.utility.midiToFrequency(24),
      minFrequency = engine.utility.midiToFrequency(96)

    return stage.props.map((prop) => ({
      distance: engine.utility.scale(prop.distance, content.const.stageMinRadius, content.const.stageMinRadius, 1, 0),
      frequency: engine.utility.clamp(engine.utility.scale(prop.synth.param.frequency.value, minFrequency, maxFrequency, 0, 1), 0, 1),
      gain,
    }))
  }

  function paintPattern() {
    const halfHeight = height / 2,
      halfWidth = width / 2,
      turns = 4

    const paste = () => {
      context.drawImage(patternCanvas, 0, 0)
      context.translate(halfWidth, halfWidth)
      context.rotate(2 * Math.PI / turns)
      context.translate(-halfWidth, -halfHeight)
    }

    context.clearRect(0, 0, width, height)

    for (let i = 0; i < turns; i += 1) {
      paste()
    }
  }

  function updatePattern() {
    const analysis = analyze()

    const test = patternContext.createLinearGradient(0, 0, patternWidth, patternHeight)

    test.addColorStop(0, '#FF0000')
    test.addColorStop(0.5, '#FFFF00')
    test.addColorStop(1, '#0000FF')

    patternContext.fillStyle = test
    patternContext.fillRect(0, 0, patternWidth, patternHeight)

    // TODO: Visualize analysis as colored regular polygons within patternCanvas
  }

  return {
    activate: function () {
      canvas = document.querySelector('.a-game--canvas')
      context = canvas.getContext('2d')

      return this
    },
    update: function () {
      updatePattern()
      paintPattern()
      return this
    },
  }
})()

app.once('activate', () => app.screen.game.canvas.activate())
