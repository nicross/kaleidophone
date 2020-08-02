// SEE: https://gist.github.com/mjackson/5311256
app.utility.color = {}

app.utility.color.hslToRgb = ({h = 0, s = 0, l = 0} = {}) => {
  let r, g, b

  h = engine.utility.wrap(h)

  if (s) {
    const convert = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = convert(p, q, h + 1/3)
    g = convert(p, q, h)
    b = convert(p, q, h - 1/3)
  } else {
    r = g = b = l
  }

  return {
    r: engine.utility.clamp(Math.floor(r * 256), 0, 255),
    g: engine.utility.clamp(Math.floor(g * 256), 0, 255),
    b: engine.utility.clamp(Math.floor(b * 256), 0, 255),
  }
}

app.utility.color.rgbToHsl = ({r = 0, g = 0, b = 0} = {}) => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)

  let h,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0
  } else {
    const d = max - min

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break

      case g:
        h = (b - r) / d + 2
        break

      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return {h, s, l}
}

app.utility.color.rotateRgb = function (color, amount = 0) {
  if (!amount) {
    return color
  }

  color = this.rgbToHsl(color)
  color.h += amount

  return this.hslToRgb(color)
}
