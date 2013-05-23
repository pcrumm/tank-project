function TankTurret(offset, y_rotation) {
    // Create an array of vertices for the cube.
    var vertices = [
        // Front face
        -0.5,    0,  0.5,
         0.5,    0,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,

        // Back face
        -0.5,    0, -0.5,
        -0.5,  0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5,    0, -0.5,

        // Top face
        -0.5,  0.5, -0.5,
        -0.5,  0.5,  0.5,
         0.5,  0.5,  0.5,
         0.5,  0.5, -0.5,

        // Bottom face
        -0.5,    0, -0.5,
         0.5,    0, -0.5,
         0.5,    0,  0.5,
        -0.5,    0,  0.5,

        // Right face
         0.5,    0, -0.5,
         0.5,  0.5, -0.5,
         0.5,  0.5,  0.5,
         0.5,    0,  0.5,

        // Left face
        -0.5,    0, -0.5,
        -0.5,    0,  0.5,
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5
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
    this.scale = {x: 1, y: 1, z: 1};

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

inheritPrototype(TankTurret, Shape);

// Overloading Shape.prototype's update():
TankTurret.prototype.update = TankBody.prototype.update;
