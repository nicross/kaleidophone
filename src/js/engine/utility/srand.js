'use strict'

// SEE: https://stackoverflow.com/a/47593316
// SEE: https://github.com/micro-js/srand
// SEE: https://en.wikipedia.org/wiki/Linear_congruential_generator
engine.utility.srand = (...seeds) => {
  const increment = 1,
    modulus = 34359738337,
    multiplier = 185852,
    rotate = (seed) => ((seed * multiplier) + increment) % modulus

  let seed = engine.utility.hash(
    [
      engine.const.seed,
      ...seeds,
    ].join(engine.const.seedSeparator)
  )

  seed = rotate(seed)

  return (min = 0, max = 1) => {
    seed = rotate(seed)
    return min + ((seed / modulus) * (max - min))
  }
}
