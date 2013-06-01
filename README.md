# Tanks, Tanks, & More Tanks

## Overview

The application is ~~currently~~ no longer dirt simple. When you open up index.html, you can move around with WASD,
and rotate the camera with the mouse. Click to shoot.

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

However, Chrome does not allow you to load certain local files (e.g. textures). There are two ways to get around this:

* Host a local server on your computer. This is very easy on OSX: run

            $ python -m SimpleHTTPServer

  and navigate to localhost:8000.

* Disable the above Chrome security option. This solution is not recommended. Run

            $ open /Applications/"Google Chrome.app" –args -disable-web-security

  this will last until Chrome is closed.

The backend will require node.js, and the configuration instructions below.

#### Server
First, download and install node.js from http://nodejs.org/

Once you've done so, open a terminal window and

    cd server && npm install
