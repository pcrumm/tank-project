//Declared outside in order to be used in helpers
var dimension = 16;
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

function Terrain() {
    //Returns a shape object holding the map;
    var heightScale = 70;
    var dimScale = 10;
    var mapNormals = [];
    var mapIndices = [];

    //Generates the terrain vertices
    for (var z = 0; z < dimension; z++)
        for (var x = 0; x < dimension; x++)
        {
            var xVal = x*dimScale;
            var zVal = z*dimScale;
            var height = (1/15)*(PerlinNoise.noise(xVal, zVal, .8)) + (2/15)*(PerlinNoise.noise(xVal*2, zVal*2, .8)) + 
                            (4/15)*(PerlinNoise.noise(4*xVal, 4*zVal, .8)) + (8/15)*(PerlinNoise.noise(8*xVal, 8*zVal, .8));
            mapVertices[getIndex(z, x)]   = xVal;
            mapVertices[getIndex(z, x)+1] = height * heightScale;
            mapVertices[getIndex(z, x)+2] = zVal;
        }

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
        for (var x = 0; x < (dimension-1); x++)
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
        if (mapVertices[3*i + 1] > 35)
            colors = colors.concat(green);
        else
            colors = colors.concat(red);
    }

    Shape.call(this, mapVertices, mapNormals, colors, mapIndices);

    this.offset = {x: -80, y: -35, z: -80};
    this.rotation = {x: 0, y: 0, z: 0};
    this.scale = {x: 1, y: 1, z: 1};
}


inheritPrototype(Terrain, Shape);
