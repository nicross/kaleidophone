# Kaleidophone
A relaxing generative audio toy submitted to [LOWREZJAM 2020](https://itch.io/jam/lowrezjam-2020) and [Brackeys Jam 2020.2](https://itch.io/jam/brackeys-4).
Developed with [syngen](https://github.com/nicross/syngen).

## How to play
Explore ambient soundscapes by manipulating time.
Rewind, scrub, freeze, or adjust playback speed.
Enjoy unique songs each play.

Interact to begin.
Move forward and backward to scrub through time.
Turn to pan and adjust the kaleidoscopic visualizer.
Play and rewind at various speeds.
Randomize the song at any time.

### Keyboard controls
| Action | Key 1 | Key 2 | Key 3 |
| - | - | - | - |
| Play | E | Page Up | Numpad 9 |
| Rewind | Q | Page Down | Numpad 7 |
| Increase Speed | = | | Numpad + |
| Decrease Speed | - | | Numpad - |
| Set Speed | 0–9 | | |
| Scrub Forward | W | Up Arrow | Numpad 8 |
| Scrub Backward | S | Down Arrow | Numpad 5 |
| Turn Left | A | Left Arrow | Numpad 4 |
| Turn Right | D | Right Arrow | Numpad 6 |
| Toggle Rotation | F | End | Numpad 0 |
| Randomize Seed | R | Home | Numpad * |

### Gamepad controls
| Action | Button 1 | Button 2 |
| - | - | - |
| Play | D-Pad Right | Right Bumper |
| Rewind | D-Pad Left | Left Bumper |
| Increase Speed | D-Pad Up | |
| Decrease Speed | D-Pad Down | |
| Scrub Forward | Right Trigger | |
| Scrub Backward | Left Trigger | |
| Turning | Right Stick | |
| Toggle Rotation | Press Right Stick | |
| Randomize Seed | Select | |

## Development
To get started, please  use [npm](https://nodejs.org) to install the required dependencies:
```sh
npm install
```

### Common tasks
Common tasks have been automated with [Gulp](https://gulpjs.com):

#### Build once
```sh
gulp build
```

#### Build continuously
```sh
gulp watch
```

#### Create distributables
```sh
gulp dist
```

#### Open in Electron
```sh
gulp electron
```

#### Build and open in Electron
```sh
gulp electron-build
```

#### Command line flags
| Flag | Description |
| - | - |
| `--debug` | Suppresses minification. |
