var currentlyPressedKeys = {};
var window_center_horizontal = document.body.clientWidth / 2;
var canvas_center_vertical = document.getElementById("glcanvas").offsetTop + (document.getElementById("glcanvas").height / 2)
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
    
    //I need this for testing
    if ( currentlyPressedKeys[38] ) { // Up Arrow
        player.moveUp();
    }
    if ( currentlyPressedKeys[40] ) { // Left Arrow
        player.moveDown();
    }
    
    // If any key was called that changed the player's tank's position or rotation, be sure to notify the server:
    if ( currentlyPressedKeys[65] || currentlyPressedKeys[68] || currentlyPressedKeys[87] || currentlyPressedKeys[83] ) {
        var player_tank = player.getTank();
        multiplayer.sendTankUpdate(player_tank.id, player_tank.getOffset(), player_tank.getBodyYRotation());
    };
}

var mouseInfo = {
    threshold_left:  function() { return window_center_horizontal - 30 },
    threshold_right: function() { return window_center_horizontal + 30 },
    threshold_up:    function() { return canvas_center_vertical + 10 },
    threshold_down:  function() { return canvas_center_vertical - 40 },

    looking_left:  false,
    looking_right: false,
    looking_up:    false,
    looking_down:  false,

    rotation_magnitude_horizontal: 0,
    rotation_magnitude_vertical: 0,
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

    // Handle vertical mouse movement:
    if ( event.pageY > mouseInfo.threshold_up() ) {
        mouseInfo.looking_up   = true;
        mouseInfo.looking_down = false;
        mouseInfo.rotation_magnitude_vertical = event.pageY - mouseInfo.threshold_up();
    }
    else if ( event.pageY < mouseInfo.threshold_down() ) {
        mouseInfo.looking_up   = false;
        mouseInfo.looking_down = true;
        mouseInfo.rotation_magnitude_vertical = mouseInfo.threshold_down() - event.pageY;
    }
    else {
        mouseInfo.looking_up   = false;
        mouseInfo.looking_down = false;
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

        if ( mouseInfo.looking_up ) {
            player.moveTankBarrelUp(mouseInfo.rotation_magnitude_vertical / mouseInfo.rotation_magnitude_divisor);
        }
        else if ( mouseInfo.looking_down ) {
            player.moveTankBarrelDown(mouseInfo.rotation_magnitude_vertical / mouseInfo.rotation_magnitude_divisor);
        }
    }
}
