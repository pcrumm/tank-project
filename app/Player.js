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
    
    this.moveForward = function() {
        camera.moveOnZAxis(units_to_move);
        tank.moveOnZAxis(units_to_move);
    };
    
    this.moveBackward = function() {
        camera.moveOnZAxis(-units_to_move);
        tank.moveOnZAxis(-units_to_move);
    };
    
    this.moveLeft = function() {
        camera.moveOnXAxis(-units_to_move);         
        tank.moveOnXAxis(-units_to_move);
    };
    
    this.moveRight = function() {
        camera.moveOnXAxis(units_to_move);                
        tank.moveOnXAxis(units_to_move);
    };
    
    var syncCameraAndTankRotation = function() {
        var yRotationInRadians = tank.rotation.y * degreesToRadians;
        camera.offset.x = tank.offset.x + (Math.sin(yRotationInRadians) * camera_distance_from_tank);
        camera.offset.z = tank.offset.z + (Math.cos(yRotationInRadians) * camera_distance_from_tank);
    };
    
    this.rotateLeft = function() {
        tank.rotateOnYAxis(-units_to_rotate);
        camera.rotateOnYAxis(-units_to_rotate);
        
        syncCameraAndTankRotation();
    }
    
    this.rotateRight = function() {
        tank.rotateOnYAxis(units_to_rotate);
        camera.rotateOnYAxis(units_to_rotate);
        
        syncCameraAndTankRotation();
    }
    
    this.update = function() {
        camera.update();
    }
}
