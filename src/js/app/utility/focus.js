app.utility.focus = (() => {
  const focusableSelector = 'button, input, [tabindex="0"]',
    identity = (x) => x,
    notFocusableSelector = '[aria-hidden="true"], [aria-hidden="true"] *, [disabled], [hidden], [hidden] *'

  let lastFocused

  return {
    get: function (parentElement = document.documentElement) {
      return parentElement.querySelector(':focus')
    },
    is: function (element) {
      return element instanceof HTMLElement && element.matches(':focus')
    },
    isFocusable: function (element) {
      return element instanceof HTMLElement && element.matches(focusableSelector) && !element.matches(notFocusableSelector)
    },
    isWithin: function (parentElement) {
      return Boolean(parentElement.querySelector(':focus'))
    },
    onWindowFocus: function () {
      setTimeout(() => {
        if (!this.get() && lastFocused) {
          this.set(lastFocused)
        }
      })

      return this
    },
    onWindowFocusin: function () {
      lastFocused = this.get()
      return this
    },
    release: function (parentElement) {
      parentElement.removeEventListener('keydown', parentElement._utilityFocusTrap)
      delete parentElement._utilityFocusTrap
      return this
    },
    selectFocusable: function (parentElement) {
      if (!(parentElement instanceof HTMLElement)) {
        return []
      }

      return [].slice.apply(
        parentElement.querySelectorAll(focusableSelector)
      ).filter((element) => !element.matches(notFocusableSelector))
    },
    selectNextFocusable: function (parentElement, filter = identity) {
      const elements = this.selectFocusable(parentElement)

      const startIndex = elements.indexOf(
        this.get(parentElement)
      )

      let index = startIndex

      do {
        index += 1

        if (index >= elements.length) {
          index = 0
        }

        const element = elements[index]

        if (filter(element)) {
          return element
        }
      } while (index != startIndex)
    },
    selectPreviousFocusable: function (parentElement, filter = identity) {
      const elements = this.selectFocusable(parentElement)

      const startIndex = elements.indexOf(
        this.get(parentElement)
      )

      let index = startIndex

      do {
        index -= 1

        if (index < 0) {
          index = elements.length - 1
        }

        const element = elements[index]

        if (filter(element)) {
          return element
        }
      } while (index != startIndex)
    },
    set: function (element) {
      if (element instanceof HTMLElement) {
        element.focus()
      }
      return this
    },
    setNextFocusable: function (...args) {
      return this.set(
        this.selectNextFocusable(...args)
      )
    },
    setPreviousFocusable: function (...args) {
      return this.set(
        this.selectPreviousFocusable(...args)
      )
    },
    setWithin: function (parentElement) {
      return this.set(
        this.selectFocusable(parentElement)[0]
      )
    },
    trap: function (parentElement) {
      parentElement._utilityFocusTrap = (e) => {
        if (e.keyCode != 9) {
          return
        }

        const elements = this.selectFocusable(parentElement),
          first = elements[0],
          last = elements[elements.length - 1],
          shiftKey = e.shiftKey,
          target = e.target

        const isFirst = target == first,
          isLast = target == last

        if (isFirst && isLast) {
          e.preventDefault()
          e.stopPropagation()
          return
        }

        if (!isFirst && !isLast) {
          return
        }

        if (isFirst && !shiftKey) {
          return
        }

        if (isLast && shiftKey) {
          return
        }

        e.preventDefault()
        e.stopPropagation()

        this.set(isFirst ? last : first)
      }

      parentElement.addEventListener('keydown', parentElement._utilityFocusTrap)

      return this
    },
  }
})()

window.addEventListener('focus', () => app.utility.focus.onWindowFocus())
window.addEventListener('focusin', () => app.utility.focus.onWindowFocusin())
