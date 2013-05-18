function Square(offset, rotation, scale) {
    var vertices = [
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
    ];
    
    var normals = [
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
    ];
    
    var green = [0.2,  0.8,  0.2,  1.0];
    var colors = [];
    for (var i = 0; i < 4; i++) {
        colors = colors.concat(green);
    }
    
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's position.
    var vertex_indices = [ 
        0, 1, 2, 
        0, 2, 3
    ];
    
    Shape.call(this, vertices, normals, colors, vertex_indices); // inherit from Shape
    
    this.offset = offset || {x: 0, y: 0, z: 0};
    this.rotation = rotation || {x: 0, y: 0, z: 0};
    this.scale = scale || {x: 1, y: 1, z: 1};
}

inheritPrototype(Square, Shape);
