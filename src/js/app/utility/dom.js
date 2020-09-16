app.utility.dom = {
  closest: function (element, selector) {
    if (element instanceof Element) {
      do {
        if (element.matches(selector)) {
          return element
        }
      } while (element = element.parentElement)
    }
  },
  contains: (parentElement, element) => {
    if (element instanceof Element) {
      do {
        if (element === parentElement) {
          return true
        }
      } while (element = element.parentNode)
    }
    return false
  },
  generateUniqueId: ({length = 16, prefix = ''} = {}) => {
    const chars = 'adcdefghijklmnopqrstuvwxyz0123456789'

    let id

    do {
      id = prefix
      for (let i = 0; i < length; i += 1) {
        id += chars[Math.floor(Math.random() * chars.length)]
      }
    } while (document.getElementById(id))

    return id
  },
  removeChildren: function (element) {
    if (element instanceof Node) {
      while (element.firstChild) {
        element.firstChild.remove()
      }
    }
    return this
  },
}
