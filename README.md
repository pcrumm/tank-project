# Tanks, Tanks, & More Tanks

## Overview

The control scheme: WASD to move, Up & Down Arrow to aim, Left & Right Arrow to rotate camera, spacebar to shoot.

### General Guidelines

Please read through the resources available at https://developer.mozilla.org/en-US/docs/Web/WebGL
(specifically, their "Development Topics" section) in order to learn a decent amount about WebGL.

Please also note that this project's indentation style is 4 spaces (no tabs!). :)

#### Browser Limitations:

For OSX:
* Chrome: Works with no issues (Recommended).
* Safari: Works (seemingly with no issues) if WebGL is enabled. To enable WebGL,
open Safari, go to Safari->Preferences->Advanced, check "Show Develop menu...",
go to Develop->Enable WebGL.
* Firefox: Works, but slow.

For Windows:
* Chrome (Recommended)
* Firefox
* IE11

### Setup
#### Requirements
The front-end of this application has no requirements

#### Server
First, download and install node.js from http://nodejs.org/

Once you've done so, open a terminal window and run the following from the root directory of this repository:

    cd server && npm install

Once that's done, you can actually run the game with:

    node server.js

And then navigate to localhost:8080.

## Advanced Topics
We have implemented the following advanced topics:
* Projectile physics (tank projectiles)
* Terrain generation (generated from a random seed)
* Multitexturing (terrain generation based on height)
* Collision detection (projectiles vs. tanks)