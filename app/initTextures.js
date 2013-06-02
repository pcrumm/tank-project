var textures = {};

function initTextures() {
    // Please note: Image dimensions must be a power of 2!
    
    var metal = gl.createTexture();
    metal.image = new Image();
    metal.image.onload = function() {
        handleLoadedTexture(metal);
    };
    metal.image.src = 'assets/rust.jpg';
    textures.metal = metal;

    var crate = gl.createTexture();
    crate.image = new Image();
    crate.image.onload = function() {
        handleLoadedTexture(crate);
    };
    crate.image.src = 'assets/crate.gif';
    textures.crate = crate;

    var ocean = gl.createTexture();
    ocean.image = new Image();
    ocean.image.onload = function() {
        handleLoadedTexture(ocean);
    };
    ocean.image.src = 'assets/ocean.png';
    textures.ocean = ocean;

    var grass = gl.createTexture();
    grass.image = new Image();
    grass.image.onload = function() {
        handleLoadedTexture(grass);
    };
    grass.image.src = 'assets/grass.jpg';
    textures.grass = grass;

    var rock = gl.createTexture();
    rock.image = new Image();
    rock.image.onload = function() {
        handleLoadedTexture(rock);
    };
    rock.image.src = 'assets/rock.jpg';
    textures.rock = rock;

    var dirt = gl.createTexture();
    dirt.image = new Image();
    dirt.image.onload = function() {
        handleLoadedTexture(dirt);
    };
    dirt.image.src = 'assets/dirt.jpg';
    textures.dirt = dirt;

    var snow = gl.createTexture();
    snow.image = new Image();
    snow.image.onload = function() {
        handleLoadedTexture(snow);
    };
    snow.image.src = 'assets/snow.jpg';
    textures.snow = snow;

    var sand = gl.createTexture();
    sand.image = new Image();
    sand.image.onload = function() {
        handleLoadedTexture(sand);
    };
    sand.image.src = 'assets/sand.jpg';
    textures.sand = sand;


    var projectile = gl.createTexture();
    projectile.image = new Image();
    projectile.image.onload = function() {
        handleLoadedTexture(projectile);
    };
    projectile.image.src = 'assets/projectile.jpg';
    textures.projectile = projectile;


    var sky = gl.createTexture();
    sky.image = new Image();
    sky.image.onload = function() {
        handleLoadedTexture(sky);
    };
    sky.image.src = 'assets/sky.jpg';
    textures.sky = sky;


    var explosion = gl.createTexture();
    explosion.image = new Image();
    explosion.image.onload = function() {
        handleLoadedTexture(explosion);
    };
    explosion.image.src = 'assets/explosion.jpg';
    textures.explosion = explosion;

}

function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    gl.bindTexture(gl.TEXTURE_2D, null);
}
