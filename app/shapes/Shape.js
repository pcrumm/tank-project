// Helper function:
function inheritPrototype(subType, superType) {
    var p = Object.create(superType.prototype);
    p.constructor = subType;
    subType.prototype = p;
}

// The Shape object holds ugly GL buffer stuff, and takes care of drawing it. Also holds translation/rotation/scale info
function Shape (vertices, normals, texture_info, vertex_indices) {
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

    this.vertices_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.vertex_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    this.vertex_texture_coords_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coords_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture_info.texture_coords), gl.STATIC_DRAW);

    this.texture = texture_info.texture || null;
    this.multiTex = 0;
    if ( texture_info.use_multitexture === true ) {
        this.multiTex = 1;
        this.multitexture = texture_info.multitexture;
    }

    this.alpha = 0;
    if ( texture_info.use_alpha === true)
        this.alpha = texture_info.use_alpha;

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

    gl.uniform1i(shaderProgram.multi, this.multiTex);
    gl.uniform1f(shaderProgram.alpha, this.alpha);

    updateMatrixUniforms();

    // Need to scale *after* updating the normals matrix (normals aren't normals if they get scaled)
    // After, only updating the modelview matrix necessary.
    mvScale(this.scale.x, this.scale.y, this.scale.z);
    updateViewMatrixUniform();

    mvPopMatrix();
};

Shape.prototype.draw = function() {
    this.update();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_normals_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coords_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    if (this.multiTex === 0) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
    }
    else {
        for (var i = 0; i < this.multitexture.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, this.multitexture[i].texture);
            gl.uniform1i(this.multitexture[i].uniform, i);
        }
    }

    // Draw the cube.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertices_index_buffer);
    gl.drawElements(gl.TRIANGLES, this.vertices_index_buffer.length, gl.UNSIGNED_SHORT, 0);
};

Shape.prototype.setTexCoords = function(texCoords) {
    if (texCoords) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_texture_coords_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    }
}