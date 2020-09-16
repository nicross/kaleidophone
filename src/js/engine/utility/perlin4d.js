engine.utility.perlin4d = {}

engine.utility.perlin4d.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.utility.perlin4d.prototype = {
  construct: function (...seeds) {
    this.gradient = new Map()
    this.seed = seeds.join(engine.const.seedSeparator)
    return this
  },
  generateGradient: function (x, y, z, t) {
    const srand = engine.utility.srand('perlin', this.seed, x, y, z, t)

    if (!this.gradient.has(x)) {
      this.gradient.set(x, new Map())
    }

    const xMap = this.gradient.get(x)

    if (!xMap.has(y)) {
      xMap.set(y, new Map())
    }

    const yMap = xMap.get(y)

    if (!yMap.has(z)) {
      yMap.set(z, new Map())
    }

    yMap.get(z).set(t, [
      srand(-1, 1),
      srand(-1, 1),
      srand(-1, 1),
      srand(-1, 1),
    ])

    return this
  },
  getDotProduct: function (xi, yi, zi, ti, x, y, z, t) {
    const dt = t - ti,
      dx = x - xi,
      dy = y - yi,
      dz = z - zi

    return (dt * this.getGradient(xi, yi, zi, ti, 3)) + (dx * this.getGradient(xi, yi, zi, ti, 0)) + (dy * this.getGradient(xi, yi, zi, ti, 1)) + (dz * this.getGradient(xi, yi, zi, ti, 2))
  },
  getGradient: function (x, y, z, t, i) {
    if (!this.hasGradient(x, y, z, t)) {
      this.generateGradient(x, y, z, t)
      this.requestPrune(x, y, z, t)
    }

    return this.gradient.get(x).get(y).get(z).get(t)[i]
  },
  hasGradient: function (x, y, z, t) {
    const xMap = this.gradient.get(x)

    if (!xMap) {
      return false
    }

    const yMap = xMap.get(y)

    if (!yMap) {
      return false
    }

    const zMap = yMap.get(z)

    if (!zMap) {
      return false
    }

    return zMap.has(t)
  },
  prune: function () {
    this.gradient.forEach((xMap, x) => {
      if (xMap.size >= this.pruneThreshold) {
        return this.gradient.delete(x)
      }

      xMap.forEach((yMap, y) => {
        if (yMap.size >= this.pruneThreshold) {
          return xMap.delete(y)
        }

        yMap.forEach((zMap, z) => {
          if (zMap.size >= this.pruneThreshold) {
            return yMap.delete(z)
          }

          zMap.forEach((tMap, t) => {
            if (tMap.size >= this.pruneThreshold) {
              return zMap.delete(t)
            }
          })
        })
      })
    })

    return this
  },
  pruneThreshold: 10 ** 1,
  requestPrune: function () {
    if (this.pruneRequest) {
      return this
    }

    this.pruneRequest = requestIdleCallback(() => {
      this.prune()
      delete this.pruneRequest
    })

    return this
  },
  range: Math.sqrt(4/4),
  reset: function () {
    if (this.pruneRequest) {
      cancelIdleCallback(this.pruneRequest)
    }

    this.gradient.clear()

    return this
  },
  smooth: function (value) {
    // 6x^5 - 15x^4 + 10x^3
    return (value ** 3) * (value * ((value * 6) - 15) + 10)
  },
  value: function (x, y, z, t) {
    const t0 = Math.floor(t),
      t1 = t0 + 1,
      x0 = Math.floor(x),
      x1 = x0 + 1,
      y0 = Math.floor(y),
      y1 = y0 + 1,
      z0 = Math.floor(z),
      z1 = z0 + 1

    const dt = this.smooth(t - t0),
      dx = this.smooth(x - x0),
      dy = this.smooth(y - y0),
      dz = this.smooth(z - z0)

    const value = engine.utility.lerp(
      engine.utility.lerp(
        engine.utility.lerp(
          engine.utility.lerp(
            this.getDotProduct(x0, y0, z0, t0, x, y, z, t),
            this.getDotProduct(x1, y0, z0, t0, x, y, z, t),
            dx
          ),
          engine.utility.lerp(
            this.getDotProduct(x0, y1, z0, t0, x, y, z, t),
            this.getDotProduct(x1, y1, z0, t0, x, y, z, t),
            dx
          ),
          dy
        ),
        engine.utility.lerp(
          engine.utility.lerp(
            this.getDotProduct(x0, y0, z1, t0, x, y, z, t),
            this.getDotProduct(x1, y0, z1, t0, x, y, z, t),
            dx
          ),
          engine.utility.lerp(
            this.getDotProduct(x0, y1, z1, t0, x, y, z, t),
            this.getDotProduct(x1, y1, z1, t0, x, y, z, t),
            dx
          ),
          dy
        ),
        dz
      ),
      engine.utility.lerp(
        engine.utility.lerp(
          engine.utility.lerp(
            this.getDotProduct(x0, y0, z0, t1, x, y, z, t),
            this.getDotProduct(x1, y0, z0, t1, x, y, z, t),
            dx
          ),
          engine.utility.lerp(
            this.getDotProduct(x0, y1, z0, t1, x, y, z, t),
            this.getDotProduct(x1, y1, z0, t1, x, y, z, t),
            dx
          ),
          dy
        ),
        engine.utility.lerp(
          engine.utility.lerp(
            this.getDotProduct(x0, y0, z1, t1, x, y, z, t),
            this.getDotProduct(x1, y0, z1, t1, x, y, z, t),
            dx
          ),
          engine.utility.lerp(
            this.getDotProduct(x0, y1, z1, t1, x, y, z, t),
            this.getDotProduct(x1, y1, z1, t1, x, y, z, t),
            dx
          ),
          dy
        ),
        dz
      ),
      dt
    )

    return engine.utility.scale(value, -this.range, this.range, 0, 1)
  },
}
