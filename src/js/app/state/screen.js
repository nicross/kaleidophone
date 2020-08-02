app.state.screen = engine.utility.machine.create({
  state: 'none',
  transition: {
    game: {},
    none: {
      activate: function () {
        this.change('splash')
      },
    },
    splash: {
      start: function () {
        this.change('game')
      },
    },
  },
})

app.once('activate', () => {
  [...document.querySelectorAll('.a-app--screen')].forEach((element) => {
    element.setAttribute('aria-hidden', 'true')
    element.setAttribute('role', 'persentation')
  })

  app.state.screen.dispatch('activate')
})

app.state.screen.on('exit', (e) => {
  const active = document.querySelector('.a-app--screen-active')
  const inactive = document.querySelector('.a-app--screen-inactive')

  if (active) {
    active.classList.remove('a-app--screen-active')
    active.classList.add('a-app--screen-inactive')
    active.setAttribute('aria-hidden', 'true')
    active.setAttribute('role', 'persentation')
  }

  if (inactive) {
    inactive.classList.remove('a-app--screen-inactive')
    inactive.hidden = true
  }
})

app.state.screen.on('enter', (e) => {
  const selectors = {
    game: '.a-app--game',
    splash: '.a-app--splash',
  }

  const selector = selectors[e.currentState]
  const element = document.querySelector(selector)

  element.classList.add('a-app--screen-active')
  element.removeAttribute('aria-hidden')
  element.removeAttribute('role')
  element.removeAttribute('hidden')
})
