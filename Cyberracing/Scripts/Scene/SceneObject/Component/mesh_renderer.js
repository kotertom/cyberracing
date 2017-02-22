/**
 * Created by tom on 2017-01-12.
 */

function MeshRenderer(gl, mesh) {
    Component.call(this);

    this.material = {};
    // this.vertices = [];
    // this.vertexNormals = [];
    // this.colors = [];
    // this.textureCoords = [];
    // this.faces = [];
    this.buffers = {};
    // this.mesh = {
    //     vertices: [],
    //     textureCoords: [],
    //     vertexNormals: [],
    //     faces: []
    // };
    this.mesh = mesh || createCubeMesh();
    this.gl = gl;
    this.init();
}
MeshRenderer.inheritsFrom(Component);
MeshRenderer.prototype.init = function () {

    // this.mesh = createCubeMesh();

    //this.setMaterial(Shaders.materials.testing);

    this.setMaterial(new Shaders.materials.Phong({
        kA: [0.0, 0.0, 0.0],
        kD: [1.0, 1.0, 1.0],
        kS: [0.0, 0.0, 0.0],
        roughness: 1,
        specType: SPECULAR_TYPE.PHONG
    }));
};

MeshRenderer.prototype.setMaterial = function (value) {
    this.material = value;
    this.material.preprocess(this.mesh, this.buffers);
};

MeshRenderer.prototype.render = function () {

    let gl = this.gl;
    let lights = App.activeScene.getLightsArray();

    this.material.setActive();

    let modelMatrix,
        viewMatrix,
        projectionMatrix;

    let transform = this.owner.getComponent('transform');

    modelMatrix = transform.getTransformMatrix();
    viewMatrix = App.getViewMatrix();
    projectionMatrix = App.getProjectionMatrix();

    this.material.render(this.mesh, this.buffers, lights, modelMatrix, viewMatrix, projectionMatrix);
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
//     let transform = this.getOwner().getComponent('transform');
//     transform.position = [10*Math.sin(performance.now()/1000),0,-5];
//     //transform.rotation = [0,0,(performance.now()/1000)%(2*Math.PI)];
//     //transform.position = [0, 0, -2];
//     transform.rotation = [0,0,0];
//     transform.scale = [1,1,1];
//
//     let camera = App.activeCamera;
//     let camTransform = camera.getComponent('transform');
//     //camTransform.position = [0, 0, -5];
//     //camTransform.rotation = [0, (performance.now()/1000)%(2*Math.PI), 0];
//     let pMatrix = camera.getComponent('camera').getPerspectiveMatrix();
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


function loadMeshFromObj(path) {
    let file = readTextFile(path);
    while(file.status == FILE_STATUS.IN_PROGRESS) {
        console.log("busy waiting: loading file");
    }

    if(file.status == FILE_STATUS.FAILED) {
        console.log("failed to load file.");
        return null;
    }

    let mesh = new OBJ.Mesh(file.text);
    return {
        vertices: mesh.vertices,
        textureCoords: mesh.textures,
        vertexNormals: mesh.vertexNormals,
        faces: mesh.indices
    };
}

function preScaleMesh(mesh, scale) {
    let m = {
        vertices: [],
        textureCoords: mesh.textureCoords,
        vertexNormals: mesh.vertexNormals,
        faces: mesh.faces
    };
    let v = mesh.vertices;
    let x = scale[0],
        y = scale[1],
        z = scale[2];

    for(let i = 0; i < v.length; i+=3)
    {
        m.vertices.concat([x * v[i], y * v[i+1], z * v[i+2]]);
    }

    return m;
}


function createCubeMesh() {
    let mesh = {};
    mesh.vertices = [
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

    mesh.faces = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
    ];

    mesh.vertexNormals = [
        // Front face
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        // Back face
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        // Top face
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        // Bottom face
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        // Right face
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        // Left face
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ];

    let colors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0]     // Left face: purple
    ];

    let generatedColors = [];

    for (j=0; j<6; j++) {
        var c = colors[j];

        for (var i=0; i<4; i++) {
            generatedColors = generatedColors.concat(c);
        }
    }

    mesh.colors = generatedColors;

    return mesh;
}