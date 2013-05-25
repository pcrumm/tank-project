var textures = {};

function initTextures() {
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

    var grass = gl.createTexture();
    grass.image = new Image();
    grass.image.onload = function() {
        handleLoadedTexture(grass);
    };
    grass.image.src = 'assets/grass_tile.jpg';
    textures.grass = grass;

    var ocean = gl.createTexture();
    ocean.image = new Image();
    ocean.image.onload = function() {
        handleLoadedTexture(ocean);
    };
    ocean.image.src = 'assets/ocean.png';
    textures.ocean = ocean;
}

function handleLoadedTexture(texture) {    
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

    gl.bindTexture(gl.TEXTURE_2D, null);
}
