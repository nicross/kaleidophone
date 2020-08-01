'use strict'

engine.audio = (() => {
  const context = new AudioContext({
    latencyHint: engine.const.audioLatencyHint,
  })

  return {
    buffer: {
      impulse: {},
      noise: {},
    },
    context: () => context,
    nyquist: (multiple = 1) => multiple * context.sampleRate / 2,
    send: {},
    start: function () {
      context.resume()
      return this
    },
    time: (duration = 0) => context.currentTime + engine.const.audioLookaheadTime + duration,
    zeroTime: () => context.currentTime + engine.const.audioLookaheadTime + engine.const.zeroTime,
  }
})()
