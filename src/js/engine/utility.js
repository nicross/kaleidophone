'use strict'

engine.utility = {}

engine.utility.addInterval = (frequency, interval) => frequency * (2 ** interval)

engine.utility.between = (value, min, max) => value >= min && value <= max

engine.utility.centroid = (points = []) => {
  // NOTE: Returns origin if empty set
  if (!points.length) {
    return {
      x: 0,
      y: 0,
    }
  }

  let xSum = 0,
    ySum = 0

  for (const point of points) {
    xSum += point.x
    ySum += point.y
  }

  return {
    x: xSum / points.length,
    y: ySum / points.length,
  }
}

engine.utility.choose = (options = [], value = 0) => {
  value = engine.utility.clamp(value, 0, 1)

  const index = Math.round(value * (options.length - 1))
  return options[index]
}

engine.utility.chooseSplice = (options = [], value = 0) => {
  // NOTE: Mutates options
  value = engine.utility.clamp(value, 0, 1)

  const index = Math.round(value * (options.length - 1))
  return options.splice(index, 1)[0]
}

engine.utility.chooseWeighted = (options = [], value = 0) => {
  // SEE: https://medium.com/@peterkellyonline/weighted-random-selection-3ff222917eb6
  value = engine.utility.clamp(value, 0, 1)

  const totalWeight = options.reduce((total, option) => {
    return total + option.weight
  }, 0)

  let weight = value * totalWeight

  for (const option of options) {
    weight -= option.weight

    if (weight <= 0) {
      return option
    }
  }
}

engine.utility.clamp = (x, min, max) => {
  if (x > max) {
    return max
  }

  if (x < min) {
    return min
  }

  return x
}

engine.utility.closer = (x, a, b) => {
  return Math.abs(x - a) <= Math.abs(x - b) ? a : b
}

engine.utility.closest = function (x, bag) {
  // TODO: This could be improved with a version for sorted arrays
  return bag.reduce((closest, value) => engine.utility.closer(x, closest, value))
}

engine.utility.createPerlinWithOctaves = (type, seed, octaves = 2) => {
  const compensation = 1 / (1 - (2 ** -octaves)),
    perlins = []

  if (Array.isArray(seed)) {
    seed = seed.join(engine.const.seedSeparator)
  }

  for (let i = 0; i < octaves; i += 1) {
    perlins.push(
      type.create(seed, 'octave', i)
    )
  }

  return {
    perlin: perlins,
    reset: function () {
      for (let perlin of this.perlin) {
        perlin.reset()
      }
      return this
    },
    value: function (...args) {
      let amplitude = 1/2,
        frequency = 1,
        sum = 0

      for (let perlin of this.perlin) {
        sum += perlin.value(...args.map((value) => value * frequency)) * amplitude
        amplitude /= 2
        frequency *= 2
      }

      sum *= compensation

      return sum
    },
  }
}

engine.utility.degreesToRadians = (degrees) => degrees * Math.PI / 180

engine.utility.detune = (f, cents = 0) => f * (2 ** (cents / 1200))

engine.utility.distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

engine.utility.distanceOrigin = (x, y) => Math.sqrt(x ** 2 + y ** 2)

engine.utility.distanceRadius = (x1, y1, x2, y2, radius = 0) => {
  return Math.max(0, engine.utility.distance(x1, y1, x2, y2) - radius)
}

engine.utility.distanceTheta = (x1, y1, x2, y2, theta) => {
  // Is (x1, y1) ahead (positive) or behind (negative) of (x2, y2) facing theta?
  return engine.utility.rotatePoint(x1 - x2, y1 - y2, theta).x
}

engine.utility.distanceToPower = (distance) => {
  // XXX: One is added so all distances yield sensible values
  distance = Math.max(1, distance + 1)

  const distancePower = distance ** -engine.const.distancePower
  let horizonPower = 1

  if (engine.const.distancePowerHorizon) {
    // XXX: One is added because of above
    const distancePowerHorizon = engine.const.streamerRadius + 1
    horizonPower = Math.max(0, distancePowerHorizon - distance) / distancePowerHorizon
    horizonPower **= engine.const.distancePowerHorizonExponent
  }

  return distancePower * horizonPower
}

engine.utility.frequencyToMidi = (frequency) => (Math.log2(frequency / engine.const.midiReferenceFrequency) * 12) + engine.const.midiReferenceNote

engine.utility.fromDb = (value) => 10 ** (value / 10)

engine.utility.hash = (value) => {
  // SEE: https://en.wikipedia.org/wiki/Jenkins_hash_function
  let hash = 0,
    i = value.length

  while (i--) {
    hash += value.charCodeAt(i)
    hash += hash << 10
    hash ^= hash >> 6
  }

  hash += (hash << 3)
  hash ^= (hash >> 11)
  hash += (hash << 15)

	return Math.abs(hash)
}

engine.utility.humanize = (value = 1, amount = 0) => {
  return value + engine.utility.random.float(-amount, amount)
}

engine.utility.humanizeDb = (value = 1, db = 0) => {
  const gain = engine.utility.fromDb(db)
  return value * engine.utility.random.float(1 - gain, 1 + gain)
}

engine.utility.intersects = (a, b) => {
  const between = engine.utility.between

  const xOverlap = between(a.x, b.x, b.x + b.width)
    || between(b.x, a.x, a.x + a.width)

  const yOverlap = between(a.y, b.y, b.y + b.height)
    || between(b.y, a.y, a.y + a.height)

  return xOverlap && yOverlap
}

engine.utility.isWithinRadius = (point = {}, radius = 0) => {
  const {x: dx, y: dy} = engine.utility.subtractRadius(point, radius)
  return dx == 0 && dy == 0
}

