# Tanks

#### Created by Kasey Carrothers, Phillip K. Crumm III, Ryan Hansberry, Byron Lutz, and David Voong for CS 174A at UCLA, in Spring 2013.


## Project Introduction

### Overview

Tanks is a WebGL-implemented multiplayer game that runs in the browser (we highly recommendend using Google Chrome). There are two
main components to the game -- the server and the client. In order to play Tanks, you must connect to a server, either by hosting
a local one, or by connecting to an external one (you can find instructions to host your own server in the next section, under Setup).

Once connected to a server, you can control your tank by using WASD to move, Up & Down Arrow to aim, Left & Right Arrow to rotate
the camera, and spacebar to shoot.

### Setup

The frontend of this game (that is, using it in the browser) has no requirements. Included below are instructions on how to
create your own local server to host the game.

(Please note that these instructions assume a UNIX OS)

In order to host your own server, you must first download and install node.js from http://nodejs.org/. Once you have done so,
open a terminal window and run the following from the root directory of this repository:

    cd server && npm install

Once that's done, you can actually run the server with:

    node server.js

And then navigate to localhost:8080 in order to connect to the server and play the game.

If you would like to play this game with friends on a local server of yours, you can create an ad hoc network, and have your friends
connect to your network and server by having them navigate to <YOUR_IP_ADDRESS>:8080. On a Mac, you can easily create an ad hoc network
by clicking on the network button in the top right menu bar, and clicking "Create Network." You can also determine what your IP address
is on a Mac by looking in your Network Preferences.

### Supported Browsers:

For OS/X:

* Chrome (Recommended)

* Safari: Works, if WebGL is enabled. To enable WebGL, open Safari, go to Safari->Preferences->Advanced, check "Show Develop menu...", go to Develop->Enable WebGL.

* Firefox: Works, but slow.

For Windows:

* Chrome

* Firefox

* IE11


## Technical Details

This project is primarily written in JavaScript (using node.js for the backend), as well as in GLSL for the WebGL shaders.

In the process of writing this project, we created a basic WebGL engine to base our project on top of, allowing to abstract away
much of the headaches associated with low-level graphics programming. Functions found in app/init/ initialize things such as shaders
and textures, so that they can be used throughout the application. In order to allow for an object-oriented approach to WebGL (which
can sometimes be difficult due to OpenGL's nature) a main class, Shape, was created, which handles vertex, normal, and texture buffers,
as well as drawing and performing matrix rotations and transformations (see shapes/Shape.js). All sets of geometry you see in Tanks
inherits from Shape.

The vertex and fragment shaders can be found in app/index.html. Only two shaders total were used to build this application. The vertex shader
is quite simple, and only performs view matrix calculations and basic lighting and shading. The fragment shader handles textures, but for the
terrain, handles mixing multiple textures based on height (more on this is discussed in the Advanced Topics section).


## Advanced Topics

For this class project, we were required to implement at least three "advanced topics."

### Terrain Generation (generated from a random seed)

...

### Multitexturing (terrain generation based on height)

...

### Projectile Physics (tank projectiles)

Projectile physics was used to realistically animate the projectiles shot by the tanks. When a projectile is generated, it
has a initial height and velocity vector depending on the tank's position and direction of its turret. When the projectile
is shot it is animated every frame with a variant of Newton's equation of motion. Each projectile has a mass constant and
the game has a global gravity constant (-9.81). The units don't quite make sense in this context (since a meter in the game
does is not always a real-world meter) but the equations, intuition, and constants are carried over from real physics to
make the game easier to program and to understand. The code for this is mostly in app/shapes/Projectile.js.

### Collision Detection

All moving objects in this game perform collision detection, either with the terrain or with each other. Most difficult
to implement was collision detection with the randomly generated terrain; a mixture of bilinear interpolation to find the
y-coordinate at any given point and averaging terrain height to find the appropriate slope for a tank to rest on were needed.
The implementation of this particular detection can be found in app/shapes/Terrain.js's getMapHeightAndSlope() method.

In order to detect collisions between two moving objects, simple bounding spheres were used. Though tanks are rectangular prisms,
the relatively non-approximate volume of a sphere proved to work just fine. The implementation of bounding sphere collision detection
can be found in app/shapes/Tank/TankBody.js and app/shapes/Projectile.js.


## Credits

The following open-source libraries were used in Tanks:

* [Sylvester](http://sylvester.jcoglan.com/): (JavaScript vector/matrix math), James Coglan

* [glUtils.js & matrixUtils.js](http://blog.vlad1.com/): (Extensions to Sylvester), Vladimir Vukićević

* [Simplex Noise](https://gist.github.com/banksean/304522): (Pseudorandom 3D noise), Stefan Gustavson & Sean McCullough

* [jQuery](http://jquery.com/): (Animations & Miscellaneous), jQuery Foundation, Inc.


## License

#### Tanks is released as an open source project under [The MIT License](https://github.com/pcrumm/tank-project/blob/explosions/LICENSE).

#### Copyright (C) 2013 Kasey Carrothers, Phillip K. Crumm III, Ryan Hansberry, Byron Lutz, and David Voong. All Rights Reserved.
