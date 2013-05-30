function TankTurret(offset, y_rotation) {
    Cube.call(this,
              offset,
              {x: 0, y: y_rotation || 0, z: 0},
              {x: 0.75, y: 0.25, z: 0.75},
              textures.metal
    );

    // This is how far the tank turret must be translated "up" after rotation to be on top of the tank body:
    this.relative_vertical_offset = 0.55;

    this.barrel = new TankBarrel(offset, y_rotation);
}

inheritPrototype(TankTurret, Cube);

TankTurret.prototype.setOffset = function(offset) {
    this.offset.x = this.barrel.offset.x = offset.x || this.offset.x;
    this.offset.y = this.barrel.offset.y = offset.y || this.offset.y;
    this.offset.z = this.barrel.offset.z = offset.z || this.offset.z;
}

TankTurret.prototype.setRotation = function(rotation) {
    this.rotation.x = this.barrel.rotation.x = rotation.x || this.rotation.x;
    this.rotation.y = this.barrel.rotation.y = rotation.y || this.rotation.y;
    this.rotation.z = this.barrel.rotation.z = rotation.z || this.rotation.z;
}

TankTurret.prototype.rotateOnYAxis = function(units) {
    Cube.prototype.rotateOnYAxis.call(this, units);
    this.barrel.rotateOnYAxis(units);
}

TankTurret.prototype.rotateBarrelOnXAxis = function(units) {
    var new_angle = this.barrel.firing_angle + units;

    if ( new_angle < 45 && new_angle > 0 ) {
        this.barrel.firing_angle = new_angle;
    }
};

TankTurret.prototype.draw = function() {
    Shape.prototype.draw.call(this);

    this.barrel.draw();
};

// Overloading Shape.prototype's update():
TankTurret.prototype.update = TankBody.prototype.update;
