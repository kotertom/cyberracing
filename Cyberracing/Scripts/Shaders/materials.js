/**
 * Created by tom on 2017-01-13.
 */

var Shaders = Shaders || {};

function initMaterials(gl) {
    let s = Shaders;
    Shaders.materials = Shaders.materials || {};
    let m = Shaders.materials;

    m.testing = new s.Material(gl, s.programs.testing, {},
            function (mesh, buffers) {
                buffers.vertices = gl.createBuffer();
                buffers.vertexNormals = gl.createBuffer();
                buffers.faces = gl.createBuffer();
                buffers.colors = gl.createBuffer();

                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.colors), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.faces), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
            },
            function (mesh, meshBuffers, lightBuffers, mMatrix, vMatrix, pMatrix) {
                let locations = {};
                locations.uniform = {};
                locations.attribute = {};

                locations.uniform.mMatrix = gl.getUniformLocation(this.shaderProgram, "uMMatrix");
                locations.uniform.vMatrix = gl.getUniformLocation(this.shaderProgram, "uVMatrix");
                locations.uniform.pMatrix = gl.getUniformLocation(this.shaderProgram, "uPMatrix");

                locations.attribute.vertexPosition = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
                locations.attribute.color = gl.getAttribLocation(this.shaderProgram, "aColor");

                gl.enableVertexAttribArray(locations.attribute.vertexPosition);
                gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffers.vertices);
                gl.vertexAttribPointer(locations.attribute.vertexPosition, 3, gl.FLOAT, false, 0, 0);

                gl.enableVertexAttribArray(locations.attribute.color);
                gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffers.colors);
                gl.vertexAttribPointer(locations.attribute.color, 4, gl.FLOAT, false, 0, 0);

                gl.uniformMatrix4fv(locations.uniform.mMatrix, false, new Float32Array(mMatrix));
                gl.uniformMatrix4fv(locations.uniform.vMatrix, false, new Float32Array(vMatrix));
                gl.uniformMatrix4fv(locations.uniform.pMatrix, false, new Float32Array(pMatrix));

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshBuffers.faces);

                gl.drawElements(gl.TRIANGLES, mesh.faces.length, gl.UNSIGNED_SHORT, 0);
            });



    m.Flat = function (matInfo) {
        s.Material.call(this, gl, s.programs.flat, matInfo,
            function (mesh, buffers) {

            },
            function (mesh, meshBuffers, lightBuffers, modelMatrix, viewMatrix, projectionMatrix) {

            });

    };
    m.Flat.inheritsFrom(s.Material);

    m.Gouraud = function (matInfo) {
        s.Material.call(this, gl, s.programs.gouraud, matInfo,
            function (mesh, buffers) {
                if(!buffers.vertices || !gl.isBuffer(buffers.vertices))
                    buffers.vertices = gl.createBuffer();
                if(!buffers.vertexNormals || !gl.isBuffer(buffers.vertexNormals))
                    buffers.vertexNormals = gl.createBuffer();
                if(! buffers.faces || !gl.isBuffer(buffers.faces))
                    buffers.faces = gl.createBuffer();

                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexNormals);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.faces), gl.STATIC_DRAW);
            },
            function (mesh, meshBuffers, lights, modelMatrix, viewMatrix, projectionMatrix) {
                let locations = {};
                locations.uniform = {};
                locations.attribute = {};

                let materialLocations = [
                    'kA',
                    'kD',
                    'kS',
                    'roughness',
                    'diffColor',
                    'specColor'
                ];

                let lightLocations = [
                    'type',
                    'color',
                    'position',
                    'direction',
                    'angle',
                    'exponent'
                ];

                locations.uniform.mvpMatrix = gl.getUniformLocation(this.shaderProgram, "uMVPMatrix");
                locations.uniform.mvMatrix = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
                locations.uniform.normalMatrix = gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
                locations.uniform.cameraPosition = gl.getUniformLocation(this.shaderProgram, "uCameraPosition");
                locations.uniform.specularType = gl.getUniformLocation(this.shaderProgram, "uSpecularType");
                locations.uniform.numLights = gl.getUniformLocation(this.shaderProgram, "uNumLights");

                locations.uniform.lights = [];
                for(let ll = 0; ll < lights.length; ll++)
                {
                    for(let name of lightLocations)
                    {
                        locations.uniform.lights[ll][name] =
                            gl.getUniformLocation(this.shaderProgram, "uLight[" + ll + "]." + name);
                    }
                }

                locations.uniform.material = {};
                for(let name of materialLocations)
                {
                    locations.uniform.material[name] = gl.getUniformLocation(this.shaderProgram, "uMaterial." + name);
                }

                locations.attribute.vertexPosition = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
                locations.attribute.vertexNormal = gl.getAttribLocation(this.shaderProgram, "aVertexNormal");

                gl.enableVertexAttribArray(locations.attribute.vertexPosition);
                gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffers.vertices);
                gl.vertexAttribPointer(locations.attribute.vertexPosition, 3, gl.FLOAT, false, 0, 0);

                gl.enableVertexAttribArray(locations.attribute.vertexNormal);
                gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffers.vertexNormals);
                gl.vertexAttribPointer(locations.attribute.vertexNormal, 3, gl.FLOAT, false, 0, 0);

                let mv = Matrix.multiplyMbyM(viewMatrix, modelMatrix);
                let mvp = Matrix.multiplyMbyM(projectionMatrix, mv);
                let normalMatrix = Matrix.transpose(Matrix.inverse(mv));
                let camera = App.activeCamera;
                let cTransform = camera.getComposite('transform');
                gl.uniformMatrix4fv(locations.uniform.mvpMatrix, false, new Float32Array(mvp));
                gl.uniformMatrix4fv(locations.uniform.mvMatrix, false, new Float32Array(mv));
                gl.uniformMatrix4fv(locations.uniform.normalMatrix, false, new Float32Array(normalMatrix));
                gl.uniform3fv(locations.uniform.cameraPosition, cTransform.position);
                gl.uniform1i(locations.uniform.specularType, this.specType);
                gl.uniform1i(locations.uniform.numLights, lights.length);


                let u = locations.uniform;
                for(let ll = 0; ll < lights.length; ll++)
                {
                    gl.uniform1i(u.lights[ll].type, lights[ll].type);
                    gl.uniform4fv(u.lights[ll].color, lights[ll].color);
                    gl.uniform3fv(u.lights[ll].position, lights[ll].position);
                    gl.uniform3fv(u.lights[ll].direction, lights[ll].direction);
                    gl.uniform1f(u.lights[ll].angle, lights[ll].angle);
                    gl.uniform1f(u.lights[ll].exponent, lights[ll].exponent);
                }

                gl.uniform3fv(locations.uniform.material.kA, this.kA);
                gl.uniform3fv(locations.uniform.material.kD, this.kD);
                gl.uniform3fv(locations.uniform.material.kS, this.kS);
                gl.uniform1f(locations.uniform.material.roughness, this.roughness);
                gl.uniform4fv(locations.uniform.material.diffColor, this.diffColor);
                gl.uniform4fv(locations.uniform.material.specColor, this.specColor);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshBuffers.faces);
                gl.drawElements(gl.TRIANGLES, mesh.faces.length, gl.UNSIGNED_SHORT, 0);
            });

    };
    m.Gouraud.inheritsFrom(s.Material);

    m.Phong = function (matInfo) {
        s.Material.call(this, gl, s.programs.phong, matInfo,
            function (mesh, buffers) {

            },
            function (mesh, meshBuffers, lightBuffers, modelMatrix, viewMatrix, projectionMatrix) {

            });

    };
    m.Phong.inheritsFrom(s.Material);


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