function Tank(offset, y_rotation) {
    
    var body = new TankBody(offset, y_rotation);
    var turret;
    
    this.getOffset = function() {
        return body.offset;
    };
    
    this.getBodyYRotation = function() {
        return body.rotation.y;
    };
    
    this.moveOnXAxis = function(units) {
        body.moveOnXAxis(units);
    };
    
    this.moveOnZAxis = function(units) {
        body.moveOnZAxis(units);
    };
    
    this.rotateOnYAxis = function(units) {
        body.rotateOnYAxis(units);
    };
    
    this.update = function() {
        body.update();
    };
    
    this.draw = function() {
        body.draw();
    };
}
