var express = require('express'); // This stops some error complaining

var app = express()
  , http = require('http')
  , server = http.createServer(app).listen(8080, 511, console.log('Listening on :8080'))
  , io = require('socket.io').listen(server);

  var connected_tanks = 0;
  var TANK_LIMIT = 20; // The maximum number of allowed clients

  var DEFAULT_HEALTH = 100; // The default health for each tank
  var HIT_DAMAGE = 35; // The amount of damage each hit will cause
  var HIT_SCORE = 100; // The number of points scored on each hit

// Serve all of the static files in our directory
app.use('/lib', express.static(__dirname + '/../app/lib'));
app.use('/shapes', express.static(__dirname + '/../app/shapes'));
app.use(express.static(__dirname + '/../app'));

var game_data = []; // Store all of the ongoing game data here
var projectiles = []; // Stores all projectiles
var hits = []; // Projectile hits

io.sockets.on('connection', function(socket) {
    // When a client emits "join", we'll respond with the data they need to get instantiated
    socket.on('client_join', function() {

        // See if we have room for the client...
        if (connected_tanks >= TANK_LIMIT)
        {
            socket.emit('server_full');
            socket.disconnect();
            return;
        }

        var tank_id = game_data.length;
        var tank_uniq_id = socket.id;
        game_data[tank_id] = {
            tank_id: tank_uniq_id,
            position: {x: 150+(5*tank_id*Math.pow(-1,tank_id+1)), y: 0, z: 150+(5*tank_id*Math.pow(-1,tank_id))},
            rotation: 0,
            turret_rotation: 0,
            health: DEFAULT_HEALTH,
            score: 0
        };

        console.log('Hello, ' + tank_id);
        connected_tanks++;

        // Now that we've created the default positioning information, provide it to the client
        socket.emit('welcome_client', game_data[tank_id]);

        // Tell all of the other clients to add this tank
        socket.broadcast.emit('add_tank', game_data[tank_id]);

        // Notify the client to add all of the other tanks
        for (var i = 0; i < game_data.length; i++)
        {
            if (game_data[i].tank_id != tank_uniq_id)
            {
                socket.emit('add_tank', game_data[i]);
            }
        }
    });

    // When a client tells us that its player has moved
    socket.on('update_tank_position', function(tank_id, tank_position, tank_rotation, tank_turret_rotation) {
        for (var i = 0; i < game_data.length; i++)
        {
            if (game_data[i].tank_id == tank_id)
            {
                game_data[i].position = tank_position;
                game_data[i].rotation = tank_rotation;
                game_data[i].turret_rotation = tank_turret_rotation;

                socket.broadcast.emit('tank_did_move', game_data[i]);
            }
        }
    });

    // Used to notify the client that we're heading out
    socket.on('disconnect', function() {
        var tank_id = socket.id;
        console.log('Removing ' + tank_id);
        for (var i = 0; i < game_data.length; i++)
        {
            if (game_data[i].tank_id == tank_id)
            {
                game_data.splice(i, 1);
                connected_tanks--;

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
        if (projectiles[proj_id].hits >= (connected_tanks / 2))
        {
            if (projectiles[proj_id].logged)
                return;

            projectiles[proj_id].logged = true;

            hit_tank = get_tank_by_id(tank_id);
            if (hit_tank === null)
                return;

            hit_tank.health -= HIT_DAMAGE;
            console.log(tank_id + ' has been hit! Health reduced to ' + hit_tank.health);

            proj_creator = projectiles[proj_id].creator;

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
                killer = get_tank_by_id(proj_creator);
                killer.score += HIT_SCORE;

                // Let this tank know it's dead...
                io.sockets.emit('killed', tank_id);

                // Kill it on everyone else
                io.sockets.emit('remove_tank', tank_id);
            }
        }
    });

});

function get_tank_by_id(tank_id)
{
   for (var i = 0; i < game_data.length; i++)
   {
       if (game_data[i].tank_id == tank_id)
        return game_data[i];
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