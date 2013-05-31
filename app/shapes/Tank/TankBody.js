function TankBody(offset, y_rotation, tank) {
    Cube.call(this,
              offset || {x: 0, y: 0.25, z: 0},
              {x: 0, y: y_rotation || 0, z: 0},
              {x: 1.25, y: 0.5, z: 2},
              textures.metal
    );

    // This is how far the tank body must be translated "up" after rotation to be on top of the terrain:
    this.relative_vertical_offset = 0.25;
    this.tank = tank;
}

inheritPrototype(TankBody, Cube);

TankBody.prototype.moveOnZAxis = function(units) {

    // Rudimentary bounding-sphere collision against other tanks
    
    var tank_bounding_sphere_radius_2 = 4; // Squared
    
    var y_rotation_in_rads = this.rotation.y * degreesToRadians;

    var new_offset = {
        x: this.offset.x - Math.sin(y_rotation_in_rads) * units,
        y: this.offset.y,
        z: this.offset.z - Math.cos(y_rotation_in_rads) * units
    };

    for (var i = 0; i < tanks.length; i++) {
        if (tanks[i] == this.tank)
            continue;

        var tank_offset = tanks[i].getOffset();
        var distance_between_centers =
            Math.pow(tank_offset.x - new_offset.x, 2) +
            Math.pow(tank_offset.y - new_offset.y, 2) +
            Math.pow(tank_offset.z - new_offset.z, 2);

        if ( distance_between_centers < (tank_bounding_sphere_radius_2) ) {
            return;
        }
    }

    this.offset = new_offset;
}

// Overloading Shape.prototype's update():
// (Rotation comes after translation)
TankBody.prototype.update = function() {
    mvPushMatrix();

    mvTranslate([this.offset.x, this.offset.y, this.offset.z]);

    mvRotate(this.rotation.x, [1, 0, 0]);
    mvRotate(this.rotation.z, [0, 0, 1]);
    mvRotate(this.rotation.y, [0, 1, 0]); // y must come after

    // After rotating, just move a bit more up:
    mvTranslate([0, this.relative_vertical_offset, 0]);

    updateMatrixUniforms();

    // Need to scale *after* updating the normals matrix (normals aren't normals if they get scaled)
    // After, only updating the modelview matrix necessary.
    mvScale(this.scale.x, this.scale.y, this.scale.z);
    updateViewMatrixUniform();

    mvPopMatrix();
};
