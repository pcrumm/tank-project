var sounds = {
    tank_idle:  {filename: 'assets/sounds/tank-idle2.ogg'},
    tank_move:  {filename: 'assets/sounds/tank-move.ogg'},
    tank_shoot: {filename: 'assets/sounds/tank-shoot.ogg'},
    boom: {filename: 'assets/sounds/boom.ogg'},
    sad_death: {filename: 'assets/sounds/sadtrombone.mp3'}
};

function initSounds() {
    for (var key in sounds)
    {    
        sounds[key] = new Audio(sounds[key].filename);
        
        // Overloading play() allows for playing the file before it is done playing:
        
        sounds[key].play = function(volume, loop)
        {
            var self = this;
            
            if (volume) self.volume = volume;
            HTMLAudioElement.prototype.play.call(self);

            if (loop)
            {
               self.addEventListener('ended', function(){
                    this.currentTime = 0;
                    HTMLAudioElement.prototype.play.call(self);
                }, false);
            }
            else
                self.currentTime = 0;
        }
    }
    sounds['tank_shoot'].volume = 0.3;
    sounds['boom'].volume = 0.5;
}
