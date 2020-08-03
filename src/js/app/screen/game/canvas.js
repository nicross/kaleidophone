app.screen.game.canvas = (() => {
  const height = 64,
    patternCanvas = document.createElement('canvas'),
    patternContext = patternCanvas.getContext('2d'),
    patternHeight = 32,
    patternWidth = 32,
    width = 64

  const patternHypotnuse = Math.sqrt(patternHeight ** 2 + patternWidth ** 2) / 2

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

    const gain = stage.gain,
      maxFrequency = engine.utility.midiToFrequency(24),
      minFrequency = engine.utility.midiToFrequency(96),
      position = engine.position.get()

    return stage.props.map((prop, index) => ({
      angle: Math.sin(prop.atan2 - position.angle),
      distance: engine.utility.scale(prop.distance, content.const.stageMinRadius, content.const.stageMaxRadius, 1, 0),
      frequency: engine.utility.clamp(engine.utility.scale(prop.synth.param.frequency.value, minFrequency, maxFrequency, 0, 1) ** 2, 0, 1),
      gain,
      index,
      z: stage.z,
    }))
  }

  function paintPattern() {
    const halfHeight = height / 2,
      halfWidth = width / 2

    context.clearRect(0, 0, width, height)

    // 1
    context.drawImage(patternCanvas, 0, 0)
    context.translate(halfWidth, halfWidth)

    // 2
    context.rotate(2 * Math.PI / 2)
    context.scale(-1, 1)
    context.drawImage(patternCanvas, -halfWidth, -halfHeight)
    context.scale(-1, 1)
    context.rotate(-2 * Math.PI / 4)

    // 3
    context.rotate(2 * Math.PI / 4)
    context.drawImage(patternCanvas, -halfWidth, -halfHeight)

    // 4
    context.rotate(2 * Math.PI / 2)
    context.scale(-1, 1)
    context.drawImage(patternCanvas, -halfWidth, -halfHeight)
    context.scale(-1, 1)
    context.rotate(-2 * Math.PI / 4)

    // Reset
    context.rotate(2 * Math.PI / 4)
    context.translate(-halfWidth, -halfHeight)
  }

  function updatePattern() {
    const analysis = analyze()

    const calculate = (distance, angle, size) => {
      let x = Math.round(distance * patternWidth),
        y = Math.round(distance * patternHeight)

      const d = Math.sqrt(x ** 2 + y ** 2),
        halfSize = size / 2,
        ratio = engine.utility.wrapAlternate(d, 0, patternHypotnuse) / patternHypotnuse

      y -= angle * patternHypotnuse * ratio
      x += angle * patternHypotnuse * ratio

      x -= halfSize
      y -= halfSize

      x = engine.utility.clamp(x, -halfSize, patternWidth - halfSize)
      y = engine.utility.clamp(y, -halfSize, patternHeight - halfSize)

      return {
        x,
        y,
      }
    }

    patternContext.clearRect(0, 0, patternWidth, patternHeight)

    for (const prop of analysis) {
      patternContext.fillStyle = `hsla(${prop.frequency * 360}, 100%, 50%, ${prop.gain})`

      const size = Math.abs(prop.index - content.const.stagePropCount)
      const {x, y} = calculate(prop.distance, prop.angle, size)

      patternContext.fillRect(x, y, size, size)
    }
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
