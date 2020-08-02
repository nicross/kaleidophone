# Kaleidophone
A relaxing generative audio toy submitted to [LOWREZJAM 2020](https://itch.io/jam/lowrezjam-2020).
Developed with [syngen](https://github.com/nicross/syngen).

## How to play
Interact to begin.
Explore ambient soundscapes by manipulating time.
Play, scrub, or freeze time with a variety of control configurations.
Randomize the seed or reload to hear a new song.

### Keyboard controls
| Action | Key 1 | Key 2 | Key 3 |
| - | - | - | - |
| Scrub Forward | W | Up Arrow | Numpad 8 |
| Scrub Backward | S | Down Arrow | Numpad 5 |
| Turn Left | A | Left Arrow | Numpad 4 |
| Turn Right | D | Right Arrow | Numpad 6 |
| Play Forward | Q | Page Up | Numpad 7 |
| Play Backward | Z | Page Down | Numpad 1 |
| Randomize Seed | R | Home | Numpad 9 |

### Gamepad controls
| Action | Button 1 | Button 2 |
| - | - | - |
| Scrub Forward | Left Stick | D-Pad Up |
| Scrub Backward | Left Stick | D-Pad Down |
| Turn Left | Right Stick | D-Pad Left |
| Turn Right | Right Stick | D-Pad Right |
| Play Forward | Y | Right Bumper |
| Play Backward | A | Left Bumper |
| Randomize Seed | X | Select |

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
