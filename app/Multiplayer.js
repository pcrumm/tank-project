function Multiplayer() {
    // Client calls this to indicate to the server that a tank's position/rotation has changed:
    this.sendTankUpdate = function(tank_id, tank_position, tank_rotation) {
        // TODO: Phil needs to write this
        return false;
    };
    
    // Receives from the server an updated position/rotation of a tank, and thus updates that tank for the client:
    this.receiveTankUpdate = function() {                
        // TODO: need a way to fetch a pending packet that will contain the to-be-updated tank's information.
        //       for now, there will just be dummy variables:
        var tank_id = -1, tank_position = {x: 0, y: 0, z: 0}, tank_rotation = {x: 0, y: 0, z: 0};
        
        for (var i = 0; i < tanks.length; i++) {
            if (tanks[i].id == tank_id) {
                tanks[i].offset = tank_position;
                tanks[i].rotation = tank_rotation;
                return true;
            }
        }
        
        return false;
    };
}