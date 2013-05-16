var canvas;
var gl;

var cubeVerticesBuffer;
var cubeVerticesColorBuffer;
var cubeVerticesIndexBuffer;

var mvMatrix;
var perspectiveMatrix;
var shaderProgram;

var camera;

var cube;
var cubeRotation = 0.0;

var degreesToRadians = Math.PI / 180.0;

//
// start()
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start() {
    canvas = document.getElementById("glcanvas");
    
    initWebGL(canvas); // Initialize the GL context
    
    // Only continue if WebGL is available and working
    if ( gl ) {
        gl.clearColor(0.8, 0.8, 0.8, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        
        initShaders();
        
        // Set up to draw the scene periodically.
        setInterval(drawScene, 15);
        
        cube = new Cube();
        
        camera = new Camera();
    
        bindInputEvents();
    }
}

//
// initWebGL()
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL() {
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
    
    // Save the current matrix, then rotate/translate before we draw.
    mvPushMatrix();
    
    mvRotate(camera.rotation.y, [0, 1, 0]);
    mvTranslate([camera.offset.x, camera.offset.y, camera.offset.z]);
    
    mvRotate(cubeRotation, [0, 1, 0]);
    
    cubeRotation += 0.5;
    if ( cubeRotation > 360 ) {
        cubeRotation -= 360;
    }
    
    setMatrixUniforms();
    
    cube.draw();
    
    // Restore the original matrix
    mvPopMatrix();
}
