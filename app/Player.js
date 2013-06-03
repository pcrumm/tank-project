function Player(player_tank) {
    var tank = player_tank;
    var camera = new Camera(tank);
    
    var units_to_move = 0.2;
    var units_to_rotate = 2;

    var fire_rate = 1; // shots per second
    var is_shooting = false;
    var shot_interval;
    var shot_done = true;

    this.getTank = function() {
        return tank;
    };

    this.moveForward = function() {
        tank.moveOnZAxis(units_to_move);
        camera.syncWithTank();
    };

    this.moveBackward = function() {
        tank.moveOnZAxis(-units_to_move);
        camera.syncWithTank();
    };

    var rotateTankTurretOnYAxis = function(units) {
        tank.rotateTurretOnYAxis(units);
        camera.syncWithTank();
    };

    this.rotateTankBodyLeft = function() {
        tank.rotateBodyOnYAxis(-units_to_rotate);
    };

    this.rotateTankBodyRight = function() {
        tank.rotateBodyOnYAxis(units_to_rotate);
    };

    this.rotateTankTurretLeft = function(units) {
        rotateTankTurretOnYAxis(-units);
    };

    this.rotateTankTurretRight = function(units) {
        rotateTankTurretOnYAxis(units);
    };

    this.moveTankBarrelUp = function(units) {
        tank.rotateBarrelOnXAxis(units);
    };

    this.moveTankBarrelDown = function(units) {
        tank.rotateBarrelOnXAxis(-units);
    };

    this.generateProjectile = function() {
        var tank_pitch = camera.getPitch();
        tank.generateProjectile(tank_pitch);
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
