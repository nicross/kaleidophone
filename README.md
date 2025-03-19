# Kaleidophone
A relaxing generative audio toy submitted to [LOWREZJAM 2020](https://itch.io/jam/lowrezjam-2020) and [Brackeys Jam 2020.2](https://itch.io/jam/brackeys-4).
Developed with [syngen](https://github.com/nicross/syngen).

## How to play
Interact to begin.
Move forward and backward to scrub through time.
Turn to pan and calibrate its kaleidoscopic visualizer.
Play and rewind at adjustable speeds.
Randomize at any time to hear something new.

## Development
To get started, please  use [npm](https://nodejs.org) to install the required dependencies:
```sh
npm install
```

### Common tasks
Common tasks have been automated with [Gulp](https://gulpjs.com):

#### Build once
```sh
npx gulp build
```

#### Build continuously
```sh
npx gulp watch
```

#### Create distributables
```sh
npx gulp dist
```

#### Open in Electron
```sh
npx gulp electron
```

#### Build and open in Electron
```sh
npx ulp electron-build
```

#### Command line flags
| Flag | Description |
| - | - |
| `--debug` | Suppresses minification. |
