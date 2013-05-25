function TankBody(offset, y_rotation) {
    // Create an array of vertices for the cube.
    var vertices = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  0.5,  1.0,
        -1.0,  0.5,  1.0,
        
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  0.5, -1.0,
         1.0,  0.5, -1.0,
         1.0, -1.0, -1.0,
        
        // Top face
        -1.0,  0.5, -1.0,
        -1.0,  0.5,  1.0,
         1.0,  0.5,  1.0,
         1.0,  0.5, -1.0,
        
        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        
        // Right face
         1.0, -1.0, -1.0,
         1.0,  0.5, -1.0,
         1.0,  0.5,  1.0,
         1.0, -1.0,  1.0,
        
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  0.5,  1.0,
        -1.0,  0.5, -1.0
    ];
    
    // Normals:
    var normals = [
        // Front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        
        // Back
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        
        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        
        // Bottom
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        
        // Right
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        
        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];
    
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's position.
    var vertex_indices = [
        0,  1,  2,      0,  2,  3,  // front
        4,  5,  6,      4,  6,  7,  // back
        8,  9,  10,     8,  10, 11, // top
        12, 13, 14,     12, 14, 15, // bottom
        16, 17, 18,     16, 18, 19, // right
        20, 21, 22,     20, 22, 23  // left
    ];

    Shape.call(this, vertices, normals, {texture: textures.metal, texture_coords: cube_texture_coords}, vertex_indices);
    
    this.offset = offset || {x: 0, y: 0, z: 0};
    this.rotation = {x: 0, y: y_rotation, z: 0};
    this.scale = {x: 1, y: 0.5, z: 1};

    this.updateYOffset = function() {
        this.offset.y = terrain.heightMap(this.offset.x, this.offset.z);
    };
        
    this.moveOnXAxis = function(units) {
        var y_rotation_in_rads = this.rotation.y * degreesToRadians;
        this.offset.x += Math.cos(y_rotation_in_rads) * units;
        this.offset.z -= Math.sin(y_rotation_in_rads) * units;
        this.updateYOffset();
    };
    
    this.moveOnZAxis = function(units) {
        var y_rotation_in_rads = this.rotation.y * degreesToRadians;
        this.offset.x -= Math.sin(y_rotation_in_rads) * units;
        this.offset.z -= Math.cos(y_rotation_in_rads) * units;
        this.updateYOffset();
    };
    
    this.rotateOnYAxis = function(units) {
        this.rotation.y -= units;
        
        if ( this.rotation.y > 360.0 ) {
            this.rotation.y -= 360.0;
        }
        if ( this.rotation.y < -360.0 ) {
            this.rotation.y += 360.0;
        }
    };
}

inheritPrototype(TankBody, Shape);

// Overloading Shape.prototype's update():
// (Rotation comes after translation, and only rotating around Y axis)
TankBody.prototype.update = function() {
    mvPushMatrix();
        
    mvTranslate([this.offset.x, this.offset.y, this.offset.z]);
    mvRotate(this.rotation.y, [0, 1, 0]);
    mvScale(this.scale.x, this.scale.y, this.scale.z);
    
    updateMatrixUniforms();
    
    mvPopMatrix();
};
