//Declared outside in order to be used in helpers
var dimension = 110;
var mapVertices = [];

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
    var heightScale = 70;
    var dimScale = 6;
    var mapNormals = [];
    var mapIndices = [];
    var generator = new SimplexNoise();

/*----------------------------------------------------------------*/

    //Generates the terrain vertices
    for (var z = 0; z < dimension; z++)
        for (var x = 0; x < dimension; x++)
        {
            var xVal = x*dimScale;
            var zVal = z*dimScale;
            var height = getNoise(generator, xVal*.0055, zVal*.0055);

            var dx = (((2 * x) / dimension) - 1);
            var dz = (((2 * z) / dimension) - 1);
            var d = (dx*dx)+(dz*dz);

            var mask = height - (.2+.85*d)

            height = (mask > 0.1) ? height : (mask >= 0 ? (.8 * height) : 0)

            mapVertices[getIndex(z, x)]   = xVal;
            mapVertices[getIndex(z, x)+1] = height * heightScale;
            mapVertices[getIndex(z, x)+2] = zVal;
        }

/*----------------------------------------------------------------*/

    //Smoothes the vertices to remove some of the sharpness
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

    //Sets the colors
    var green = [0.2,  0.8,  0.2,  1.0];
    var red = [1.0, 0.0, 0.0, 1.0];
    var colors = [];
    for (var i = 0; i < (mapVertices.length)/3; i++) {
        if (mapVertices[3*i + 1] > (heightScale/2))
            colors = colors.concat(green);

        else
            colors = colors.concat(red);
    }

    Shape.call(this, mapVertices, mapNormals, colors, mapIndices);

    var displacement = (dimScale*dimension)/2

    this.offset = {x: -displacement, y: -5+0*-heightScale/2, z: -displacement};
    this.rotation = {x: 0, y: 0, z: 0};
    this.scale = {x: 1, y: 1, z: 1};
}


inheritPrototype(Terrain, Shape);
