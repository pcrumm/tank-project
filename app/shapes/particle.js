function Particle(offset, velocity, pull, fade_rate, lifetime) {
    var vertices = [
        -0.25,-0.25, 0.0,
         0.25,-0.25, 0.0,
         0.25, 0.25, 0.0,
        -0.25, 0.25, 0.0
    ];

    //These don't matter. Particles aren't lit
    var normals = [
        0.0,  1.0, 0.0,
        0.0,  1.0, 0.0,
        0.0,  1.0, 0.0,
        0.0,  1.0, 0.0
    ];

    // This array defines a face as two triangles, using the
    // indices in the vertex array to specify each triangle's position.
    var vertex_indices = [
        0, 1, 2, 
        0, 2, 3
    ];

    // TODO: Have a way to specify these, i.e. not hardcode 1000
    var texture_coords = [
        0, 1,
        0, 0,
        1, 0,
        1, 1
    ];
    Shape.call(this, vertices, normals, {texture: textures.explosion, texture_coords: texture_coords, use_alpha: false, alpha: 1.0 }, vertex_indices);

    this.offset = offset || {x: 0, y: 0, z: 0};
    this.scale = {x: 1, y: 1, z: 1};
    this.rotation = {x: 0, y: 0, z: 0}; //This will be change each frame by billboarding

    this.alive = 1.0;
    this.velocity = velocity || {x: 1, y: 1, z: 1};
    this.pull = pull || {x: 0.0, y: 0.0, z: 0.0};
    this.lifetime = lifetime || 1; //Number of frames the particle is full power
    this.fade_rate = fade_rate || 1.0; //How fast the particle fades after it dies
}

inheritPrototype(Particle, Shape);

Particle.prototype.update = function() {
    this.offset.x += this.velocity.x;
    this.offset.y += this.velocity.y;
    this.offset.z += this.velocity.z;

    this.velocity.x += this.pull.x;
    this.velocity.y += this.pull.y;
    this.velocity.z += this.pull.z;

    if (this.alive) {

        if (this.lifetime > 0)
            this.lifetime--;

        else {
            this.alpha -= this.fade_rate;

            if (this.alpha <= 0) {
                this.alpha = 1.0;
                this.alive = false;
            }
        }
    }

    Shape.prototype.update.call(this);
};