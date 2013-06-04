function Camera(tank) {
    var position = {
        x: 0,
        y: 0,
        z: 0
    };

    var rotation = {
        x: 0,
        y: 0
    };
    var cameraRotYUniform = gl.getUniformLocation(shaderProgram, "uCameraRotY");

    this.getRotation = function() {
        return rotation;
    };

    var distance_from_tank = 3;
    var angle_above_tank = 35;

    this.syncWithTank = function() {
        var tank_offset = tank.getOffset();
        var tank_turret_rotation = tank.getTurretRotation();

        rotation.y = -tank_turret_rotation.y;

        rotation.x = ( tank_turret_rotation.x * Math.cos(rotation.y * degreesToRadians) ) +
                     ( tank_turret_rotation.z * Math.sin(rotation.y * degreesToRadians) );

        var yaw = (rotation.y + 90) * degreesToRadians;
        var pitch = ((rotation.x - angle_above_tank) * degreesToRadians);

        position.x = tank_offset.x + (Math.cos(yaw) * Math.cos(pitch) * distance_from_tank);
        position.y = tank_offset.y - (Math.sin(pitch) * distance_from_tank);
        position.z = tank_offset.z + (Math.sin(yaw) * Math.cos(pitch) * distance_from_tank);
    };
    this.syncWithTank(); // initial setup
    
    this.update = function () {
        mvRotate(-rotation.x, [1, 0, 0]);
        mvRotate(rotation.y, [0, 1, 0]);
        mvTranslate([-position.x, -position.y, -position.z]);

        gl.uniform1f(cameraRotYUniform, rotation.y);
    }
}