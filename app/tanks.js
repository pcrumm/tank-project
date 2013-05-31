var gl;

var mvMatrix;
var perspectiveMatrix;

var shaderProgram;

var shapes;
var tanks;
var projectiles;
var player;
var multiplayer;
var terrain;

var degreesToRadians = Math.PI / 180.0;

//
// start()
//
// Called when the canvas is created to get the ball rolling.
//
function start() {
    var canvas = document.getElementById("glcanvas");
    initWebGL(canvas); // Initialize the GL context

    // Only continue if WebGL is available and working
    if ( gl ) {
        gl.clearColor(0.2, 0.7, 1.0, 1.0);  // Clear to sky blue
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        initShaders();
        initTextures();
        initSounds();

        Math.seedrandom("I am Ozymandius, King of asdasdaac");

        terrain = new Terrain();

        shapes = [
            terrain,
            new Square({x: terrain.displacement.horizontal, y: terrain.displacement.vertical, z: terrain.displacement.horizontal}, {x: 0, y: 0, z: 0}, {x: 1000, y: 1, z: 1000}),
            new Sphere({x: terrain.displacement.horizontal, y: 0, z: terrain.displacement.horizontal} , {x: 0, y: 0, z: 0}, {x: 300, y: 300, z: 300}, textures.sky),
        ];

        tanks = [
            new Tank({x: 130, y: null, z: 170}, 0), // the player's tank
            new Tank({x: 130, y: null, z: 160}, 30)
        ];

        projectiles = [];

        player = new Player(tanks[0]);

        shapes = shapes.concat(tanks);

        multiplayer = new Multiplayer();

        initInputEventHandler();

        // Set up periodic updates:
        setInterval(drawScene, 30);
        setInterval(multiplayer.receiveTankUpdate, 30);
    }
}

//
// initWebGL()
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL(canvas) {
    gl = null;
    
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}
    
    // If we don't have a GL context, give up now
    if ( !gl ) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
}

// bindInputEvents()
//
// Bind events for the application, e.g. keyboard or mouse interaction
//
function bindInputEvents() {
    document.addEventListener('keydown', function(event) {        
        switch ( event.keyCode ) {
            case 65: // A
                camera.moveOnXAxis(-1);
                break;
            case 68: // D
                camera.moveOnXAxis(1);
                break;
                
            case 87: // W
                camera.moveOnZAxis(1);
                break;
            case 83: // S
                camera.moveOnZAxis(-1);
                break;
                
            case 37: // Left Arrow
                camera.rotateOnYAxis(-2);
                break;
            case 39: // Right Arrow
                camera.rotateOnYAxis(2);
                break;

            //I put these in for testing purposes

            case 40:
                camera.moveOnYAxis(2);
                break;

            case 38:
                camera.moveOnYAxis(-2);
                break;
        };
    });
}


// drawScene()
//
// Draw the scene.
//
function drawScene() {
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Establish the perspective with which we want to view the
    // scene. Our field of view is 60 degrees, with a width/height
    // ratio of 800:450 (16:9), and we only want to see objects between 0.1 units
    // and 500 units away from the camera.
    perspectiveMatrix = makePerspective(60, 800.0/450.0, 1, 500.0);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    loadIdentity();

    // Save the current matrix.
    mvPushMatrix();
    
    player.update();

    // Remove projectiles if they are no longer active:
    for (i = 0; i < projectiles.length; i++) {
        if ( projectiles[i].is_alive === false ) {
            shapes.splice(shapes.indexOf(projectiles[i]), 1);
            projectiles.splice(i, 1);
        }
    }

    for (var i = 0; i < shapes.length; i++) {
        shapes[i].draw();
    }

    // Restore the original matrix
    mvPopMatrix();
}
