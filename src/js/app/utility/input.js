app.utility.input = {
  preventControls: function (input) {
    const codes = ['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'KeyA', 'KeyD', 'KeyS', 'KeyW', 'NumpadDecimal', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad8']

    const listener = (e) => {
      if (codes.includes(e.code)) {
        e.stopPropagation()
      }
    }

    input.addEventListener('keydown', listener)

    return this
  },
  preventScrolling: function (element) {
    const codes = ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp']

    const listener = (e) => {
      if (codes.includes(e.code)) {
        e.preventDefault()
      }
    }

    element.addEventListener('keydown', listener)

    return this
  },
  selectOnFocus: function (input) {
    input.addEventListener('focus', () => input.select())
    return this
  },
}
