var currentlyPressedKeys = {};

function initInputEventHandler() {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    setInterval(handleKeys, 30);
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    if ( currentlyPressedKeys[65] ) { // A
        player.moveLeft();
    }
    if ( currentlyPressedKeys[68] ) { // D
        player.moveRight();
    }
    
    if ( currentlyPressedKeys[87] ) { // W
        player.moveForward();
    }
    if ( currentlyPressedKeys[83] ) { // S
        player.moveBackward();
    }
    
    if ( currentlyPressedKeys[37] ) { // Left Arrow
        player.rotateLeft();
    }
    if ( currentlyPressedKeys[39] ) { // Right Arrow
        player.rotateRight();
    }
    
    // If any key was called that changed the player's tank's position or rotation, be sure to notify the server:
    if ( currentlyPressedKeys[65] || currentlyPressedKeys[68] || currentlyPressedKeys[87]
      || currentlyPressedKeys[83] || currentlyPressedKeys[37] || currentlyPressedKeys[39] ) {
        var player_tank = player.getTank();
        multiplayer.sendTankUpdate(player_tank.id, player_tank.offset, player_tank.rotation);
    };
}