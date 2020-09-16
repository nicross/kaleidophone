engine.utility.timing = {}

engine.utility.timing.cancelablePromise = (duration) => {
  const scope = {}

  const promise = new Promise((resolve, reject) => {
    scope.reject = reject
    scope.resolve = resolve
  })

  const timeout = setTimeout(scope.resolve, duration)

  promise.cancel = function () {
    scope.reject()
    clearTimeout(timeout)
    return this
  }

  promise.catch(() => {})

  return promise
}

engine.utility.timing.promise = (duration) => new Promise((resolve) => setTimeout(resolve, duration))
