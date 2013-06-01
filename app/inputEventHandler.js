var currentlyPressedKeys = {};
var window_center_horizontal = document.body.clientWidth / 2;
var window_in_focus = true;

function initInputEventHandler() {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    // If the window goes out of focus, turn off mouse capture, and vice versa:
    window.onblur = function() { window_in_focus = false; };
    window.onfocus = function() { window_in_focus = true; };

    window.onmouseout = function() { window_in_focus = false; };
    window.onmouseover = function() { window_in_focus = true; };

    // Fix the center if the window is resized:
    window.onresize = function() { window_center_horizontal = document.body.clientWidth / 2; };

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
    
    if ( currentlyPressedKeys[37] ) { // Left Arrow
        player.rotateTankTurretLeft(3);
    }
    if ( currentlyPressedKeys[39] ) { // Right Arrow
        player.rotateTankTurretRight(3);
    }

    if ( currentlyPressedKeys[38] || currentlyPressedKeys[81] ) { // Up Arrow and Q
        player.moveTankBarrelUp(1);
    }
    if ( currentlyPressedKeys[40] || currentlyPressedKeys[69] ) { // Down Arrow and E
        player.moveTankBarrelDown(1);
    }

    if ( currentlyPressedKeys[32] ) { // Spacebar
        player.shootOn();
        player.shootOff();
    }

    // If any key was called that changed the player's tank's position or rotation, be sure to notify the server:
    if ( currentlyPressedKeys[65] || currentlyPressedKeys[68] || currentlyPressedKeys[87] || currentlyPressedKeys[83] ) {
        var player_tank = player.getTank();
        multiplayer.sendTankUpdate(player_tank.id, player_tank.offset, player_tank.rotation);
    };
}

var mouseInfo = {
    threshold_left:  function() { return window_center_horizontal - 50 },
    threshold_right: function() { return window_center_horizontal + 50 },

    looking_left:  false,
    looking_right: false,

    rotation_magnitude_horizontal: 0,
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
    // Handle horizontal mouse movement:
    if ( event.pageX < mouseInfo.threshold_left() ) {
        mouseInfo.looking_left  = true;
        mouseInfo.looking_right = false;
        mouseInfo.rotation_magnitude_horizontal = mouseInfo.threshold_left() - event.pageX;
    }
    else if ( event.pageX > mouseInfo.threshold_right() ) {
        mouseInfo.looking_left  = false;
        mouseInfo.looking_right = true;
        mouseInfo.rotation_magnitude_horizontal = event.pageX - mouseInfo.threshold_right();
    }
    else {
        mouseInfo.looking_left  = false;
        mouseInfo.looking_right = false;
    }
}

function handleMouse() {
    if ( window_in_focus ) {
        if ( mouseInfo.looking_left ) {
            player.rotateTankTurretLeft(mouseInfo.rotation_magnitude_horizontal / mouseInfo.rotation_magnitude_divisor);
        }
        else if ( mouseInfo.looking_right ) {
            player.rotateTankTurretRight(mouseInfo.rotation_magnitude_horizontal / mouseInfo.rotation_magnitude_divisor);
        }
    }
}
