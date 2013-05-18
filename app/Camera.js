function Camera () {
    this.offset = {
        x: 0,
        y: 0,
        z: -10
    };
    
    this.rotation = {
        y: 0
    };
    this.cameraRotYUniform = gl.getUniformLocation(shaderProgram, "uCameraRotY");
    
    this.moveOnXAxis = function(units) {
        var yRotationInRadians = this.rotation.y * degreesToRadians;
        this.offset.x -= Math.cos(yRotationInRadians) * units;
        this.offset.z -= Math.sin(yRotationInRadians) * units;
    };
    
    this.moveOnZAxis = function(units) {
        var yRotationInRadians = this.rotation.y * degreesToRadians;
        this.offset.x -= Math.sin(yRotationInRadians) * units;
        this.offset.z += Math.cos(yRotationInRadians) * units;
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
        // TODO: Finish this, make it take care of updating translations / rotations (in drawScene)
        
        gl.uniform1f(this.cameraRotYUniform, this.rotation.y);
    }
}