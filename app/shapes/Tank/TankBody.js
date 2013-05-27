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
    this.offset.y = terrain.heightMap(this.offset.x, this.offset.z);
};

TankBody.prototype.moveOnZAxis = function(units) {
    var y_rotation_in_rads = this.rotation.y * degreesToRadians;
    this.offset.x -= Math.sin(y_rotation_in_rads) * units;
    this.offset.z -= Math.cos(y_rotation_in_rads) * units;
    this.updateYOffset();
}

// Overloading Shape.prototype's update():
// (Rotation comes after translation, and only rotating around Y axis)
TankBody.prototype.update = function() {
    mvPushMatrix();
        
    mvTranslate([this.offset.x, this.offset.y, this.offset.z]);
    mvRotate(this.rotation.y, [0, 1, 0]);
    
    updateMatrixUniforms();
    
    // Need to scale *after* updating the normals matrix (normals aren't normals if they get scaled)
    // After, only updating the modelview matrix necessary.
    mvScale(this.scale.x, this.scale.y, this.scale.z);
    updateViewMatrixUniform();

    mvPopMatrix();
};
