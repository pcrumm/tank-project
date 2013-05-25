function TankTurret(offset, y_rotation) {
    Cube.call(this,
              offset,
              {x: 0, y: y_rotation || 0, z: 0},
              {x: 0.75, y: 0.25, z: 0.75},
              textures.metal
    );
}

inheritPrototype(TankTurret, Cube);

// Overloading Shape.prototype's update():
TankTurret.prototype.update = TankBody.prototype.update;
