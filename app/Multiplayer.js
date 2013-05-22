function Multiplayer() {
    var socket = io.connect('http://localhost:8080');
    var time_since_last_sent_update = new Date();

    // Client calls this to indicate to the server that a tank's position/rotation has changed:
    this.sendTankUpdate = function(tank_id, tank_position, tank_rotation) {
        var now = new Date();

        if ( (now - time_since_last_sent_update) > 30 ) {
            socket.emit('update_tank_position', tank_id, tank_position, tank_rotation);
            time_since_last_sent_update = new Date();
            return true;
        }

        return false;
    };

    // Sets up a connection with our node server. Returns the tank's unique identifier.
    this.initConnection = function() {
        socket.emit('client_join');
    };

    // Listeners
    socket.on('connect', function()
    {
        // Used to setup a new client on the server
        socket.on('welcome_client', function(tank_data) {
            tanks[0] = new Tank(tank_data.position, tank_data.rotation, {x: 1, y: 1, z: 1});
            tanks[0].id = tank_data.tank_id;
            player = new Player(tanks[0]);
        });

        // Used to add a new third-party tank.
        socket.on('add_tank', function(tank_data) {
            if (tanks[0].id != tank_data.tank_id)
            {
                var length = tanks.length;
                tanks[length] = new Tank(tank_data.position, tank_data.rotation, {x: 1, y: 1, z: 1});
                tanks[length].id = tank_data.tank_id;
            }
        });

        socket.on('tank_did_move', function(tank_data) {
            if (tanks[0].id != tank_data.tank_id) // Ignore self reports
            {
                updateTank(tank_data.tank_id, tank_data.tank_position, tank_data.tank_rotation);
            }
        });
    });
}