engine.utility.lerp = (min, max, value) => (min * (1 - value)) + (max * value)

engine.utility.lerpExp = (min, max, value, power = 2) => {
  return engine.utility.lerp(min, max, value ** power)
}

engine.utility.lerpExpRandom = ([lowMin, lowMax], [highMin, highMax], value, power) => {
  return engine.utility.random.float(
    engine.utility.lerpExp(lowMin, highMin, value, power),
    engine.utility.lerpExp(lowMax, highMax, value, power),
  )
}

engine.utility.lerpLog = (min, max, value, base = 2) => {
  value *= base - 1
  return engine.utility.lerp(min, max, Math.log(1 + value) / Math.log(base))
}

engine.utility.lerpLogRandom = ([lowMin, lowMax], [highMin, highMax], value) => {
  return engine.utility.random.float(
    engine.utility.lerpLog(lowMin, highMin, value),
    engine.utility.lerpLog(lowMax, highMax, value),
  )
}

engine.utility.lerpLogi = (min, max, value, base) => {
  // Equivalent to engine.utility.lerpLog(min, max, value, 1 / base)
  return engine.utility.lerpLog(max, min, 1 - value, base)
}

engine.utility.lerpLogiRandom = ([lowMin, lowMax], [highMin, highMax], value) => {
  return engine.utility.random.float(
    engine.utility.lerpLogi(lowMin, highMin, value),
    engine.utility.lerpLogi(lowMax, highMax, value),
  )
}

engine.utility.lerpRandom = ([lowMin, lowMax], [highMin, highMax], value) => {
  return engine.utility.random.float(
    engine.utility.lerp(lowMin, highMin, value),
    engine.utility.lerp(lowMax, highMax, value),
  )
}

engine.utility.midiToFrequency = (note) => {
  return engine.const.midiReferenceFrequency * Math.pow(2, (note - engine.const.midiReferenceNote) / 12)
}

engine.utility.normalizeAngle = (angle) => {
  const tau = Math.PI * 2

  if (angle > tau) {
    angle %= tau
  } else if (angle < 0) {
    angle %= tau
    angle += tau
  }

  return angle
}

engine.utility.normalizeAngleSigned = (angle) => {
  const tau = 2 * Math.PI

  angle %= tau

  if (angle > Math.PI) {
    angle -= tau
  }

  if (angle < -Math.PI) {
    angle += tau
  }

  return angle
}

engine.utility.quadratic = (a, b, c) => {
  return [
    (-1 * b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a),
    (-1 * b - Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a),
  ]
}

engine.utility.radiansToDegrees = (radians) => radians * 180 / Math.PI

engine.utility.regularPolygonInteriorAngle = (sides) => (sides - 2) * Math.PI / sides

engine.utility.round = (x, precision = 0) => {
  precision = 10 ** precision
  return Math.floor(x * precision) / precision
}

engine.utility.rotatePoint = (x, y, theta) => ({
  x: (x * Math.cos(theta)) + (y * Math.sin(theta)),
  y: (y * Math.cos(theta)) - (x * Math.sin(theta)),
})

engine.utility.scale = (value, min, max, a, b) => ((b - a) * (value - min) / (max - min)) + a

engine.utility.shuffle = (array, random = Math.random) => {
  array = [].slice.call(array)

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

engine.utility.sign = (value) => value >= 0 ? 1 : -1

engine.utility.subtractRadius = ({x = 0, y = 0} = {}, radius = 0) => {
  // SEE: https://math.stackexchange.com/a/1630886
  if (radius == 0) {
    return {
      x,
      y,
    }
  }

  const d = Math.sqrt(x ** 2 + y ** 2)

  if (d <= radius) {
    return {
      x: 0,
      y: 0,
    }
  }

  const t = 1 - (radius / d)

  return {
    x: t * x,
    y: t * y,
  }
}

engine.utility.toCents = (f1, f2) => (f2 - f1) / f1 * 1200

engine.utility.toDb = (value) => 10 * Math.log10(value)

engine.utility.toRelativeCoordinates = (
  {
    angle = 0,
    x: positionX = 0,
    y: positionY = 0,
  } = {},
  {
    radius = 0,
    x: objectX = 0,
    y: objectY = 0,
  } = {}
) => {
  return engine.utility.subtractRadius(
    engine.utility.rotatePoint(
      objectX - positionX,
      objectY - positionY,
      angle
    ),
    radius
  )
}

engine.utility.toSubFrequency = (frequency, sub = engine.const.subFrequency) => {
  while (frequency > sub) {
    frequency /= 2
  }

  while (frequency < engine.const.minFrequency) {
    frequency *= 2
  }

  return frequency
}

engine.utility.wrap = (value, min = 0, max = 1) => {
  // Treats min and max as the same value, e.g. [min, max)
  const range = max - min

  if (value >= max) {
    return min + ((value - min) % range)
  }

  if (value < min) {
    return min + ((value + max) % range)
  }

  return value
}

engine.utility.wrapAlternate = (value, min = 0, max = 1) => {
  // Scales values to an oscillation between [min, max]
  const range = max - min
  const period = range * 2

  if (value > max) {
    value -= min

    if (value % period < range) {
      return min + (value % range)
    }

    return max - (value % range)
  }

  if (value < min) {
    if (Math.abs(value % period) < range) {
      return max - range + Math.abs(value % range)
    }

    return min + range - Math.abs(value % range)
  }

  return value
}

engine.utility.uuid = () => {
  // SEE: https://stackoverflow.com/a/2117523
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
