function getIndex(row, col) {
    //Gets an array index for the vertex or normal array
    //Given a position in a 2D array, returns the position in a 1D array.
    return 3*((dimension*row)+col);
}

function getVec3(row, col) {
    var index = mapVertices[getIndex(z, x)];
    return vec3( mapVertices[index],  mapVertices[index+1],  mapVertices[index+2]);
}

function Terrain() {
    //Returns a shape object holding the map;
    var dimension = 100;
    var scale = 10;
    var mapVertices = [];
    var mapNormals = [];
    var mapIndices = [];

    //Generates the terrain vertices
    for (var z = 0; z < dimension; w++)
        for (var x = 0; x < dimension; h++)
        {
            var height = SimplexNoise.noise(x, z)*scale;
            mapVertices[getIndex(z, x)]   = x;
            mapVertices[getIndex(z, x)+1] = height;
            mapVertices[getIndex(z, x)+2] = z;
        }

    //Generates the normals
    for (var z = 0; z < dimension; z++)
        for (var x = 0; x < dimension; x++)
        {
            var current = getVec3(z,x);
            var sum = vec3(0,0,0);

            if (z+1 < dimension && x+1 < dimension)
                sum += (getVec3(z, x+1) - current).cross(getVec3(z+1, x) - current);

            if (z+1 < dimension && x > 0)
                sum += (getVec3(z+1, x) - current).cross(getVec3(z, x-1)- current);

            if (z > 0 && x > 0)
                sum += (getVec3(z, x-1) - current).cross(getVec3(z-1, x) - current);

            if (z > 0 && x+1 < dimension)
                sum += (getVec3(z-1, x) - current).cross(getVec3(z, x+1) - current);

            sum = normalize(sum)

            mapNormals[getIndex(z, x)] = sum.x;
            mapNormals[getIndex(z, x)+1] = sum.y;
            mapNormals[getIndex(z, x)+1] = sum.z;
        }

    //Generates the index array
    //Algorithm found at: http://stackoverflow.com/questions/10114577/a-method-for-indexing-triangles-from-a-loaded-heightmap
    var indicesIndex = 0;

    for (var z = 0; z < dimension-1; z++)
        for (var x = 0; x < dimension-1; x++)
        {
            var start = (z*dimension) + x;

            mapIndices[indicesIndex] = start;
            indicesIndex++;

            mapIndices[indicesIndex] = start+1;
            indicesIndex++;

            mapIndices[indicesIndex] = start + dimension;
            indicesIndex++;

            mapIndices[indicesIndex] = start + 1;
            indicesIndex++;

            mapIndices[indicesIndex] = start + dimension + 1;
            indicesIndex++;

            mapIndices[indicesIndex] = start + dimension;
            indicesIndex++;      
        }

    var green = [0.2,  0.8,  0.2,  1.0];
    var colors = [];
    for (var i = 0; i < mapVertices.length; i++) {
        colors = colors.concat(green);
    }

    Shape.call(this, mapVertices, mapNormals, colors, mapIndices);
}


inheritPrototype(Terrain, Shape);
