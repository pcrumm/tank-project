//
// Matrix utility functions
//

function loadIdentity() {
    mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function mvRotate(angle, v) {
    var inRadians = angle * degreesToRadians;
    
    var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
    multMatrix(m);
}

function mvScale(x, y, z) {
    var m = $M([
        [x, 0, 0, 0],
        [0, y, 0, 0],
        [0, 0, z, 0],
        [0, 0, 0, 1],
    ]);
    
    multMatrix(m);
}

function updateMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

    updateViewMatrixUniform();

    var normalMatrix = mvMatrix.inverse();
    normalMatrix = normalMatrix.transpose();
    gl.uniformMatrix4fv(shaderProgram.nUniform, false, new Float32Array(normalMatrix.flatten()));
}

function updateViewMatrixUniform() {
    gl.uniformMatrix4fv(shaderProgram.mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

var mvMatrixStack = [];

function mvPushMatrix(m) {
    if ( m ) {
        mvMatrixStack.push(m.dup());
        mvMatrix = m.dup();
    }
    else {
        mvMatrixStack.push(mvMatrix.dup());
    }
}

function mvPopMatrix() {
    if ( !mvMatrixStack.length ) {
        throw("Can't pop from an empty matrix stack.");
    }
    
    mvMatrix = mvMatrixStack.pop();
    return mvMatrix;
}
