var currentlyPressedKeys = {};

function initInputEventHandler() {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    setInterval(handleKeys, 30);
    setInterval(handleMouse, 30);
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    if ( currentlyPressedKeys[65] ) { // A
        player.rotateTankBodyLeft();
    }
    if ( currentlyPressedKeys[68] ) { // D
        player.rotateTankBodyRight();
    }

    if ( currentlyPressedKeys[87] ) { // W
        player.moveForward();
    }
    if ( currentlyPressedKeys[83] ) { // S
        player.moveBackward();
    }

    // If any key was called that changed the player's tank's position or rotation, be sure to notify the server:
    if ( currentlyPressedKeys[65] || currentlyPressedKeys[68] || currentlyPressedKeys[87] || currentlyPressedKeys[83] ) {
        var player_tank = player.getTank();
        multiplayer.sendTankUpdate(player_tank.id, player_tank.getOffset(), player_tank.getBodyYRotation());
    };
}

var mouseInfo = {
    center: 320,
    threshold_left:  290, // center - 30
    threshold_right: 350, // center + 30

    looking_left:  false,
    looking_right: false,

    rotation_magnitude: 0,
    rotation_magnitude_divisor: 100
};

function handleMouseDown(event) {
    if (event.which == 1) // left click
        player.shootOn();
}

function handleMouseUp(event) {
    if (event.which == 1) // left click
        player.shootOff();
}

function handleMouseMove(event) {
    if ( event.pageX < mouseInfo.threshold_left ) {
        mouseInfo.looking_left  = true;
        mouseInfo.looking_right = false;
        mouseInfo.rotation_magnitude = mouseInfo.threshold_left - event.pageX;
    }
    else if ( event.pageX > mouseInfo.threshold_right ) {
        mouseInfo.looking_left  = false;
        mouseInfo.looking_right = true;
        mouseInfo.rotation_magnitude = event.pageX - mouseInfo.threshold_right;
    }
    else {
        mouseInfo.looking_left  = false;
        mouseInfo.looking_right = false;
    }
}

function handleMouse() {
    if ( mouseInfo.looking_left ) {
        player.rotateTankTurretLeft(mouseInfo.rotation_magnitude / mouseInfo.rotation_magnitude_divisor);
    }
    else if ( mouseInfo.looking_right ) {
        player.rotateTankTurretRight(mouseInfo.rotation_magnitude / mouseInfo.rotation_magnitude_divisor);
    }
}
