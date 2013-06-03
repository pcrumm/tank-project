function Square(offset, rotation, scale) {
    var vertices = [
        -0.5, 0.0, -0.5,
         0.5, 0.0, -0.5,
         0.5, 0.0,  0.5,
        -0.5, 0.0,  0.5,
    ];

    var normals = [
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
    ];

    // This array defines a face as two triangles, using the
    // indices in the vertex array to specify each triangle's position.
    var vertex_indices = [
        0, 1, 2, 
        0, 2, 3
    ];

    // TODO: Have a way to specify these, i.e. not hardcode 1000
    var texture_coords = [
        0,   100,
        0,   0,
        100, 0,
        100, 100
    ];

    Shape.call(this, vertices, normals, {texture: textures.ocean, texture_coords: texture_coords}, vertex_indices);

    this.offset = offset || {x: 0, y: 0, z: 0};
    this.rotation = rotation || {x: 0, y: 0, z: 0};
    this.scale = scale || {x: 1, y: 1, z: 1};
}

inheritPrototype(Square, Shape);
