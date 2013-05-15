//
// initShaders()
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    
    // Create the shader program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    // If creating the shader program failed, alert
    
    if ( !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) ) {
        alert("Unable to initialize the shader program.");
    }
    
    gl.useProgram(shaderProgram);
    
    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    
    vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);
}

//
// getShader()
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    
    // Didn't find an element with the specified ID; abort.
    if ( !shaderScript ) {
        return null;
    }
    
    // Walk through the source element's children, building the
    // shader source string.
    var theSource = "";
    var currentChild = shaderScript.firstChild;
    
    while ( currentChild ) {
        if ( currentChild.nodeType == 3 ) {
          theSource += currentChild.textContent;
        }
        
        currentChild = currentChild.nextSibling;
    }
    
    // Now figure out what type of shader script we have,
    // based on its MIME type.
    var shader;
    
    if ( shaderScript.type == "x-shader/x-fragment" ) {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if ( shaderScript.type == "x-shader/x-vertex" ) {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;  // Unknown shader type
    }
    
    // Send the source to the shader object and compile the shader program:
    gl.shaderSource(shader, theSource);
    gl.compileShader(shader);
    
    // Verify compilation
    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }
    
    return shader;
}
