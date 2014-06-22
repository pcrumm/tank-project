function Multiplayer() {
    var socket = io.connect(document.URL);
    var time_since_last_sent_update = new Date();

    // Client calls this to indicate to the server that a tank's position/rotation has changed:
    this.sendTankUpdate = function(tank_id, tank_position, tank_rotation, tank_turret_rotation) {
        var now = new Date();

        // Only send an update if 30ms or more have elapsed since last update:
        if ( (now - time_since_last_sent_update) > 30 ) {
            socket.emit('update_tank_position', tank_id, tank_position, tank_rotation, tank_turret_rotation);
            time_since_last_sent_update = new Date();
        }
    };

    this.fire = function(offset, velocity, tank_id, proj_id) {
        socket.emit('projectile_fired', offset, velocity, tank_id, proj_id);
    };

    this.tankHit = function(tank_id, proj_id) {
        socket.emit('projectile_hit', tank_id, proj_id);
    };

    // Sets up a connection with our node server. Returns the tank's unique identifier.
    this.initConnection = function() {
        socket.emit('client_join');
    };

    // Maintain privacy with var
    var endGame = function(cause) {
        $('#glcanvas').detach();
        $('#instructions').hide();
        $('#health').hide();

        if (cause === 'server_full') {
            $('#server_full_error').fadeIn('slow');
        }
        else if (cause === 'client_dead') {
            $('#client_dead').fadeIn('slow');
            sounds.sad_death.play();
        }
        else {
            // This function may get called multiple times, this will prevent
            // multiple error messages being shown
            if ($('#server_full_error').is(':hidden') && $('#client_dead').is(':hidden')) {
                $('#server_error').fadeIn('slow');
            }
        }

        socket.disconnect();
    };

    // Listeners
    socket.on('connect', function()
    {
        // Used to setup a new client on the server
        socket.on('welcome_client', function(tank_data) {
            tanks[0] = new Tank(tank_data.position, tank_data.rotation);
            tanks[0].adaptToTerrain();
            tanks[0].id = tank_data.tank_id;
            player = new Player(tanks[0]);

            showGame();

            // Let the server know the tank's new position in light of the adjustment above
            socket.emit('update_tank_position', tanks[0].id, tanks[0].getOffset(), tanks[0].getBodyYRotation());

            // Create heartbeat:
            setInterval(function heartbeat() {
                socket.emit('heartbeat', tanks[0].id, function handleServerResponse(message) {
                    // If the server did not acknowledge, kill the game:
                    if (message !== 'success') {
                        endGame('error');
                    }
                });
            }, 1000);
        });

        // Used to add a new third-party tank.
        socket.on('add_tank', function(tank_data) {
            if (tanks[0].id != tank_data.tank_id)
            {
                var length = tanks.length;
                tanks[length] = new Tank(tank_data.position, tank_data.rotation);
                tanks[length].id = tank_data.tank_id;
            }
        });

        // Used to track tank movement and update health
        socket.on('tank_did_move', function(tank_data) {
            if (tanks[0].id != tank_data.tank_id) // Ignore self reports
            {
                updateTankPosition(tank_data.tank_id, tank_data.position, tank_data.rotation, tank_data.turret_rotation, tank_data.health);
            }
        });

        // Used to remove a tank that's appearing, like when a client quits
        socket.on('remove_tank', function(tank_id) {
            for (var i = 0; i < tanks.length; i++)
                if (tanks[i].id == tank_id)
                {
                    tanks.remove(i);
                    break;
                }
        });

        // Used to notify a client there's no room for them to join. At this point, they aren't connected
        socket.on('server_full', function() {
            endGame('server_full');
        });

        // Used to notify a client to draw a projectile. Ignore if we're the owner
        socket.on('fire_projectile', function(offset, velocity, tank_id, proj_id) {
            if (player.getTank().id == tank_id)
                return;

            projectiles.push(new Projectile(offset, velocity, tank_id, proj_id));
        });

        // Used to let us know we're dead...
        socket.on('killed', function(tank_id) {
            if (player.getTank().id != tank_id)
                return;

            endGame('client_dead');
        });

        // Let us know when we're hit
        socket.on('hit', function(tank_id, tank_health) {
            updateTankHealth(tank_id, tank_health);

            if (player.getTank().id === tank_id)
                player.playerHit();
        });

        socket.on('score', function(tank_id, score) {

            if (player.getTank().id == tank_id)
                updateScoreScreen(score);

            for (var i = 0; i < tanks.length; i++) {
                if (tanks[i].id == tank_id ) {
                    tanks[i].score = score;
                    return true;
                }
            }
        });
    });

    // Disconnected from server:
    socket.on('disconnect', function() {
        endGame('error');
    });
}
