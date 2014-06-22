var express = require('express'); // This stops some error complaining

var app = express()
  , http = require('http')
  , server = http.createServer(app).listen(8080, 511, console.log('Listening on :8080'))
  , io = require('socket.io').listen(server);

var TANK_LIMIT = 10; // The maximum number of allowed clients
var CLIENT_TIMEOUT = 5000; // Client times out if no heartbeat in past 5000 milliseconds

var DEFAULT_HEALTH = 100; // The default health for each tank
var HIT_DAMAGE = 20; // The amount of damage each hit will cause
var HIT_SCORE = 100; // The number of points scored on each hit
var KILL_SCORE = 900; // The number of points scored on each kill

// Serve all of the static files in our directory
app.use('/lib', express.static(__dirname + '/../app/lib'));
app.use('/shapes', express.static(__dirname + '/../app/shapes'));
app.use(express.static(__dirname + '/../app'));

var tanks = []; // Stores all tanks
var projectiles = []; // Stores all projectiles
var hits = []; // Projectile hits

// Remove a tank from the tanks array if it hasn't checked in within CLIENT_TIMEOUT:
setInterval(function checkForDisconnects() {
    var current_time = (new Date()).getTime();
    for (var i = 0; i < tanks.length; i++) {
        if (current_time - tanks[i].last_checkin.getTime() > CLIENT_TIMEOUT) {
            io.sockets.emit('remove_tank', tanks[i].tank_id);
            tanks.splice(i, 1);
        }
    }
}, CLIENT_TIMEOUT);

io.sockets.on('connection', function(socket) {
    // When a client emits "join", we'll respond with the data they need to get instantiated
    socket.on('client_join', function() {

        // See if we have room for the client...
        if (tanks.length >= TANK_LIMIT)
        {
            socket.emit('server_full');
            socket.disconnect();
            return;
        }

        var new_tank_index = tanks.length
        var tank_id = socket.id;
        tanks[new_tank_index] = {
            tank_id: tank_id,
            position: {x: 150+(2.5*new_tank_index*Math.pow(-1,new_tank_index+1)), y: 0, z: 150+(2.5*new_tank_index*Math.pow(-1, new_tank_index))},
            rotation: 0,
            turret_rotation: 0,
            health: DEFAULT_HEALTH,
            score: 0,
            last_checkin: new Date()
        };

        // Now that we've created the default positioning information, provide it to the client
        socket.emit('welcome_client', tanks[new_tank_index]);

        // Tell all of the other clients to add this tank
        socket.broadcast.emit('add_tank', tanks[new_tank_index]);

        // Notify the client to add all of the other tanks
        for (var i = 0; i < tanks.length; i++)
        {
            if (tanks[i].tank_id != tank_id)
            {
                socket.emit('add_tank', tanks[i]);
            }
        }
    });

    socket.on('heartbeat', function(tank_id, callback) {
        for (var i = 0; i < tanks.length; i++) {
            if (tanks[i].tank_id === tank_id) {
                tanks[i].last_checkin = new Date();
                callback('success');
                return;
            }
        }

        // Otherwise:
        callback('error');
    });

    // When a client tells us that its player has moved
    socket.on('update_tank_position', function(tank_id, tank_position, tank_rotation, tank_turret_rotation) {
        for (var i = 0; i < tanks.length; i++)
        {
            if (tanks[i].tank_id == tank_id)
            {
                tanks[i].position = tank_position;
                tanks[i].rotation = tank_rotation;
                tanks[i].turret_rotation = tank_turret_rotation;

                socket.broadcast.emit('tank_did_move', tanks[i]);
            }
        }
    });

    // Used to notify the client that we're heading out
    socket.on('disconnect', function() {
        var tank_id = socket.id;
        console.log('Removing ' + tank_id);
        for (var i = 0; i < tanks.length; i++)
        {
            if (tanks[i].tank_id == tank_id)
            {
                tanks.splice(i, 1);
                break;
            }
        }

        socket.broadcast.emit('remove_tank', tank_id);
    });

    // When a client tells us a projectile is fired
    socket.on('projectile_fired', function(offset, velocity, tank_id, proj_id) {
        clean_projectiles(); // Prevent memory bloating

        projectiles[proj_id] = {
            position: offset,
            speed: velocity,
            creator: tank_id,
            created: new Date(),
            id: proj_id,
            hits: 0,
            logged: false
        };

        // Let everyone else know
        socket.broadcast.emit('fire_projectile', offset, velocity, tank_id, proj_id);
    });

    socket.on('projectile_hit', function(tank_id, proj_id) {
        if (projectiles[proj_id] === null)
            return;

        projectiles[proj_id].hits++;

        // If more than half the clients report a hit, it counts
        if (projectiles[proj_id].hits >= (tanks.length / 2))
        {
            if (projectiles[proj_id].logged)
                return;

            projectiles[proj_id].logged = true;

            hit_tank = get_tank_by_id(tank_id);
            if (hit_tank === null)
                return;

            hit_tank.health -= HIT_DAMAGE;
            console.log(tank_id + ' has been hit! Health reduced to ' + hit_tank.health);

            io.sockets.emit('hit', tank_id, hit_tank.health);

            proj_creator = projectiles[proj_id].creator;
            killer = get_tank_by_id(proj_creator);

            if (tank_id != killer)
            {
                killer.score += HIT_SCORE;
                io.sockets.emit('score', killer.tank_id, killer.score);
            }


            // Remove this projectile from the list so we don't double-count
            for (var i = 0; i < projectiles.length; i++)
            {
                if (projectiles[i].id == proj_id)
                    projectiles.splice(i, 1);
            }

            // Deal with a kill
            if (hit_tank.health <= 0)
            {
                // Increment the score for the killer
                killer.score += KILL_SCORE;

                // Let this tank know it's dead...
                io.sockets.emit('killed', tank_id);

                // Let tanks update score
                io.sockets.emit('score', killer.tank_id, killer.score);

                // Kill it on everyone else
                io.sockets.emit('remove_tank', tank_id);
            }
        }
    });

});

function get_tank_by_id(tank_id)
{
   for (var i = 0; i < tanks.length; i++)
   {
       if (tanks[i].tank_id == tank_id)
        return tanks[i];
   }

   return null;
}

// Clean up any projectiles that are more than half a second old
function clean_projectiles()
{
    var now = new Date();
    for (var i = 0; i < projectiles.length; i++)
    {
        if (now - projectiles[i].created > 500)
        {
            projectiles.splice(i, 1);
            i = 1;
        }
    }
}
