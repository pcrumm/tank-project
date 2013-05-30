function Tank(offset, y_rotation) {
    var body = new TankBody(offset, y_rotation);
    var turret = new TankTurret(offset, y_rotation);

    var adaptToTerrain = function() {
        var terrain_info = terrain.getMapHeightAndSlope(body.offset.x, body.offset.z);

        body.offset.y = terrain_info.y;
        turret.setOffset(body.offset);

        body.rotation.x = terrain_info.slope.rotation_around_x;
        body.rotation.z = terrain_info.slope.rotation_around_z;
        turret.setRotation({x: body.rotation.x, y: null, z: body.rotation.z});
    };
    adaptToTerrain(); // initial setup

    this.getOffset = function() {
        return body.offset;
    };

    this.getBodyYRotation = function() {
        return body.rotation.y;
    };

    this.getTurretYRotation = function() {
        return turret.rotation.y;
    };

    this.moveOnXAxis = function(units) {
        body.moveOnXAxis(units);
        setTurretOffset();
    };

    this.moveOnZAxis = function(units) {
        body.moveOnZAxis(units);
        adaptToTerrain();
    };

    this.rotateBodyOnYAxis = function(units) {
        body.rotateOnYAxis(units);
    };

    this.rotateTurretOnYAxis = function(units) {
        turret.rotateOnYAxis(units);
    };

    this.rotateBarrelOnXAxis = function(units) {
        turret.rotateBarrelOnXAxis(units);
    };

    this.update = function() {
        body.update();
        turret.update();
    };

    this.draw = function() {
        body.draw();
        turret.draw();
    };
}
