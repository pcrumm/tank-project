function Sphere(offset, rotation, scale, texture, alpha) {

    var vertices = [];
    var normals = [];
    var texture_coords = [];
    var vertex_indices = [];

    var num_lat = 30;
    var num_long = 30;
    var radius = 1;

    for (var lat = 0; lat <= num_lat; lat++)
    {
        var theta = lat * Math.PI / num_lat;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var lon = 0; lon <= num_long; lon++)
        {
            var phi = lon * 2 * Math.PI / num_long;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (lon / num_long);
            var v = 1 - (lat / num_lat);

            normals.push(x);
            normals.push(y);
            normals.push(z);
            texture_coords.push(u);
            texture_coords.push(v);
            vertices.push(radius * x);
            vertices.push(radius * y);
            vertices.push(radius * z);
        }
    }

    for (var lat = 0; lat < num_lat; lat++)
    {
        for (var lon = 0; lon < num_long; lon++)
        {
            var first = (lat * (num_long + 1)) + lon;
            var second = first + num_long + 1;
            vertex_indices.push(first);
            vertex_indices.push(second);
            vertex_indices.push(first + 1);

            vertex_indices.push(second);
            vertex_indices.push(second + 1);
            vertex_indices.push(first + 1);
        }
    }

    var use_alpha = false;
    if (alpha) use_alpha = true;

    Shape.call(this, vertices, normals, {texture: texture || textures.crate, texture_coords: texture_coords, alpha: alpha || 1.0, use_alpha: use_alpha}, vertex_indices);

    this.offset = offset || {x: 0, y: 0, z: 0};
    this.rotation = rotation || {x: 0, y: 0, z: 0};
    this.scale = scale || {x: 1, y: 1, z: 1};
}

inheritPrototype(Sphere, Shape);
