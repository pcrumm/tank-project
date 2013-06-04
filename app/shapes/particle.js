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

function generateBillboard(obj) {
    //Generates the required rotations and axes to create a billboard effect
    //Assumes object has look at vector[0,0,1] and up vector [0,1,0] for simplicity.
    //Both of these are true for the particles.

    var yRot, tiltRot;
    var yAxis, tiltAxis;

    var cam = player.getCamera().getPos();

    var objToCam = {x: (cam.x - obj.x), y: (cam.y - obj.y), z: (cam.z - obj.z)};
    var objToCamProj = copy(objToCam);
    objToCamProj.y = 0;

    objToCam = normalize(objToCam);
    objToCamProj = normalize(objToCamProj);

    yAxis = cross({x: 0, y: 0, z: 1}, objToCamProj);

    var dotY = objToCamProj.z; //Dot product of lookAt and objToCamProj

    if (Math.abs(dotY) < 0.9999)
        yRot = Math.acos(dotY) * (180/ Math.PI);

    var dotTilt = (objToCam.x * objToCamProj.x) + (objToCam.y * objToCamProj.y) + (objToCam.z * objToCamProj.z);

    if (Math.abs(dotTilt) < 0.9999)
        tiltRot = Math.acos(dotTilt);

    if (objToCam.y < 0)
        tiltAxis = {x: 1, y: 0, z: 0};

    else
        tiltAxis = {x: -1, y: 0, z: 0};

    return {yRot: yRot, tiltRot: tiltRot, yAxis: yAxis, tiltAxis: tiltAxis};
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
    this.rotation = {x: 0, y: 0, z: 0}//{y: 0, tilt: 0}; //This will be change each frame by billboarding
    this.rotAx = {y: 0, tilt: 0}; //Same as above
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

    //Calculate the appropriate billboard rotations
    var billboard = generateBillboard(this.offset);

    //this.rotation.y = billboard.yRot;
    //this.rotation.tilt = billboard.tiltRot;
    this.rotAx.y = billboard.yAxis;
    this.rotAx.tilt = billboard.tiltAxis;

    if (this.alive) {
        this.alpha -= this.fade_rate;

        if (this.alpha <= 0) {
                this.alpha = 0.0;
                this.alive = false;
        }
    }

    Shape.prototype.update.call(this);
/*
    mvPushMatrix();

    mvRotate(this.rotation.y, [this.rotAx.y.x, this.rotAx.y.y, this.rotAx.y.z]);
    mvRotate(this.rotation.tilt, [this.rotAx.tilt.x, this.rotAx.tilt.y, this.rotAx.tilt.z]);

    mvTranslate([this.offset.x, this.offset.y, this.offset.z]);

    gl.uniform1i(shaderProgram.multi, this.multiTex);
    gl.uniform1i(shaderProgram.use_alpha, this.use_alpha);
    gl.uniform1f(shaderProgram.alpha, this.alpha);

    updateMatrixUniforms();

    // Need to scale *after* updating the normals matrix (normals aren't normals if they get scaled)
    // After, only updating the modelview matrix necessary.
    mvScale(this.scale.x, this.scale.y, this.scale.z);
    updateViewMatrixUniform();

    mvPopMatrix();*/
};