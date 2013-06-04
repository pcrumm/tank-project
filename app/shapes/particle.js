function normalize(vec) {
    var mag =  Math.sqrt((vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z));

    return {x: vec.x/mag, y: vec.y/mag, z: vec.z/mag};
}

function cross(vec1, vec2) {
    //Returns an object holding the cross product of two objects {x, y, z}
    var v1 = $V([vec1.x, vec1.y, vec1.z]);
    var v2 = $V([vec2.x, vec2.y, vec2.z]);

    var normal = v1.cross(v2);

    return {x: normal.x, y: normal.y, z: normal.z};
}

function generateBillboardMatrix(obj) {
    //Assumes initial particle up vector if [0,1,0]
    var cam = player.getCamera().getPos()

    var look = {x: (cam.x - obj.x), y: (cam.y - obj.y), z: (cam.z - obj.z)};

    var right = cross({x: 0, y: 1, z: 0}, look);

    var up = cross(look, right);

    var matrix = [
        right.x, up.x, look.x, obj.x,
        right.y, up.y, look.y, obj.y,
        right.z, up.z, look.z, obj.z,
              0,    0,      0,     1
    ];

    return matrix;
}
function Particle(offset, velocity, pull, fade_rate) {
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

    var texture_coords = [
        0, 1,
        0, 0,
        1, 0,
        1, 1
    ];

    Shape.call(this, vertices, normals, {texture: textures.explosion, texture_coords: texture_coords, use_alpha: true, alpha: 1.0 }, vertex_indices);

    this.offset = offset || {x: 0, y: 0, z: 0};
    this.scale = {x: 1, y: 1, z: 1};
    this.rotation = {x: 0, y: 0, z: 0}; //This will be change each frame by billboarding
    this.alpha = 1.0;
    this.alive = 1.0;
    this.velocity = velocity || {x: 1, y: 1, z: 1};
    this.pull = pull || {x: 0.0, y: 0.0, z: 0.0};
    this.fade_rate = fade_rate || 1.0; //How fast the particle fades after it dies
    this.lighting = false;
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
        this.alpha -= this.fade_rate;

        if (this.alpha <= 0) {
                this.alpha = 0.0;
                this.alive = false;
        }
    }

    // Copypasta-ing Shape.prototype.update(), in order to insert a billboard rotation after translation:
    mvPushMatrix();

    mvTranslate([this.offset.x, this.offset.y, this.offset.z]);

    // Rotation after translation in order to rotate each particle about its own axis:
    var rotation_about_own_axis = player.getCamera().getRotation();
    mvRotate(rotation_about_own_axis.x, [1, 0, 0]);
    mvRotate(-rotation_about_own_axis.y, [0, 1, 0]);

    gl.uniform1i(shaderProgram.multi, this.multiTex);
    gl.uniform1i(shaderProgram.use_alpha, this.use_alpha);
    gl.uniform1f(shaderProgram.alpha, this.alpha);

    updateMatrixUniforms();

    // Need to scale *after* updating the normals matrix (normals aren't normals if they get scaled)
    // After, only updating the modelview matrix necessary.
    mvScale(this.scale.x, this.scale.y, this.scale.z);
    updateViewMatrixUniform();

    mvPopMatrix();
};