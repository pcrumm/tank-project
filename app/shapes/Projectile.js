var gravity = -9.81;
//var gravity = 0;
var SHELLS_STAY_ON_GROUND = true;

function Projectile(offset, velocity) {
    Sphere.call(this,
                offset,
                {x: 0, y: 0, z: 0},
                {x: 0.2, y: 0.2, z: 0.2},
                textures.projectile
    );

    this.velocity = velocity;
    this.time = 0;
    this.initial_y = offset.y;
    this.mass_constant = 2;
}

inheritPrototype(Projectile, Sphere);

Projectile.prototype.update = function() {
    this.offset.x += this.velocity.x;
    this.offset.z += this.velocity.z;

    // Basics physics equation:
    // x = x_0 + v_0t + (1/2)at^2
    this.time += 0.03;
    this.offset.y = this.initial_y +
        (this.velocity.y * this.time) +
        (0.5 * gravity * this.mass_constant * this.time * this.time);

    if (this.offset.y <= 0 && SHELLS_STAY_ON_GROUND) {
        this.offset.y = 0;
        this.offset.x -= this.velocity.x;
        this.offset.z -= this.velocity.z;
    }

    Shape.prototype.update.call(this);
};
