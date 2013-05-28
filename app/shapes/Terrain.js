//Declared outside in order to be used in helpers
var dimension = 110;
var heightScale = 70;
var mapVertices = [];

function TerrainRegion(min, max) {
    this.min = min;
    this.max = max;
}

var regions = [
    new TerrainRegion(0, 13),
    new TerrainRegion(13, 28),
    new TerrainRegion(28, 56),
    new TerrainRegion(56, 70)
];

function initTerrainRegions() {
    gl.uniform1f(shaderProgram.r1max, regions[0].max);
    gl.uniform1f(shaderProgram.r1min, regions[0].min);

    gl.uniform1f(shaderProgram.r2max, regions[1].max);
    gl.uniform1f(shaderProgram.r2min, regions[1].min);

    gl.uniform1f(shaderProgram.r3max, regions[2].max);
    gl.uniform1f(shaderProgram.r3min, regions[2].min);

    gl.uniform1f(shaderProgram.r4max, regions[3].max);
    gl.uniform1f(shaderProgram.r4min, regions[3].min);
}

function getIndex(row, col) {
    //Gets an array index for the vertex or normal array
    //Given a position in a 2D array, returns the position in a 1D array.
    return 3*((dimension*row)+col);
}

function getVec3(row, col) {
    var index = getIndex(row, col);
    return $V([mapVertices[index],  mapVertices[index+1],  mapVertices[index+2]]);
}

function getNoise(generator, xVal, zVal) {
    //Generates the noise value using a combination of amplitudes and frequencies
    var n = (8/15)*(generator.noise(xVal, zVal)) + (4/15)*(generator.noise(xVal*2, zVal*2)) + 
                            (2/15)*(generator.noise(4*xVal, 4*zVal)) + (1/15)*(generator.noise(8*xVal, 8*zVal));

    //Clamps the value to [0,1]
    return (1+n)/2;
}

