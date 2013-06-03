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

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    shaderProgram.pUniform  = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nUniform  = gl.getUniformLocation(shaderProgram, "uNMatrix");

    //These are for the terrain multitexture
    shaderProgram.r1max = gl.getUniformLocation(shaderProgram, "region1.max");
    shaderProgram.r1min = gl.getUniformLocation(shaderProgram, "region1.min");

    shaderProgram.r2max = gl.getUniformLocation(shaderProgram, "region2.max");
    shaderProgram.r2min = gl.getUniformLocation(shaderProgram, "region2.min");

    shaderProgram.r3max = gl.getUniformLocation(shaderProgram, "region3.max");
    shaderProgram.r3min = gl.getUniformLocation(shaderProgram, "region3.min");

    shaderProgram.r4max = gl.getUniformLocation(shaderProgram, "region4.max");
    shaderProgram.r4min = gl.getUniformLocation(shaderProgram, "region4.min");

    shaderProgram.r5max = gl.getUniformLocation(shaderProgram, "region5.max");
    shaderProgram.r5min = gl.getUniformLocation(shaderProgram, "region5.min");

    shaderProgram.r1Tex = gl.getUniformLocation(shaderProgram, "region1Texture");
    shaderProgram.r2Tex = gl.getUniformLocation(shaderProgram, "region2Texture");
    shaderProgram.r3Tex = gl.getUniformLocation(shaderProgram, "region3Texture");
    shaderProgram.r4Tex = gl.getUniformLocation(shaderProgram, "region4Texture");
    shaderProgram.r5Tex = gl.getUniformLocation(shaderProgram, "region5Texture");

    shaderProgram.multi = gl.getUniformLocation(shaderProgram, "multiTex");
    shaderProgram.alpha = gl.getUniformLocation(shaderProgram, "alpha");

    gl.uniform1f(shaderProgram.r1max, regions[0].max);
    gl.uniform1f(shaderProgram.r1min, regions[0].min);

    gl.uniform1f(shaderProgram.r2max, regions[1].max);
    gl.uniform1f(shaderProgram.r2min, regions[1].min);

    gl.uniform1f(shaderProgram.r3max, regions[2].max);
    gl.uniform1f(shaderProgram.r3min, regions[2].min);

    gl.uniform1f(shaderProgram.r4max, regions[3].max);
    gl.uniform1f(shaderProgram.r4min, regions[3].min);

    gl.uniform1f(shaderProgram.r5max, regions[4].max);
    gl.uniform1f(shaderProgram.r5min, regions[4].min);
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
