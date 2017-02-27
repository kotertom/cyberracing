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
                if(!buffers.vertices || !gl.isBuffer(buffers.vertices))
                    buffers.vertices = gl.createBuffer();
                if(!buffers.vertexNormals || !gl.isBuffer(buffers.vertexNormals))
                    buffers.vertexNormals = gl.createBuffer();
                if(!buffers.faces || !gl.isBuffer(buffers.faces))
                    buffers.faces = gl.createBuffer();
                if(!buffers.faceCenters || !gl.isBuffer(buffers.faceCenters))
                    buffers.faceCenters = gl.createBuffer();

                duplicateOneFacePerVertex(mesh);

                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexNormals);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.faces), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, buffers.faceCenters);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.faceCenters), gl.STATIC_DRAW);
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
                    locations.uniform.lights[ll] = {};
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
                locations.attribute.faceCenter = gl.getAttribLocation(this.shaderProgram, "aFaceCenter");

                gl.enableVertexAttribArray(locations.attribute.vertexPosition);
                gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffers.vertices);
                gl.vertexAttribPointer(locations.attribute.vertexPosition, 3, gl.FLOAT, false, 0, 0);

                gl.enableVertexAttribArray(locations.attribute.vertexNormal);
                gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffers.vertexNormals);
                gl.vertexAttribPointer(locations.attribute.vertexNormal, 3, gl.FLOAT, false, 0, 0);

                gl.enableVertexAttribArray(locations.attribute.faceCenter);
                gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffers.faceCenters);
                gl.vertexAttribPointer(locations.attribute.faceCenter, 3, gl.FLOAT, false, 0, 0);

                let mv = Matrix4.multiplyMbyM(viewMatrix, modelMatrix);
                let mvp = Matrix4.multiplyMbyM(projectionMatrix, mv);
                let normalMatrix = Matrix3.fromMat4(mv).inverted.transposed.toArray();
                let camera = App.activeCamera;
                let cTransform = camera.getComponent('transform');
                gl.uniformMatrix4fv(locations.uniform.mvpMatrix, false, new Float32Array(mvp));
                gl.uniformMatrix4fv(locations.uniform.mvMatrix, false, new Float32Array(mv));
                gl.uniformMatrix3fv(locations.uniform.normalMatrix, false, new Float32Array(normalMatrix));
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
                    locations.uniform.lights[ll] = {};
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

                let mv = Matrix4.multiplyMbyM(viewMatrix, modelMatrix);
                let mvp = Matrix4.multiplyMbyM(projectionMatrix, mv);
                let normalMatrix = Matrix3.fromMat4(mv).inverted.transposed.toArray();
                let camera = App.activeCamera;
                let cTransform = camera.getComponent('transform');
                gl.uniformMatrix4fv(locations.uniform.mvpMatrix, false, new Float32Array(mvp));
                gl.uniformMatrix4fv(locations.uniform.mvMatrix, false, new Float32Array(mv));
                gl.uniformMatrix3fv(locations.uniform.normalMatrix, false, new Float32Array(normalMatrix));
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
                    locations.uniform.lights[ll] = {};
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

                let mv = Matrix4.multiplyMbyM(viewMatrix, modelMatrix);
                let mvp = Matrix4.multiplyMbyM(projectionMatrix, mv);
                // let normalMatrix = mv.mat4.inverted.transposed.toArray();
                let normalMatrix = Matrix3.fromMat4(mv).inverted.transposed.toArray();
                let camera = App.activeCamera;
                let cTransform = camera.getComponent('transform');
                gl.uniformMatrix4fv(locations.uniform.mvpMatrix, false, new Float32Array(mvp));
                gl.uniformMatrix4fv(locations.uniform.mvMatrix, false, new Float32Array(mv));
                gl.uniformMatrix3fv(locations.uniform.normalMatrix, false, new Float32Array(normalMatrix));
                gl.uniform3fv(locations.uniform.cameraPosition, [0,0,0]);
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


function duplicateOneFacePerVertex(mesh) {
    let newMesh = {};
    for(let array in mesh) {
        newMesh[array] = [];
        for(let elem of mesh[array]) {
            newMesh[array].push(elem);
        }
    }
    newMesh = mesh; // non-functional
    newMesh.faceCenters = [];

    let vertices = newMesh.vertices,
        faces = newMesh.faces,
        vertexNormals = newMesh.vertexNormals;

    let vertexOccurrences = [];
    for(let i = 0; i < faces.length; i++)
    {
        let vertexId = faces[i];
        if(vertexOccurrences[vertexId])
        {
            faces[i] = vertices.length / 3;
            let addr = 3 * vertexId;
            vertices.push(vertices[addr], vertices[addr+1], vertices[addr+2]);
        }
        else
        {
            vertexOccurrences[vertexId] = 1;
        }
    }

    for(let i = 0; i < faces.length; i+=3)
    {
        let face = [faces[i], faces[i+1], faces[i+2]];
        // let verts = [];
        let faceCenter = vec.zero(3);
        for(let vertex of face)
        {
            let addr = 3 * vertex;
            let vert = [vertices[addr], vertices[addr+1], vertices[addr+2]];
            faceCenter = vec.add(faceCenter, vert);
            // verts.push([vertices[addr], vertices[addr+1], vertices[addr+2]]);
        }
        faceCenter = vec.mult(faceCenter, 1/3);
        for(let vertex of face)
        {
            let addr = 3 * vertex;
            newMesh.faceCenters[addr] = faceCenter[0];
            newMesh.faceCenters[addr+1] = faceCenter[1];
            newMesh.faceCenters[addr+2] = faceCenter[2];
        }
        // let triangle = {
        //     p1: verts[0],
        //     p2: verts[1],
        //     p3: verts[2]
        // };
        // let normal = calculateTriangleNormal(triangle);
        let normal = vec.zero(3);
        for(let vertex of face)
        {
            let addr = 3 * vertex;
            let n = [vertexNormals[addr], vertexNormals[addr+1], vertexNormals[addr+2]];
            normal = vec.add(normal, n);
        }
        normal = vec.mult(normal, 1/3);
        for(let vertex of face)
        {
            let addr = 3 * vertex;
            vertexNormals[addr]   = normal[0];
            vertexNormals[addr+1] = normal[1];
            vertexNormals[addr+2] = normal[2];
        }
    }
    return newMesh;
}


function calculateTriangleNormal(triangle) {
    let u = vec.sub(triangle.p2, triangle.p1);
    let v = vec.sub(triangle.p3, triangle.p1);

    let x = u[1]*v[2] - u[2]*v[1];
    let y = u[2]*v[0] - u[0]*v[2];
    let z = u[0]*v[1] - u[1]*v[0];

    return [x,y,z];
}

function cloneArrays(obj) {
    let ret = {};
    for(let array in obj) {
        ret[array] = [];
        for(let elem of obj[array]) {
            ret[array].push(elem);
        }
    }
    return ret;
}