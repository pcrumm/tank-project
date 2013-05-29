var sounds = {
    tank_idle:  {filename: 'assets/tank-idle2.ogg'},
    tank_move:  {filename: 'assets/tank-move.ogg'},
    tank_shoot: {filename: 'assets/tank-shoot.ogg'}
};

function initSounds() {
    for (var key in sounds) {
        sounds[key] = new Audio(sounds[key].filename);

        // Overloading play() allows for playing the file before it is done playing:
        sounds[key].play = function() {
            var self = this;
            self.currentTime = 0;
            self.volume=0.3;
            Audio.prototype.play.call(self);
        }
    }
}

