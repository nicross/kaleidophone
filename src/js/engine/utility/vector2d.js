engine.utility.vector2d = {}

engine.utility.vector2d.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.utility.vector2d.prototype = {
  add: function ({
    x = 0,
    y = 0,
  } = {}) {
    return engine.utility.vector2d.create({
      x: this.x + x,
      y: this.y + y,
    })
  },
  angle: function () {
    return Math.atan2(this.y, this.x)
  },
  angleTo: function (vector, angle = 0) {
    let relative = engine.utility.vector2d.prototype.isPrototypeOf(vector)
      ? vector
      : engine.utility.vector2d.create(vector)

    relative = relative.subtract(this)

    if (angle) {
      relative = relative.rotate(angle)
    }

    return relative.angle()
  },
  clone: function () {
    return engine.utility.vector2d.create(this)
  },
  construct: function ({
    x = 0,
    y = 0,
  } = {}) {
    this.x = x
    this.y = y
    return this
  },
  crossProduct: function ({
    x = 0,
    y = 0,
  } = {}) {
    return (this.x * y) - (this.y * x)
  },
  distance: function ({
    x = 0,
    y = 0,
  } = {}) {
    return Math.sqrt(((this.x - x) ** 2) + ((this.y - y) ** 2))
  },
  distance2: function ({
    x = 0,
    y = 0,
  } = {}) {
    return ((this.x - x) ** 2) + ((this.y - y) ** 2)
  },
  dotProduct: function ({
    x = 0,
    y = 0,
  } = {}) {
    return (this.x * x) + (this.y * y)
  },
  equals: function ({
    x = 0,
    y = 0,
  } = {}) {
    return (this.x == x) && (this.y == y)
  },
  isZero: function () {
    return !this.x && !this.y
  },
  normalize: function () {
    return this.divide(this.distance())
  },
  rotate: function (angle = 0) {
    const cos = Math.cos(angle),
      sin = Math.sin(angle)

    return engine.utility.vector2d.create({
      x: (this.x * cos) - (this.y * sin),
      y: (this.y * cos) + (this.x * sin),
    })
  },
  scale: function (scalar = 0) {
    return engine.utility.vector2d.create({
      x: this.x * scalar,
      y: this.y * scalar,
    })
  },
  set: function ({
    x = 0,
    y = 0,
  } = {}) {
    this.x = x
    this.y = y
    return this
  },
  subtract: function ({
    x = 0,
    y = 0,
  } = {}) {
    return engine.utility.vector2d.create({
      x: this.x - x,
      y: this.y - y,
    })
  },
  subtractRadius: function (radius = 0) {
    if (radius <= 0) {
      return engine.utility.vector2d.create(this)
    }

    const distance = this.distance()

    if (radius >= distance) {
      return engine.utility.vector2d.create()
    }

    return this.multiply(1 - (radius / distance))
  },
}

engine.utility.vector2d.unitX = function () {
  return Object.create(this.prototype).construct({
    x: 1,
  })
}

engine.utility.vector2d.unitY = function () {
  return Object.create(this.prototype).construct({
    y: 1,
  })
}