function Terrain() {
    //Returns a shape object holding the map;
    var dimScale = 6;
    var mapNormals = [];
    var mapIndices = [];
    var texCoords = [];
    var generator = new SimplexNoise();

/*----------------------------------------------------------------*/

    //Generates the terrain vertices and texture coordinates

    var texOptions = [
        [0, 0],
        [dimScale, 0],
        [dimScale, dimScale],
        [0, dimScale]
    ];

    var texNum = 0;
    var top = 1;

    for (var z = 0; z < dimension; z++)
    {
        for (var x = 0; x < dimension; x++)
        {
            var xVal = x*dimScale;
            var zVal = z*dimScale;
            var height = getNoise(generator, xVal*.004, zVal*.004);

            var dx = (((2 * x) / dimension) - 1);
            var dz = (((2 * z) / dimension) - 1);
            var d = (dx*dx)+(dz*dz);

            var mask = height - (.4+.9*d)

            if (mask > 0.1)
                height = height; //No change

            else if (mask > 0)
                height = 0.8 * height;

            else if (mask > -0.5)
                height = 0.4 * height;

            else if (mask > -0.1)
                height = 0.1 * height;

            else if (mask > -0.3)
                height = 0.05 * height;

            else
                height = 0;

            mapVertices = mapVertices.concat([xVal, height * heightScale, zVal]);

            //Sets the textures coordinates. As a set of squares along each row
            //var index = texNum % 2;
            //if (top)
                //index += 2;

            texCoords = texCoords.concat([x/dimension*12, z/dimension*12]);
            texNum++;
        }

        top = !top;
        texNum = 0;
    }

    // Format the object holding Terrain's multiple objects, to be passed to Shape:
    var multitexture = [
        {texture: textures.dirt,  uniform: shaderProgram.r1Tex},
        {texture: textures.grass, uniform: shaderProgram.r2Tex},
        {texture: textures.rock,  uniform: shaderProgram.r3Tex},
        {texture: textures.snow,  uniform: shaderProgram.r4Tex}
    ];

/*----------------------------------------------------------------*/

    //Smoothes the vertices to remove some of the sharpness
    //Averages the point with the (up to) 8 points around it
    for (var z = 0; z < dimension; z++)
        for (var x = 0; x < dimension; x++)
        {
            var average = 0;
            var times = 0;

            if (x-1 >= 0)
            {
                average += mapVertices[getIndex(z, x-1)+1];
                times += 1;
            }

            if (x+1 < dimension -1)
            {
                average += mapVertices[getIndex(z, x+1)+1];
                times += 1;
            }

            if (z-1 >= 0)
            {
                average += mapVertices[getIndex(z-1, x)+1];
                times += 1;
            }

            if (z+1 < dimension - 1)
            {
                average += mapVertices[getIndex(z+1, x)+1];
                times += 1;
            }

            if (x-1 >= 0 && z-1 >= 0)
            {
                average += mapVertices[getIndex(z-1, x-1)+1];
                times += 1;
            }

            if (x+1 < dimension-1 && z-1 >= 0)
            {
                average += mapVertices[getIndex(z-1, x+1)+1];
                times += 1;
            }

            if (x-1 >= 0 && z+1 > dimension-1)
            {
                average += mapVertices[getIndex(z+1, x-1)+1];
                times += 1;
            }

            if (x+1 < dimension-1 && z+1 < dimension-1)
            {
                average += mapVertices[getIndex(z+1, x+1)+1];
                times += 1;
            }

            average += mapVertices[getIndex(z,x)+1];
            times += 1;

            average /= times;

            mapVertices[getIndex(z,x)+1] = average;
        }

/*----------------------------------------------------------------*/

    //Generates the normals
    for (var z = 0; z < dimension; z++)
        for (var x = 0; x < dimension; x++)
        {
            var current = getVec3(z,x);
            var sum = $V([0,0,0]);

            if (z+1 < dimension && x+1 < dimension)
                sum = sum.add((getVec3(z, x+1).subtract(current)).cross(getVec3(z+1, x).subtract(current)));

            if (z+1 < dimension && x > 0)
                sum = sum.add((getVec3(z+1, x).subtract(current)).cross(getVec3(z, x-1).subtract(current)));

            if (z > 0 && x > 0)
                sum = sum.add((getVec3(z, x-1).subtract(current)).cross(getVec3(z-1, x).subtract(current)));

            if (z > 0 && x+1 < dimension)
                sum = sum.add((getVec3(z-1, x).subtract(current)).cross(getVec3(z, x+1).subtract(current)));

            sum = sum.toUnitVector();

            mapNormals[getIndex(z, x)] = sum.x;
            mapNormals[getIndex(z, x)+1] = sum.y;
            mapNormals[getIndex(z, x)+1] = sum.z;
        }

/*----------------------------------------------------------------*/

    //Generates the index array
    var indicesIndex = 0;

    for (var z = 0; z < (dimension-2); z++)
    {
        for (var x = 0; x < (dimension-2); x++)
        {
            var start = (z*dimension) + x;

            mapIndices[indicesIndex] = start + dimension;
            indicesIndex++;

            mapIndices[indicesIndex] = start+dimension+1;
            indicesIndex++;

            mapIndices[indicesIndex] = start + 1;
            indicesIndex++;

            mapIndices[indicesIndex] = start + dimension;
            indicesIndex++;

            mapIndices[indicesIndex] = start + 1;
            indicesIndex++;

            mapIndices[indicesIndex] = start;
            indicesIndex++;      
        }
    }
/*----------------------------------------------------------------*/

    Shape.call(this, mapVertices, mapNormals, {texture_coords: texCoords, use_multitexture: true, multitexture: multitexture}, mapIndices);

    this.displacement = (dimScale * dimension) / 2;

    this.offset = {x: 0, y: 0, z: 0};
    this.rotation = {x: 0, y: 0, z: 0};
    this.scale = {x: 1, y: 1, z: 1};

    var getY = function(x, z) {
        // TODO: This is very inefficient and should be improved
        for (var i = 0; i < mapVertices.length; i+=3) {
            if ( mapVertices[i] === x && mapVertices[i+2] === z ) {
                return mapVertices[i+1];
            }
        }

        return null;
    }

    // This function returns the y value of the the Terrain at the given x and z coordinates,
    // by way of bilinear interpolation
    this.heightMap = function(x, z) {
        var d = dimScale;

        var x1 = Math.floor(x / d) * d;
        var z1 = Math.floor(z / d) * d;        
        var x2 = Math.ceil(x / d) * d;
        var z2 = Math.ceil(z / d) * d;

        // x / d may have given 0, making x1 == x2 and z1 == z2. Fix this:
        if ( x2 === x1 ) {
            x2 += d;
        }
        if ( z2 === z1 ) {
            z2 += d;
        }

        var h11 = getY(x1, z1);
        var h12 = getY(x1, z2);
        var h21 = getY(x2, z1);
        var h22 = getY(x2, z2);

        var lhs = 1 / ((x2-x1) * (z2-z1));
        var rhs = h11 * (x2-x) * (z2-z) +
                  h21 * (x-x1) * (z2-z) + 
                  h12 * (x2-x) * (z-z1) +
                  h22 * (x-x1) * (z-z1);

        return lhs * rhs;
    };
}

inheritPrototype(Terrain, Shape);
