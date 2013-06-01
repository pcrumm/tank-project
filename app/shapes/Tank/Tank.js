function Tank(offset, y_rotation) {
    var body = new TankBody(offset, y_rotation);
    var turret = new TankTurret(offset, y_rotation);

    this.adaptToTerrain = function() {
        var terrain_info = terrain.getMapHeightAndSlope(body.offset.x, body.offset.z);
        body.offset.y = terrain_info.y;
        turret.offset = body.offset;

        body.rotation.x = turret.rotation.x = terrain_info.slope.rotation_around_x;
        body.rotation.z = turret.rotation.z = terrain_info.slope.rotation_around_z;
    };
    this.adaptToTerrain(); // initial setup

    this.getOffset = function() {
        return body.offset;
    };

    this.getBodyYRotation = function() {
        return body.rotation.y;
    };

    this.getBodyRotation = function() {
        return body.rotation;
    };

    this.getTurretYRotation = function() {
        return turret.rotation.y;
    };

    this.moveOnXAxis = function(units) {
        body.moveOnXAxis(units);
        this.adaptToTerrain();
    };

    this.moveOnZAxis = function(units) {
        body.moveOnZAxis(units);
        this.adaptToTerrain();
    };

    this.placeOnTerrain = function() {
        this.adaptToTerrain();
    };

    this.rotateBodyOnYAxis = function(units) {
        body.rotateOnYAxis(units);
    };

    this.rotateTurretOnYAxis = function(units) {
        turret.rotateOnYAxis(units);
    };

    this.setPositionAndRotation = function(pos, y_rot) {
        body.offset = pos;
        body.rotation.y = y_rot;
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
