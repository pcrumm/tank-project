var sounds = {
    tank_idle:  {filename: 'assets/sounds/tank-idle2.ogg'},
    tank_move:  {filename: 'assets/sounds/tank-move.ogg'},
    tank_shoot: {filename: 'assets/sounds/tank-shoot.ogg'},
    boom: {filename: 'assets/sounds/boom.ogg'}
};

function initSounds() {
    for (var key in sounds) {
        sounds[key] = new Audio(sounds[key].filename);

        // Overloading play() allows for playing the file before it is done playing:
        sounds[key].play = function() {
            var self = this;
            self.volume = 0.3;
            HTMLAudioElement.prototype.play.call(self);
            self.currentTime = 0;
        }
    }
}

