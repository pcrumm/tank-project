function TankBody(offset, y_rotation) {
    Cube.call(this,
              offset || {x: 0, y: 0.25, z: 0},
              {x: 0, y: y_rotation || 0, z: 0},
              {x: 1.25, y: 0.5, z: 2},
              textures.metal
    );
}

inheritPrototype(TankBody, Cube);

TankBody.prototype.updateYOffset = function() {
    var terrain_info = terrain.getMapHeightAndSlope(this.offset.x, this.offset.z);
    this.offset.y = terrain_info.y;

    this.rotation.x = terrain_info.slope.rotation_around_x;
    this.rotation.z = terrain_info.slope.rotation_around_z;
};

TankBody.prototype.moveOnZAxis = function(units) {
    var y_rotation_in_rads = this.rotation.y * degreesToRadians;
    this.offset.x -= Math.sin(y_rotation_in_rads) * units;
    this.offset.z -= Math.cos(y_rotation_in_rads) * units;
    this.updateYOffset();
}

// Overloading Shape.prototype's update():
// (Rotation comes after translation)
TankBody.prototype.update = function() {
    mvPushMatrix();

    mvTranslate([this.offset.x, this.offset.y, this.offset.z]);

    mvRotate(this.rotation.x, [1, 0, 0]);
    mvRotate(this.rotation.z, [0, 0, 1]);
    mvRotate(this.rotation.y, [0, 1, 0]); // y must come after

    updateMatrixUniforms();

    // Need to scale *after* updating the normals matrix (normals aren't normals if they get scaled)
    // After, only updating the modelview matrix necessary.
    mvScale(this.scale.x, this.scale.y, this.scale.z);
    updateViewMatrixUniform();

    mvPopMatrix();
};
