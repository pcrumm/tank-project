function Player(player_tank) {
    var tank = player_tank;

    var camera = new Camera();
    var camera_distance_from_tank = 6;
    camera.offset.z = camera_distance_from_tank;
    camera.offset.y = 1.5;

    var units_to_move = 0.1;
    var units_to_rotate = 2;

    var fire_rate = 1; // shots per second
    var is_shooting = false;
    var shot_interval;
    var shot_done = true;

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
    };

    this.rotateTankBodyRight = function() {
        tank.rotateBodyOnYAxis(units_to_rotate);
    };

    var rotateTankTurretOnYAxis = function(units) {
        tank.rotateTurretOnYAxis(units);
        camera.rotateOnYAxis(units);

        syncCameraAndTankTurretRotation();
    };

    this.rotateTankTurretLeft = function(units) {
        rotateTankTurretOnYAxis(-units);
    };

    this.rotateTankTurretRight = function(units) {
        rotateTankTurretOnYAxis(units);
    };

    this.generateProjectile = function() {
        var tank_offset = tank.getOffset();

        var y_rotation_in_rads = tank.getTurretYRotation() * degreesToRadians;
        var projectile_velocity = {x: -Math.sin(y_rotation_in_rads), y: 0, z: -Math.cos(y_rotation_in_rads)};

        shapes.push(new Projectile({x: tank_offset.x, y: tank_offset.y + 0.3, z: tank_offset.z}, projectile_velocity));

        sounds.tank_shoot.play();
    };

    this.shootOn = function () {
        if (!is_shooting)
        {
            is_shooting = true;
            if (shot_done)
            {
                // prevents spamming to fire faster than fire_rate
                shot_done = false;
                this.generateProjectile();
                setTimeout(function() {shot_done = true;}, 1000/fire_rate);
            }
            shot_interval = setInterval(this.generateProjectile, 1000/fire_rate);
        }
    };
    
    this.shootOff = function () {
        if (is_shooting)
        {
            is_shooting = false;
            clearInterval(shot_interval);
        }
    };

    this.update = function() {
        camera.update();
    };
}
