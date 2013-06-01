var express = require('express'); // This stops some error complaining

var app = express()
  , http = require('http')
  , server = http.createServer(app).listen(8081, 511, console.log('Listening on :8080'))
  , io = require('socket.io').listen(server);

  var connected_tanks = 0;
  var TANK_LIMIT = 20; // The maximum number of allowed clients
  var DEFAULT_HEALTH = 100; // The default health for each tank
  var HIT_DAMAGE = 35; // The amount of damage each hit will cause

// Serve all of the static files in our directory
app.use('/lib', express.static(__dirname + '/../app/lib'));
app.use('/shapes', express.static(__dirname + '/../app/shapes'));
app.use(express.static(__dirname + '/../app'));

var game_data = []; // Store all of the ongoing game data here
var projectiles = []; // Stores all projectiles

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
            health: DEFAULT_HEALTH
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
    socket.on('update_tank_position', function(tank_id, tank_position, tank_rotation) {
        for (var i = 0; i < game_data.length; i++)
        {
            if (game_data[i].tank_id == tank_id)
            {
                game_data[i].position = tank_position;
                game_data[i].rotation = tank_rotation;

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
            id: proj_id
        };
        // Let everyone else know
        socket.broadcast.emit('fire_projectile', offset, velocity, tank_id, proj_id);
    });

});

function get_tank_by_id(tank_id)
{
   for (var i = 0; i < game_data.length; i++)
   {
       if (game_data[i].tank_id == tank_id)
        return game_data[i];
       return null;
   }
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