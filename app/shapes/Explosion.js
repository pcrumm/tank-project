function Explosion() {
    this.generate = function(offset, size) {
        explosions.push(new ExplosionSphere(offset, {x: 2, y: 2, z: 2}));
        if (size === 'big')
        {
            setTimeout(function() {explosions.push(new ExplosionSphere(offset, {x: 1, y: 1, z: 1}))}, 500);
        }
        var t = player.getTank().getOffset();
        
        var distance = Math.sqrt(Math.pow(offset.x - t.x, 2) +
        Math.pow(offset.y - t.y, 2) +
        Math.pow(offset.z - t.z, 2));

        var volume = 1 - (distance / 50);
        if (volume < 0) volume = 0.2;
        
        sounds.boom.play(volume);
    }
}

function ExplosionSphere(offset, scale, rate) {

    this.scale = {x: 0.1, y: 0.1, z: 0.1};
    this.maxScale = scale;
    this.is_alive = true;
    this.status = 'rising';
    this.rate = rate || 0.15;

    Sphere.call(this,
                offset,
                {x: 0, y: 0, z: 0},
                this.scale,
                textures.fire,
                0.01
    );
}

inheritPrototype(ExplosionSphere, Sphere);

ExplosionSphere.prototype.update = function () {

    this.rotation.x -= 10;

    if (this.status === 'rising')
    {
        if (this.scale.x < this.maxScale.x)
        {
            this.scale = {
                x: this.scale.x + this.rate, 
                y: this.scale.y + this.rate, 
                z: this.scale.z + this.rate
            };
            this.alpha += 0.07;
        }
        else
            this.status = 'falling';
    }
    else if (this.status === 'falling')
    {
        if (this.scale.x > 0)
        {
            this.scale = {
                x: this.scale.x - this.rate, 
                y: this.scale.y - this.rate, 
                z: this.scale.z - this.rate
            };
            this.alpha -= 0.07;
        }
        else
            this.is_alive = false;
    }
    Shape.prototype.update.call(this);
}