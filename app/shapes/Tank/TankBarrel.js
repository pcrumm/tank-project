function TankBarrel(offset, y_rotation) {
    Cube.call(this,
              offset,
              {x: 0, y: y_rotation || 0, z: 0},
              {x: 0.2, y: 0.2, z: 1.25},
              {texture: textures.camo, tiling_factor: 1.5}
    );

    this.relative_vertical_offset = 0.55;
    this.relative_forward_offset = -0.6125;
    this.firing_angle = 30;
}

inheritPrototype(TankBarrel, Cube);

// Overloading Shape.prototype's update():
TankBarrel.prototype.update = function() {
    mvPushMatrix();

    mvTranslate([this.offset.x, this.offset.y, this.offset.z]);

    mvRotate(this.rotation.x, [1, 0, 0]);
    mvRotate(this.rotation.z, [0, 0, 1]);
    mvRotate(this.rotation.y, [0, 1, 0]); // y must come after

    // After rotating, just move a bit more up:
    mvTranslate([0, this.relative_vertical_offset, 0]);

    // And finally change the pitch of the barrel, and move it out a bit:
    mvRotate(this.firing_angle, [1, 0, 0]);
    mvTranslate([0, 0, this.relative_forward_offset]);

    updateMatrixUniforms();

    // Need to scale *after* updating the normals matrix (normals aren't normals if they get scaled)
    // After, only updating the modelview matrix necessary.
    mvScale(this.scale.x, this.scale.y, this.scale.z);
    updateViewMatrixUniform();

    mvPopMatrix();
};