var gl;

var mvMatrix;
var perspectiveMatrix;

var shaderProgram;

var shapes;
var tanks;
var player;

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
        gl.clearColor(0.7, 0.7, 1.0, 1.0);  // Clear to sky blue
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        
        initShaders();
        
        // Set up to draw the scene periodically.
        setInterval(drawScene, 15);
        
        shapes = [
            new Square({x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 100, y: 1, z: 100}), // the ground
            new Cube({x: 0, y: 2, z: -5}, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1}) // random floating cube
        ];
        
        tanks = [
            new Tank({x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1.5}), // the player's tank
            new Tank({x: -4, y: 0, z: -10}, {x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1})
        ];
        
        // TODO: Remove these temporary settings:
        tanks[0].id = 0;
        tanks[1].id = 1;
        
        player = new Player(tanks[0]);
        
        shapes = shapes.concat(tanks);
    
        bindInputEvents();
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

//
// bindInputEvents()
//
// Bind events for the application, e.g. keyboard or mouse interaction
//
function bindInputEvents() {
    document.addEventListener('keydown', function(event) {
        switch ( event.keyCode ) {
            case 65: // A
                player.moveLeft();
                break;
            case 68: // D
                player.moveRight();
                break;
                
            case 87: // W
                player.moveForward();
                break;
            case 83: // S
                player.moveBackward();
                break;
                
            case 37: // Left Arrow
                player.rotateLeft();
                break;
            case 39: // Right Arrow
                player.rotateRight();
                break;
        };
    });
}


//
// drawScene()
//
// Draw the scene.
//
function drawScene() {
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Establish the perspective with which we want to view the
    // scene. Our field of view is 45 degrees, with a width/height
    // ratio of 640:480, and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
    
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    loadIdentity();
    
    // Save the current matrix.
    mvPushMatrix();
    
    player.update();
    
    for (var i = 0; i < shapes.length; i++) {
        shapes[i].draw();
    }
    
    // Restore the original matrix
    mvPopMatrix();
}
