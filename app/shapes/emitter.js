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

function getNormal(x, z) {
    var x1, z1;

    if (x > .01)
        x1 = x - .01;

    else
        x1 = x + .01;

    if (z > .01)
        z = z - .01;

    else
        z = z + .01;

    var y = terrain.getMapHeightAndSlope(x, z);
    var y1 = terrain.getMapHeightAndSlope(x1, z);
    var y2 = terrain.getMapHeightAndSlope(x, z1);

    var curr = $V([x, y, z]);
    var c1   = $V([x1, y1, z]);
    var c2   = $V([x, y2, z1]);

    var normal =  (c1.subtract(curr)).cross(c2.subtract(curr));

    normal = normal.toUnitVector();

    return {x: normal.x, y: normal.y, z: normal.z};
}

function angleBetween(vec1, vec2) {
    //Returns the angle between 2 vectors in radians
    var dot = (vec1.x * vec2.x) + (vec1.y * vec2.y) + (vec1.z * vec2.z);

    var mag1 = Math.sqrt((vec1.x * vec1.x) + (vec1.y * vec1.y) + (vec1.z * vec1.z));

    var mag2 = Math.sqrt((vec2.x * vec2.x) + (vec2.y * vec2.y) + (vec2.z * vec2.z));

    return Math.acos(dot / (mag1 * mag2));
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
    var angle;

    for (var i = 0; i < num_particles; i++) {
        fade = getRandInRange(0, 99)/1000 + .03;

        //Set a velocity that does not go into the terrain
        //A small value is added to make sure each particle has some speed
        do {
        vX = getRandInRange(0, speed) - (.5 * speed) + .005;
        vY = getRandInRange(0, speed) - (.5 * speed) + .005;
        vZ = getRandInRange(0, speed) - (.5 * speed) + .005;

        angle = angleBetween( {x: vX, y: vY, z: vZ}, getNormal(this.offset.x, this.offset.z) );
        } while (angle > Math.PI);

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