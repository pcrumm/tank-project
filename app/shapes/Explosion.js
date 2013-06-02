//These are to figure out which region of the explosion texture to use

function Explosion(offset, rotation) {
    //The explosion is made up the the same texture scaled and layered three times
    var texture_coords = [
        0,    0.25,
        0,    0,
        0.25, 0,
        0.25, 0.25
    ];

    this.texRow = 0;
    this.texCol = 0;

    this.texCol++;

    this.offset = offset || {x: 0, y: 0, z: 0};
    this.rotation = rotation || {x: 0, y: 0, z: 0};
    this.scaling = {x: 1, y: 1, z: 1};
    this.alpha = 1.0;

    this.near= new ExplosionLayer({x: this.offset.x, y: this.offset.y, z: this.offset.z+.4}, {x: 0, y: 0, z:  0}, {x: 1, y: 1, z: 1}, texture_coords);
    this.mid = new ExplosionLayer({x: this.offset.x, y: this.offset.y, z: this.offset.z+.2}, {x: 0, y: 0, z: 45}, {x: 2, y: 2, z: 1}, texture_coords);
    this.far = new ExplosionLayer({x: this.offset.x, y: this.offset.y, z: this.offset.z}, {x: 0, y: 0, z:-80}, {x: 3, y: 3, z: 1}, texture_coords);

    this.fadeFrames = 8;
}

Explosion.prototype.update = function() {
    var newCoords = [];

    if (this.texRow < 4 && this.texCol < 4) {
        //Updates the texture coordinates
        newCoords = [
            this.texRow/4, (this.texCol+1)/4,
            this.texRow/4, this.texCol/4,
            (this.texRow+1)/4, this.texCol/4,
            (this.texRow+1)/4, (this.texCol+1)/4
        ];

        this.texCol++;

        if (this.texCol > 3) {
            this.texRow++;

            if (this.texRow < 4)
                this.texCol = 0;
        }

        this.near.update(newCoords, this.offset, this.rotation, this.scaling);
        this.mid.update (newCoords, this.offset, this.rotation, this.scaling);
        this.far.update (newCoords, this.offset, this.rotation, this.scaling);
    }

    else if (this.fadeFrames > 0)
    {
        //Makes the last frame expand and fade away
        this.scaling.x += .25;
        this.scaling.y += .25;
        this.scaling.z += .25;
        this.near.update(null, this.rotation, this.scaling);
        this.mid.update (null, this.rotation, this.scaling);
        this.far.update (null, this.rotation, this.scaling);
        //this.alpha -= 0.12;
        this.fadeFrames--;
    }

    gl.uniform1f(shaderProgram.alpha, this.alpha);
};

Explosion.prototype.draw = function() {
    this.update(); 

    //Disable writing to the depth buffer
    gl.depthMask(false);

    //Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.far.draw();
    this.mid.draw();
    this.near.draw();

    //Re-enable depth buffer and disable blending
    gl.depthMask(true);
    gl.disable(gl.BLEND);

};