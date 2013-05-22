# Tanks, Tanks, & More Tanks

## Overview

The application is currently dirt simple. When you open up index.html, you can move around with WASD,
and rotate around with the left and right arrow keys.

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
* ?

### Setup
#### Requirements
The front-end of this application has no requirements.

The backend will require node.js, and the configuration instructions below.

#### Server
First, download and install node.js from http://nodejs.org/

Once you've done so, open a terminal window and

    cd server && npm install
