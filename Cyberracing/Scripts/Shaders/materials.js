/**
 * Created by tom on 2017-01-13.
 */

var Shaders = Shaders || {};

function initMaterials(gl) {
    let s = Shaders;
    Shaders.materials = Shaders.materials || {};
    let m = Shaders.materials;

    m.testing = new s.Material(gl, s.programs.testing,
            function (mesh, buffers) {

            },
            function (meshBuffers, lightBuffers, mMatrix, vMatrix, pMatrix) {

            });

    m.flatPhong = new s.Material(gl,
                        s.programs.flatPhong,
                        function (mesh, buffers) {
                            buffers.vertices = gl.createBuffer();
                            buffers.vertexNormals = gl.createBuffer();
                            buffers.textureCoords = gl.createBuffer();
                            buffers.faces = gl.createBuffer();

                            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);

                            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexNormals);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);

                            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoords);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textureCoords), gl.STATIC_DRAW);

                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
                            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.faces), gl.STATIC_DRAW);
                        },
                        function (meshBuffers, lightBuffers, mMatrix, vMatrix, pMatrix) {

                        });

    m.flatBlinn = {};

    m.gouraudPhong = {};

    m.gouraudBlinn = {};

    m.phongPhong = {};

    m.phongBlinn = {};

    // TODO: s.phong = new s.Material()
    //
    // TODO: s.gouraud = new s.Material()
    //
    // TODO: different speculars

}

function getMaterial(diffType, specType) {
    let mtl;
    let m = Shaders.materials;
    switch (specType)
    {
        case SPECULAR_TYPE.PHONG:
        {
            switch (diffType)
            {
                case DIFFUSE_TYPE.FLAT:
                    mtl = m.flatPhong;
                    break;
                case DIFFUSE_TYPE.GOURAUD:
                    mtl = m.gouraudPhong;
                    break;
                case DIFFUSE_TYPE.PHONG:
                    mtl = m.phongPhong;
                    break;
                default:
                    return null;
            }
        }
            break;
        case SPECULAR_TYPE.BLINN:
        {
            switch (diffType)
            {
                case DIFFUSE_TYPE.FLAT:
                    mtl = m.flatBlinn;
                    break;
                case DIFFUSE_TYPE.GOURAUD:
                    mtl = m.gouraudBlinn;
                    break;
                case DIFFUSE_TYPE.PHONG:
                    mtl = m.phongBlinn;
                    break;
                default:
                    return null;
            }
        }
            break;
        default:
            return null;
    }
}

var DIFFUSE_TYPE = {
    FLAT: 0,
    GOURAUD: 1,
    PHONG: 2
};

var SPECULAR_TYPE = {
    PHONG: 0,
    BLINN: 1
};