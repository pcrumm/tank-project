// Cube: a 1x1x1 unit cube
function Cube(offset, rotation, scale, texture) {
    var vertices = [
        // Front face
        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,

        // Back face
        -0.5, -0.5, -0.5,
        -0.5,  0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5, -0.5, -0.5,

        // Top face
        -0.5,  0.5, -0.5,
        -0.5,  0.5,  0.5,
         0.5,  0.5,  0.5,
         0.5,  0.5, -0.5,

        // Bottom face
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5, -0.5,  0.5,
        -0.5, -0.5,  0.5,

        // Right face
         0.5, -0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5,  0.5,  0.5,
         0.5, -0.5,  0.5,

        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5
    ];

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

    var texture_coords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];

    var vertex_indices = [
        0,  1,  2,      0,  2,  3,  // front
        4,  5,  6,      4,  6,  7,  // back
        8,  9,  10,     8,  10, 11, // top
        12, 13, 14,     12, 14, 15, // bottom
        16, 17, 18,     16, 18, 19, // right
        20, 21, 22,     20, 22, 23  // left
    ];

    Shape.call(this, vertices, normals, {texture: texture || textures.crate, texture_coords: texture_coords}, vertex_indices);

    this.offset = offset || {x: 0, y: 0, z: 0};
    this.rotation = rotation || {x: 0, y: 0, z: 0};
    this.scale = scale || {x: 1, y: 1, z: 1};

    var loader = new THREE.JSONLoader();

    loader.load( 'assets/simple_tank1.js', function ( collada ) {

        console.log(collada);
        // Shape.call(this, collada.vertices, normals, {texture: texture || textures.crate, texture_coords: texture_coords}, collada.faces);

    } );

}

inheritPrototype(Cube, Shape);

Cube.prototype.rotateOnYAxis = function(units) {
    this.rotation.y -= units;

    if ( this.rotation.y > 360.0 ) {
        this.rotation.y -= 360.0;
    }
    else if ( this.rotation.y < -360.0 ) {
        this.rotation.y += 360.0;
    }
};
