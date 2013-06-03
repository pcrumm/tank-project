function getRandInRange(min, max) {
    return (Math.random() * (max - min)) + min;
}

function Emitter(offset, rotation, num_particles, acceleration, lifespan) {
    this.offset = offset || {x: 0, y: 0, z: 0};
    this.rotation = rotation || {x: 0, y: 0, z: 0};
    num_particles = num_particles || 100;
    this.alive = true;

    this.particles = [];

    var pull = acceleration; //Change of the velocity of the particle
    var fade;
    var velocity = {x: 0, y: 0, z: 0};
    var p;

    for (var i = 0; i < num_particles; i++) {
        fade = getRandInRange(0, 99)/1000 + .003;

        //Set a velocity that does not go into the terrain
        velocity.x = getRandInRange(0, .5) - .25 + .0005;
        velocity.y = getRandInRange(0, .5) - .25 + .0005;
        velocity.z = getRandInRange(0, .5) - .25 + .0005;

        p = new Particle(offset, velocity, pull, fade, lifespan)
        this.particles.push(p);
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
            this.particles.splice(i, 1);
    }

    if (this.particles.length == 0)
        this.alive = false;
};