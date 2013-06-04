var gravity = -9.81;

function Projectile(offset, velocity, tank_id, proj_id) {
    Sphere.call(this,
                offset,
                {x: 0, y: 0, z: 0},
                {x: 0.2, y: 0.2, z: 0.2},
                textures.projectile
    );

    this.is_alive = true;
    this.velocity = velocity;
    this.time = 0;
    this.initial_y = offset.y;
    this.mass_constant = 5;
    this.owner = tank_id;
    this.id = proj_id || randString();
}

inheritPrototype(Projectile, Sphere);

Projectile.prototype.checkForCollisions = function() {
    // Only check for collisions after a little bit:
    if ( this.time < 0.06 ) {
        return;
    }

    // Check for terrain (or water) collision:
    var terrain_height = (terrain.getMapHeightAndSlope(this.offset.x, this.offset.z)).y;
    if ( this.offset.y <= terrain_height ) {
        // Hit or below water:
        if ( this.offset.y <= terrain.displacement.vertical ) {
            this.offset.y = terrain.displacement.vertical;
        }
        else {
            this.offset.y = terrain_height;
        }

        this.update = Shape.prototype.update; // No more physics updates necessary
        explosion.generate(this.offset, 'small');
        this.is_alive = false;
        return;
    }

    // Check for collisions with a tank:
    var tank_bounding_sphere_radius = 1.5; // a little generous, to make shooting a bit easier
    for (var i = 0; i < tanks.length; i++) {
        var tank_offset = tanks[i].getOffset();
        var distance_between_centers = Math.sqrt(
            Math.pow(tank_offset.x - this.offset.x, 2) +
            Math.pow(tank_offset.y - this.offset.y, 2) +
            Math.pow(tank_offset.z - this.offset.z, 2)
        );

        if ( distance_between_centers < (tank_bounding_sphere_radius + this.scale.x) ) {
            this.update = Shape.prototype.update; // No more physics updates necessary
            explosion.generate(this.offset, 'big');
            multiplayer.tankHit(tanks[i].id, this.id);
            this.is_alive = false;
            return;
        }
    }
};

Projectile.prototype.update = function() {
    this.offset.x += this.velocity.x;
    this.offset.z += this.velocity.z;

    // Basics physics equation:
    // x = x_0 + v_0t + (1/2)at^2
    this.time += 0.03;
    this.offset.y = this.initial_y +
        (this.velocity.y * this.time) +
        (0.5 * gravity * this.mass_constant * this.time * this.time);

    this.checkForCollisions();

    Shape.prototype.update.call(this);
};
