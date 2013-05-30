function Projectile(offset, velocity) {
    Sphere.call(this,
                offset,
                {x: 0, y: 0, z: 0},
                {x: 0.075, y: 0.075, z: 0.075},
                textures.bullet
    );

    this.velocity = velocity;
}

inheritPrototype(Projectile, Sphere);

Projectile.prototype.update = function() {
    this.offset.x += this.velocity.x;
    this.offset.y += this.velocity.y;
    this.offset.z += this.velocity.z;

    Shape.prototype.update.call(this);
};
