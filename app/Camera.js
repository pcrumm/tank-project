function Camera() {
    this.offset = {
        x: 0,
        y: 0,
        z: 0
    };
    
    this.rotation = {
        y: 0
    };
    var cameraRotYUniform = gl.getUniformLocation(shaderProgram, "uCameraRotY");
    
    this.moveOnXAxis = function(units) {
        var yRotationInRadians = this.rotation.y * degreesToRadians;
        this.offset.x += Math.cos(yRotationInRadians) * units;
        this.offset.z += Math.sin(yRotationInRadians) * units;
    };
    
    this.moveOnZAxis = function(units) {
        var yRotationInRadians = this.rotation.y * degreesToRadians;
        this.offset.x += Math.sin(yRotationInRadians) * units;
        this.offset.z -= Math.cos(yRotationInRadians) * units;
    };
    
    this.moveOnYAxis = function(units) {
        this.offset.y += units;
    };
    
    this.rotateOnYAxis = function(units) {
        this.rotation.y += units;
        
        if ( this.rotation.y > 360.0 ) {
            this.rotation.y -= 360.0;
        }
        if ( this.rotation.y < -360.0 ) {
            this.rotation.y += 360.0;
        }
    }
    
    this.update = function () {
        mvRotate(this.rotation.y, [0, 1, 0]);
        mvTranslate([-this.offset.x, -this.offset.y, -this.offset.z]);
        
        gl.uniform1f(cameraRotYUniform, this.rotation.y);
    }
}