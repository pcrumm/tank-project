function getRandInRange(min, max) {
    return (Math.random() * (max - min)) + min;
}

function copy(obj) {
    //Makes a copy of an object.
    //Code from stackoverflow.com/questions/728360
    //WHY IS THIS SO COMPLICATED.

    if (null == obj || "object" != typeof obj)
        return obj;

    if (obj instanceof Array) {
        var clone = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            clone[i] = copy(obj[i]);
        }

        return clone;
    }


    if (obj instanceof Object) {
        var clone = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i))
                clone[i] = copy(obj[i]);
        }

        return clone;
    }
}

function Emitter(offset, rotation, num_particles, acceleration, maxSpeed) {
    this.offset = offset || {x: 0, y: 0, z: 0};

    this.rotation = rotation || {x: 0, y: 0, z: 0};
    num_particles = num_particles || 100;
    this.alive = true;

    this.particles = [];

    var pull = acceleration; //Change of the velocity of the particle
    var fade;
    var speed = maxSpeed || 1;
    var vX, vY, vZ;

    for (var i = 0; i < num_particles; i++) {
        fade = getRandInRange(0, 99)/1000 + .03;

        //Set a velocity that does not go into the terrain
        //A small value is added to make sure each particle has some speed
        vX = getRandInRange(0, speed) - (.5 * speed) + .005;
        vY = getRandInRange(0, speed) - (.5 * speed) + .005;
        vZ = getRandInRange(0, speed) - (.5 * speed) + .005;

        this.particles.push(new Particle(copy(this.offset), {x: vX, y: vY, z: vZ}, pull, fade));
    }
}

Emitter.prototype.draw = function() {
    for (var i = 0; i < this.particles.length; i++)
    {
        //Make the particle face the camera
        this.particles[i].draw();
    }
};

Emitter.prototype.clean = function() {
    //Remove finished particles, and if all particles are gone, mark the emitter as dead

    for (var i = 0; i < this.particles.length; i++) {
        if (!this.particles[i].alive)
        {
            //console.log(this.particles[i].velocity);
            this.particles.splice(i, 1);
        }
    }

    if (this.particles.length == 0)
        this.alive = false;
};