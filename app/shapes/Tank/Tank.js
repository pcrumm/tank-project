function Tank(offset, y_rotation) {

    var body = new TankBody(offset, y_rotation);
    var turret = new TankTurret({x: offset.x, y: offset.y + 0.5, z: offset.z}, y_rotation);

    var setTurretOffset = function() {
        turret.offset = {x: body.offset.x, y: body.offset.y + 0.5, z: body.offset.z};
    };

    this.getOffset = function() {
        return body.offset;
    };

    this.getBodyYRotation = function() {
        return body.rotation.y;
    };

    this.moveOnXAxis = function(units) {
        body.moveOnXAxis(units);
        setTurretOffset();
    };

    this.moveOnZAxis = function(units) {
        body.moveOnZAxis(units);
        setTurretOffset();
    };

    this.rotateOnYAxis = function(units) {
        body.rotateOnYAxis(units);
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
