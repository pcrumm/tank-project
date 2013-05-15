var canvas;
var gl;

var cubeVerticesBuffer;
var cubeVerticesColorBuffer;
var cubeVerticesIndexBuffer;

var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;

var camera;

var degreesToRadians = Math.PI / 180.0;
var cubeRotation = 0.0;

// Camera class for the application.
function Camera () {
    this.offset = {
        x: 0,
        y: 0,
        z: -10
    };
    
    this.rotation = {
        y: 0
    };
    
    this.moveOnXAxis = function(units) {
        var yRotationInRadians = this.rotation.y * degreesToRadians;
        this.offset.x -= Math.cos(yRotationInRadians) * units;
        this.offset.z -= Math.sin(yRotationInRadians) * units;
    };
    
    this.moveOnZAxis = function(units) {
        var yRotationInRadians = this.rotation.y * degreesToRadians;
        this.offset.x -= Math.sin(yRotationInRadians) * units;
        this.offset.z += Math.cos(yRotationInRadians) * units;
    };
    
    this.moveOnYAxis = function(units) {
        this.offset.y += units;
    };
    
    this.rotateOnYAxis = function(units) {
        this.rotation.y += units;
        
        if ( this.rotation.y > 360.0 ) {
            this.rotation.y -= 360.0;
        }
        if ( this.rotation.y < -360.0 ) {
            this.rotation.y += 360.0;
        }
    }
    
    this.update = function () {
        // TODO: Finish this, make it take care of updating translations / rotations (in drawScene)
    }
}

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
        
        // Build objects to draw:
        initBuffers();
        
        // Set up to draw the scene periodically.
        setInterval(drawScene, 15);
        
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
// initBuffers()
//
// Initialize the buffers we'll need.
//
function initBuffers() { 
    // Create a buffer for the cube's vertices.
    cubeVerticesBuffer = gl.createBuffer();
    
    // Select the cubeVerticesBuffer as the one to apply vertex operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    
    // Now create an array of vertices for the cube.
    var vertices = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
        
        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
        
        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        
        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    
    // Now pass the list of vertices into WebGL to build the shape. We do this by creating a Float32Array
    // from the JavaScript array, then use it to fill the current vertex buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Now set up the colors for the faces. We'll use solid colors for each face.
    var colors = [
        [1.0,  1.0,  1.0,  1.0], // Front face: white
        [1.0,  0.0,  0.0,  1.0], // Back face: red
        [0.0,  1.0,  0.0,  1.0], // Top face: green
        [0.0,  0.0,  1.0,  1.0], // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0], // Right face: yellow
        [1.0,  0.0,  1.0,  1.0]  // Left face: purple
    ];
    
    // Convert the array of colors into a table for all the vertices.
    var generatedColors = [];
    for (var j = 0; j < 6; j++) {
        var c = colors[j];
        
        // Repeat each color four times for the four vertices of the face
        for (var i = 0; i < 4; i++) {
            generatedColors = generatedColors.concat(c);
        }
    }
    
    cubeVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);
    
    // Build the element array buffer; this specifies the indices
    // into the vertex array for each face's vertices.
    cubeVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's position.
    var cubeVertexIndices = [
        0,  1,  2,      0,  2,  3,  // front
        4,  5,  6,      4,  6,  7,  // back
        8,  9,  10,     8,  10, 11, // top
        12, 13, 14,     12, 14, 15, // bottom
        16, 17, 18,     16, 18, 19, // right
        20, 21, 22,     20, 22, 23  // left
    ];
    
    // Now send the element array to GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
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
    
    // Now move the drawing position a bit to where we want to start drawing the cube.
    //mvTranslate([4.0, 0.0, -10.0]);
    
    // Save the current matrix, then rotate/translate before we draw.
    mvPushMatrix();
    
    mvRotate(camera.rotation.y, [0, 1, 0]);
    mvTranslate([camera.offset.x, camera.offset.y, camera.offset.z]);
    
    mvRotate(cubeRotation, [0, 1, 0]);
    
    cubeRotation += 0.5;
    if ( cubeRotation > 360 ) {
        cubeRotation -= 360;
    }
    
    // Draw the cube by binding the array buffer to the cube's vertices
    // array, setting attributes, and pushing it to GL.
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    // Set the colors attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    
    // Draw the cube.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    
    setMatrixUniforms();
    
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    
    // Restore the original matrix
    mvPopMatrix();
}
