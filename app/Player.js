function Player(player_tank) {
    var tank = player_tank;

    var camera = new Camera();
    var camera_distance_from_tank = 6;
    camera.offset.z = camera_distance_from_tank;
    camera.offset.y = 1.5;

    var units_to_move = 0.5;
    var units_to_rotate = 3;

    this.getTank = function() {
        return tank;
    };

    var syncCameraAndTankTurretRotation = function() {
        var y_rotation_in_rads = tank.getTurretYRotation() * degreesToRadians;
        var tank_offset = tank.getOffset();
        camera.offset.x = tank_offset.x + (Math.sin(y_rotation_in_rads) * camera_distance_from_tank);
        camera.offset.z = tank_offset.z + (Math.cos(y_rotation_in_rads) * camera_distance_from_tank);
    };

    this.moveForward = function() {
        camera.moveOnZAxis(units_to_move);
        tank.moveOnZAxis(units_to_move);

        syncCameraAndTankTurretRotation();
    };

    this.moveBackward = function() {
        camera.moveOnZAxis(-units_to_move);
        tank.moveOnZAxis(-units_to_move);

        syncCameraAndTankTurretRotation();
    };

    this.rotateTankBodyLeft = function() {
        tank.rotateBodyOnYAxis(-units_to_rotate);
    }

    this.rotateTankBodyRight = function() {
        tank.rotateBodyOnYAxis(units_to_rotate);
    }

    this.rotateTankTurretLeft = function() {
        tank.rotateTurretOnYAxis(-units_to_rotate);
        camera.rotateOnYAxis(-units_to_rotate);

        syncCameraAndTankTurretRotation();
    }

    this.rotateTankTurretRight = function() {
        tank.rotateTurretOnYAxis(units_to_rotate);
        camera.rotateOnYAxis(units_to_rotate);

        syncCameraAndTankTurretRotation();
    }

    this.update = function() {
        camera.update();
    }
}
