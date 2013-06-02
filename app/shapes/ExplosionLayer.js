function ExplosionLayer(offset, rotation, scale, texCoords) {
	var vertices = [
        -0.5,-0.5,  0.0,
         0.5,-0.5,  0.0,
         0.5, 0.5,  0.0,
        -0.5, 0.5,  0.0,
    ];

    //Normals aren't necessary, as explosions aren't lit.
    //They are just here for compatibility
    var normals = [
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0
    ];

    // This array defines a face as two triangles, using the
    // indices in the vertex array to specify each triangle's position.
    var vertex_indices = [
        0, 1, 2, 
        0, 2, 3
    ];

    var texture_coords = texCoords || [
                                        0,    0.25,
                                        0,    0,
                                        0.25, 0,
                                        0.25, 0.25
                                      ];

    Shape.call(this, vertices, normals, {texture: textures.explosion, texture_coords: texture_coords, use_alpha: 1.0}, vertex_indices);

    this.offset = offset || {x: 0, y: 0, z: 0};
    this.rotation = rotation || {x: 0, y: 0, z: 0};
    this.scale = scale || {x: 1, y: 1, z: 1};
}

inheritPrototype(ExplosionLayer, Shape);

ExplosionLayer.prototype.update = function(texCoords, rotation, scale) {
    if (texCoords)
        Shape.prototype.setTexCoords.call(texCoords);

    mvPushMatrix();

    //mvRotate(rotation.x, [1, 0, 0]);
    //mvRotate(rotation.y, [0, 1, 0]);
    //mvRotate(rotation.z, [0, 0, 1]);

    // Need to scale *after* updating the normals matrix (normals aren't normals if they get scaled)
    // After, only updating the modelview matrix necessary.
    //mvScale(scale.x, scale.y, scale.z);

    Shape.prototype.update.call(this);

    mvPopMatrix();
};
/*
ExplosionLayer.prototype.draw = function() {

}*/