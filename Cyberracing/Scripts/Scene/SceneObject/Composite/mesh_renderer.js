/**
 * Created by tom on 2017-01-12.
 */

function MeshRenderer(owner, gl) {
    Composite.call(this, owner);

    this.material = null;
    this.vertices = [];
    this.vertexNormals = [];
    this.colors = [];
    this.textureCoords = [];
    this.faces = [];
    this.mesh = {
        v: [],
        vt: [],
        vn: [],
        f: []
    };
    this.gl = gl;
    this.init();
}
MeshRenderer.inheritsFrom(Composite);
MeshRenderer.prototype.init = function () {
    this.buffers = {};
    this.buffers.vertices = gl.createBuffer();
    this.buffers.vertexNormals = gl.createBuffer();
    this.buffers.faces = gl.createBuffer();
    this.buffers.colors = gl.createBuffer();

    // this.vertices = [
    //     -0.5, -0.5, -0.5, // lbf
    //      0.5, -0.5, -0.5, // rbf
    //      0.5,  0.5, -0.5, // rtf
    //     -0.5,  0.5, -0.5, // ltf
    //
    //     -0.5, -0.5, 0.5, // lbr
    //      0.5, -0.5, 0.5, // rbr
    //      0.5,  0.5, 0.5, // rtr
    //     -0.5,  0.5, 0.5, // ltr
    // ];

    this.vertices = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];

    // this.faces = [
    //     0, 1, 2,    0, 2, 3,
    //     1, 5, 6,    1, 6, 2,
    //     5, 4, 7,    5, 7, 6,
    //     4, 0, 3,    4, 3, 7,
    //     1, 5, 4,    1, 4, 0,
    //     2, 6, 7,    2, 7, 3
    // ];

    this.faces = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
    ];

    // this.colors = [
    //     1.0, 1.0, 1.0, 1.0,
    //     1.0, 0.0, 0.0, 1.0,
    //     0.0, 1.0, 0.0, 1.0,
    //     0.0, 0.0, 1.0, 1.0,
    //
    //     1.0, 1.0, 1.0, 1.0,
    //     1.0, 0.0, 0.0, 1.0,
    //     0.0, 1.0, 0.0, 1.0,
    //     0.0, 0.0, 1.0, 1.0
    // ];

    var colors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0]     // Left face: purple
    ];

    var generatedColors = [];

    for (j=0; j<6; j++) {
        var c = colors[j];

        for (var i=0; i<4; i++) {
            generatedColors = generatedColors.concat(c);
        }
    }

    this.colors = generatedColors;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.faces);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    this.material = Shaders.createProgramFromIds(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(this.material);
};
MeshRenderer.prototype.render = function () {

    let gl = this.gl;
    let lights = App.activeScene.getLights();

    this.material.setActive();

    let modelMatrix,
        viewMatrix,
        projectionMatrix;

    this.material.render(this.buffers, lights, modelMatrix, viewMatrix, projectionMatrix);
};
// MeshRenderer.prototype.render = function () {
//
//     let gl = this.gl;
//
//     let locations = {};
//     locations.uniform = {};
//     locations.attribute = {};
//
//     locations.uniform.mMatrix = gl.getUniformLocation(this.material, "uMMatrix");
//     locations.uniform.vMatrix = gl.getUniformLocation(this.material, "uVMatrix");
//     locations.uniform.pMatrix = gl.getUniformLocation(this.material, "uPMatrix");
//
//     locations.attribute.vertexPosition = gl.getAttribLocation(this.material, "aVertexPosition");
//     locations.attribute.color = gl.getAttribLocation(this.material, "aColor");
//
//     gl.enableVertexAttribArray(locations.attribute.vertexPosition);
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);
//     gl.vertexAttribPointer(locations.attribute.vertexPosition, 3, gl.FLOAT, false, 0, 0);
//
//     gl.enableVertexAttribArray(locations.attribute.color);
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors);
//     gl.vertexAttribPointer(locations.attribute.color, 4, gl.FLOAT, false, 0, 0);
//
//     let transform = this.getOwner().getComposite('transform');
//     transform.position = [10*Math.sin(performance.now()/1000),0,-5];
//     //transform.rotation = [0,0,(performance.now()/1000)%(2*Math.PI)];
//     //transform.position = [0, 0, -2];
//     transform.rotation = [0,0,0];
//     transform.scale = [1,1,1];
//
//     let camera = App.activeCamera;
//     let camTransform = camera.getComposite('transform');
//     //camTransform.position = [0, 0, -5];
//     //camTransform.rotation = [0, (performance.now()/1000)%(2*Math.PI), 0];
//     let pMatrix = camera.getComposite('camera').getPerspectiveMatrix();
//     //let vMatrix = camTransform.getInverseTransformMatrix();
//     let vMatrix = mat4.create();
//     mat4.lookAt(vMatrix, [5,5,5], transform.position, [0,1,0]);
//     let mMatrix = transform.getTransformMatrix();
//
//     gl.uniformMatrix4fv(locations.uniform.mMatrix, false, new Float32Array(mMatrix));
//     gl.uniformMatrix4fv(locations.uniform.vMatrix, false, new Float32Array(vMatrix));
//     gl.uniformMatrix4fv(locations.uniform.pMatrix, false, new Float32Array(pMatrix));
//
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.faces);
//
//     gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
// };
MeshRenderer.prototype.loadMeshFromObj = function (path) {
    let file = readTextFile(path);
    while(file.status == FILE_STATUS.IN_PROGRESS) {
        console.log("busy waiting: loading file");
    }

    if(file.status == FILE_STATUS.FAILED) {
        console.log("failed to load file.");
        return null;
    }

    let mesh = new OBJ.Mesh(file.text);
    this.mesh = {
        vertices: mesh.vertices,
        textureCoords: mesh.textures,
        vertexNormals: mesh.vertexNormals,
        faces: mesh.indices
    };

};