app.screen.game.canvas = (() => {
  const height = 64,
    patternCanvas = document.createElement('canvas'),
    patternContext = patternCanvas.getContext('2d'),
    patternHeight = 44,
    patternWidth = 44,
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
    context.clearRect(0, 0, width, height)

    // TODO: Scale and rotations

    paintPatternPolygon({
      points: [
        {x: 32, y: 31},
        {x: 0, y: 31},
        {x: 0, y: 0},
      ],
      rotate: 0,
      scaleX: 0,
      scaleY: 0,
    })

    paintPatternPolygon({
      points: [
        {x: 32, y: 31},
        {x: 0, y: 0},
        {x: 32, y: 0},
      ],
      rotate: 0,
      scaleX: 0,
      scaleY: 0,
    })

    paintPatternPolygon({
      points: [
        {x: 32, y: 31},
        {x: 32, y: 0},
        {x: 63, y: 0},
      ],
      rotate: 0,
      scaleX: 0,
      scaleY: 0,
    })

    paintPatternPolygon({
      points: [
        {x: 32, y: 31},
        {x: 63, y: 0},
        {x: 63, y: 31},
      ],
      rotate: 0,
      scaleX: 0,
      scaleY: 0,
    })

    paintPatternPolygon({
      points: [
        {x: 32, y: 31},
        {x: 63, y: 31},
        {x: 63, y: 62},
      ],
      rotate: 0,
      scaleX: 0,
      scaleY: 0,
    })

    paintPatternPolygon({
      points: [
        {x: 32, y: 31},
        {x: 63, y: 62},
        {x: 32, y: 63},
      ],
      rotate: 0,
      scaleX: 0,
      scaleY: 0,
    })

    paintPatternPolygon({
      points: [
        {x: 32, y: 31},
        {x: 32, y: 63},
        {x: 0, y: 63},
      ],
      rotate: 0,
      scaleX: 0,
      scaleY: 0,
    })

    paintPatternPolygon({
      points: [
        {x: 32, y: 31},
        {x: 0, y: 63},
        {x: 0, y: 31},
      ],
      rotate: 0,
      scaleX: 0,
      scaleY: 0,
    })
  }

  function paintPatternPolygon({
    points = [],
    rotate = 0,
    scaleX = 1,
    scaleY = 1,
  } = {}) {
    patternContext.save()

    patternContext.rotate(rotate)
    patternContext.scale(scaleX, scaleY)

    const pattern = context.createPattern(patternCanvas, 'no-repeat')

    context.fillStyle = pattern

    context.beginPath()
    context.moveTo(points[0].x, points[0].y)

    for (const point of points) {
      context.lineTo(point.x, point.y)
    }

    context.lineTo(points[0].x, points[0].y)
    context.fill()

    patternContext.restore()
  }

  function updatePattern(analysis) {
    patternContext.clearRect(0, 0, patternWidth, patternHeight)

    // TODO: Visualize analysis as colored regular polygons within patternCanvas
  }

  return {
    activate: function () {
      canvas = document.querySelector('.a-game--canvas')
      context = canvas.getContext('2d')

      return this
    },
    update: function () {
      const analysis = analyze()

      updatePattern(analysis)
      paintPattern()

      return this
    },
  }
})()

app.once('activate', () => app.screen.game.canvas.activate())
