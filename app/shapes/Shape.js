// Helper function:
function inheritPrototype(subType, superType) {
    var p = Object.create(superType.prototype);
    p.constructor = subType;
    subType.prototype = p;
}

// The Shape object holds ugly GL buffer stuff, and takes care of drawing it. Also holds translation/rotation/scale info
function Shape (vertices, normals, colors, vertex_indices) {
    this.offset = {
        x: 0,
        y: 0,
        z: 0
    };
    
    this.rotation = {
        x: 0,
        y: 0,
        z: 0
    };
    
    this.scale = {
        x: 1,
        y: 1,
        z: 1
    };
    
    // Construct buffers:
    
    // Now pass the list of vertices into WebGL to build the shape. We do this by creating a Float32Array
    // from the JavaScript array, then use it to fill the current vertex buffer.
    this.vertices_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    
    this.vertex_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
    // Colors:
    this.vertices_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    // Build the element array buffer; this specifies the indices
    // into the vertex array for each face's vertices.
    this.vertices_index_buffer = gl.createBuffer();
    this.vertices_index_buffer.length = vertex_indices.length; // necessary when drawing later
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertices_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertex_indices), gl.STATIC_DRAW);
}

Shape.prototype.update = function() {
    mvPushMatrix();
    
    mvRotate(this.rotation.x, [1, 0, 0]);
    mvRotate(this.rotation.y, [0, 1, 0]);
    mvRotate(this.rotation.z, [0, 0, 1]);
    
    mvTranslate([this.offset.x, this.offset.y, this.offset.z]);
    
    mvScale(this.scale.x, this.scale.y, this.scale.z);
    
    setMatrixUniforms();
    
    mvPopMatrix();
};

Shape.prototype.draw = function() {
    this.update();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_normals_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_color_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    
    // Draw the cube.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertices_index_buffer);
    
    gl.drawElements(gl.TRIANGLES, this.vertices_index_buffer.length, gl.UNSIGNED_SHORT, 0);
};
