var express = require('express'); // This stops some error complaining

var app = express()
  , http = require('http')
  , server = http.createServer(app).listen(8080, 511, console.log('Listening on :8080'))
  , io = require('socket.io').listen(server);

// Serve all of the static files in our directory
app.use('/lib', express.static(__dirname + '/../app/lib'));
app.use('/shapes', express.static(__dirname + '/../app/shapes'));
app.use(express.static(__dirname + '/../app'));

var game_data = []; // Store all of the ongoing game data here

io.sockets.on('connection', function(socket) {
    // When a client emits "join", we'll respond with the data they need to get instantiated
    socket.on('client_join', function() {
        var tank_id = game_data.length;
        game_data[tank_id] = {
            tank_id: tank_id,
            position: {x: 10*tank_id, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0}
        };

        console.log('Hello, ' + tank_id);

        // Now that we've created the default positioning information, provide it to the client
        socket.emit('welcome_client', game_data[tank_id]);

        // Tell all of the other clients to add this tank
        socket.broadcast.emit('add_tank', game_data[tank_id]);

        // Notify the client to add all of the other tanks
        for (var i = 0; i < game_data.length; i++)
        {
            if (game_data[i].tank_id != tank_id)
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
                game_data[i].tank_position = tank_position;
                game_data[i].tank_rotation = tank_rotation;

                socket.broadcast.emit('tank_did_move', game_data[i]);
            }
        }
    });
});