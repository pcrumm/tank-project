//Declared outside in order to be used in helpers
var dimension = 128;
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
    var n = (9/15)*(generator.noise(xVal, zVal)) + (4/15)*(generator.noise(xVal*2, zVal*2)) + 
                            (1/15)*(generator.noise(4*xVal, 4*zVal)) + (1/15)*(generator.noise(8*xVal, 8*zVal));

    //Clamp the value to [0,1]
    return (1+n)/2;
}

function Terrain() {
    //Returns a shape object holding the map;
    var heightScale = 70;
    var dimScale = 5;
    var mapNormals = [];
    var mapIndices = [];
    var generator = new SimplexNoise();
    var lowest = 1000000;

    //Generates the terrain vertices
    for (var z = 0; z < dimension; z++)
        for (var x = 0; x < dimension; x++)
        {
            var xVal = x*dimScale;
            var zVal = z*dimScale;
            var height = getNoise(generator, xVal*.005, zVal*.005);

            var dx = (((2 * x) / dimension) - 1);
            var dz = (((2 * z) / dimension) - 1);
            var d = (dx*dx)+(dz*dz);

            //if (height <= 0.3+0.4*d)
            //   height *= -1;

            var mask = height - (.2+.85*d)

            height = (mask > 0.1) ? height : (mask >= 0 ? (.8 * height) : 0)

            if (height*heightScale < lowest)
                lowest = height*heightScale;

            mapVertices[getIndex(z, x)]   = xVal;
            mapVertices[getIndex(z, x)+1] = height * heightScale;
            mapVertices[getIndex(z, x)+2] = zVal;
        }

    console.log("Lowest %d\n", lowest);

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

    //Generates the index array
    var indicesIndex = 0;

    for (var z = 0; z < (dimension-2); z++)
    {
        for (var x = 1; x < (dimension-1); x++)
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

    var green = [0.2,  0.8,  0.2,  1.0];
    var red = [1.0, 0.0, 0.0, 1.0];
    var colors = [];
    for (var i = 0; i < (mapVertices.length)/3; i++) {
        if (mapVertices[3*i + 1] > (heightScale/2))
            colors = colors.concat(green);

        else if (mapVertices[3*i + 1] == lowest)
            colors = colors.concat([0.0, 0.0, 0.0, 1.0]);
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
