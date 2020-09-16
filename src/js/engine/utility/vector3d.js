engine.utility.vector3d = {}

engine.utility.vector3d.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.utility.vector3d.prototype = {
  add: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return engine.utility.vector3d.create({
      x: this.x + x,
      y: this.y + y,
      z: this.z + z,
    })
  },
  clone: function () {
    return engine.utility.vector3d.create(this)
  },
  construct: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    this.x = x
    this.y = y
    this.z = z
    return this
  },
  crossProduct: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return engine.utility.vector3d.create({
      x: (this.y * z) - (this.z * y),
      y: (this.z * x) - (this.x * z),
      z: (this.x * y) - (this.y * x),
    })
  },
  distance: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return Math.sqrt(((this.x - x) ** 2) + ((this.y - y) ** 2) + ((this.z - z) ** 2))
  },
  distance2: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return ((this.x - x) ** 2) + ((this.y - y) ** 2) + ((this.z - z) ** 2)
  },
  dotProduct: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return (this.x * x) + (this.y * y) + (this.z * z)
  },
  euler: function () {
    return engine.utility.euler.create({
      pitch: this.z ? Math.atan2(this.z, Math.sqrt((this.x ** 2) + (this.y ** 2))) : 0,
      roll: 0,
      yaw: Math.atan2(this.y, this.x),
    })
  },
  eulerTo: function (vector, euler = undefined) {
    let relative = engine.utility.vector3d.prototype.isPrototypeOf(vector)
      ? vector
      : engine.utility.vector3d.create(vector)

    relative = relative.subtract(this)

    if (euler) {
      relative = relative.rotateEuler(euler)
    }

    return relative.euler()
  },
  equals: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return (this.x == x) && (this.y == y) && (this.z == z)
  },
  isZero: function () {
    return !this.x && !this.y && !this.z
  },
  normalize: function () {
    return this.divide(this.distance())
  },
  rotateEuler: function (euler, sequence) {
    return this.rotateQuaternion(
      engine.utility.quaternion.fromEuler(euler, sequence)
    )
  },
  rotateQuaternion: function (quaternion) {
    if (!engine.utility.quaternion.prototype.isPrototypeOf(quaternion)) {
      quaternion = engine.utility.quaternion.create(quaternion)
    }

    if (quaternion.isZero()) {
      return this.clone()
    }

    return engine.utility.vector3d.create(
      quaternion.multiply(
        engine.utility.quaternion.create(this)
      ).multiply(
        quaternion.inverse()
      )
    )
  },
  scale: function (scalar = 0) {
    return engine.utility.vector3d.create({
      x: this.x * scalar,
      y: this.y * scalar,
      z: this.z * scalar,
    })
  },
  set: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    this.x = x
    this.y = y
    this.z = z
    return this
  },
  subtract: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return engine.utility.vector3d.create({
      x: this.x - x,
      y: this.y - y,
      z: this.z - z,
    })
  },
  subtractRadius: function (radius = 0) {
    if (radius <= 0) {
      return engine.utility.vector3d.create(this)
    }

    const distance = this.distance()

    if (radius >= distance) {
      return engine.utility.vector3d.create()
    }

    return this.scale(1 - (radius / distance))
  },
}

engine.utility.vector3d.unitX = function () {
  return Object.create(this.prototype).construct({
    x: 1,
  })
}

engine.utility.vector3d.unitY = function () {
  return Object.create(this.prototype).construct({
    y: 1,
  })
}

engine.utility.vector3d.unitZ = function () {
  return Object.create(this.prototype).construct({
    z: 1,
  })
}
