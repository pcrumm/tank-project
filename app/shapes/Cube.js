function Cube() {
    // Create an array of vertices for the cube.
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
    
    // Now set up the colors for the faces. We'll use solid colors for each face.
    var colors = [
        [1.0,  1.0,  1.0,  1.0], // Front face: white
        [1.0,  0.0,  0.0,  1.0], // Back face: red
        [0.0,  1.0,  0.0,  1.0], // Top face: green
        [0.0,  0.0,  1.0,  1.0], // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0], // Right face: yellow
        [1.0,  0.0,  1.0,  1.0]  // Left face: purple
    ];
    
    // -----
    
    // Convert the array of colors into a table for all the vertices.
    var generated_colors = [];
    for (var j = 0; j < 6; j++) {
        var c = colors[j];
        
        // Repeat each color four times for the four vertices of the face
        for (var i = 0; i < 4; i++) {
            generated_colors = generated_colors.concat(c);
        }
    }
    
    // -----
    
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
    
    Shape.call(this, vertices, generated_colors, vertex_indices); // inherit from Shape
}
inheritPrototype(Cube, Shape);
